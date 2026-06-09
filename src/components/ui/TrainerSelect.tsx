import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Select } from './Input'
import { Input } from './Input'
import { Button } from './Button'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'

interface TrainerSelectProps {
  value: string
  onChange: (name: string) => void
  label?: string
}

export function TrainerSelect({ value, onChange, label = 'Personal trainer' }: TrainerSelectProps) {
  const { trainers, addTrainer } = useData()
  const { toast } = useToast()
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newSpecialty, setNewSpecialty] = useState('')

  const activeTrainers = trainers.filter((t) => t.active)

  const handleAdd = () => {
    if (!newName.trim()) {
      toast('Informe o nome do personal.', 'error')
      return
    }
    const trainer = addTrainer({ name: newName.trim(), specialty: newSpecialty.trim() || undefined })
    onChange(trainer.name)
    setNewName('')
    setNewSpecialty('')
    setShowAdd(false)
    toast(`${trainer.name} adicionado à equipe!`)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Select
            label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            options={
              activeTrainers.length > 0
                ? activeTrainers.map((t) => ({
                    value: t.name,
                    label: t.specialty ? `${t.name} — ${t.specialty}` : t.name,
                  }))
                : [{ value: '', label: 'Nenhum personal cadastrado' }]
            }
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 mb-0"
          onClick={() => setShowAdd((v) => !v)}
          aria-label="Adicionar personal"
          title="Adicionar personal"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {showAdd && (
        <div className="border border-vertex-600/40 border-l-[3px] border-l-accent bg-vertex-800/40 p-3 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-accent">Novo personal</p>
          <Input
            label="Nome"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nome completo"
          />
          <Input
            label="Especialidade"
            value={newSpecialty}
            onChange={(e) => setNewSpecialty(e.target.value)}
            placeholder="Ex: Hipertrofia, Funcional..."
          />
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => setShowAdd(false)}>
              Cancelar
            </Button>
            <Button type="button" size="sm" onClick={handleAdd}>
              Adicionar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
