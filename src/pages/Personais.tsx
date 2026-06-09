import { useState } from 'react'
import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { Plus, Trash2, UserRound } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { isValidPhone } from '@/lib/utils'

export function Personais() {
  const { trainers, addTrainer, removeTrainer, toggleTrainerActive } = useData()
  const { toast } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', specialty: '', phone: '' })

  const handleAdd = () => {
    if (!form.name.trim()) {
      toast('Informe o nome do personal.', 'error')
      return
    }
    if (form.phone && !isValidPhone(form.phone)) {
      toast('Telefone inválido. Use o formato (11) 99999-9999.', 'error')
      return
    }
    addTrainer({
      name: form.name,
      specialty: form.specialty || undefined,
      phone: form.phone || undefined,
    })
    toast(`${form.name} adicionado à equipe!`)
    setForm({ name: '', specialty: '', phone: '' })
    setShowModal(false)
  }

  const handleRemove = (id: string, name: string) => {
    removeTrainer(id)
    toast(`${name} removido da equipe.`)
  }

  return (
    <div>
      <PageHeader
        title="Personais"
        description="Gerencie a equipe de personal trainers da academia"
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" />
            Novo personal
          </Button>
        }
      />

      <Stagger className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {trainers.map((trainer) => (
          <StaggerItem key={trainer.id}>
            <Card hover accent={trainer.active} padding="lg" className={!trainer.active ? 'opacity-60' : ''}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center bg-vertex-700 border border-vertex-600/50 text-accent">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-vertex-50">{trainer.name}</p>
                    {trainer.specialty && (
                      <p className="text-xs text-vertex-500 mt-0.5">{trainer.specialty}</p>
                    )}
                    {trainer.phone && (
                      <p className="text-xs text-vertex-400 mt-0.5">{trainer.phone}</p>
                    )}
                  </div>
                </div>
                <Badge variant={trainer.active ? 'success' : 'default'} dot>
                  {trainer.active ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>

              <div className="flex gap-2 mt-5 pt-4 border-t border-vertex-700/40">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    toggleTrainerActive(trainer.id)
                    toast(
                      trainer.active
                        ? `${trainer.name} desativado.`
                        : `${trainer.name} reativado.`,
                    )
                  }}
                >
                  {trainer.active ? 'Desativar' : 'Reativar'}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemove(trainer.id, trainer.name)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Novo personal"
        description="Cadastrar personal trainer na equipe"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={handleAdd}>Cadastrar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nome completo *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nome do personal"
          />
          <Input
            label="Especialidade"
            value={form.specialty}
            onChange={(e) => setForm({ ...form, specialty: e.target.value })}
            placeholder="Ex: Hipertrofia, Funcional, Cross..."
          />
          <PhoneInput
            label="Telefone"
            value={form.phone}
            onChange={(phone) => setForm({ ...form, phone })}
          />
        </div>
      </Modal>
    </div>
  )
}
