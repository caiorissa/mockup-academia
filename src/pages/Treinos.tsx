import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ChevronRight, X, Dumbbell } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Modal } from '@/components/ui/Modal'
import { Input, Select } from '@/components/ui/Input'
import { TrainerSelect } from '@/components/ui/TrainerSelect'
import { useUnitWorkouts, useUnitStudents } from '@/hooks/useUnitData'
import { useApp } from '@/context/AppContext'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { formatDate } from '@/lib/utils'
import type { WorkoutSheet } from '@/types'

const goals = ['Hipertrofia', 'Emagrecimento', 'Força', 'Condicionamento', 'Funcional']

export function Treinos() {
  const workoutSheets = useUnitWorkouts()
  const unitStudents = useUnitStudents()
  const { selectedUnit, selectedUnitId } = useApp()
  const { addWorkout, trainers } = useData()
  const { toast } = useToast()

  const [selected, setSelected] = useState<WorkoutSheet | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [form, setForm] = useState({
    studentId: '',
    title: '',
    goal: goals[0],
    trainer: '',
  })

  const defaultTrainer = trainers.find((t) => t.active)?.name ?? ''

  const handleCreate = () => {
    const student = unitStudents.find((s) => s.id === form.studentId)
    if (!student || !form.title.trim()) {
      toast('Selecione um aluno e informe o título da ficha.', 'error')
      return
    }
    addWorkout({
      studentId: student.id,
      studentName: student.name,
      title: form.title,
      goal: form.goal,
      trainer: form.trainer || defaultTrainer,
      unitId: selectedUnitId,
    })
    toast(`Ficha "${form.title}" criada para ${student.name}.`)
    setForm({ studentId: '', title: '', goal: goals[0], trainer: defaultTrainer })
    setShowNewModal(false)
  }

  return (
    <div>
      <PageHeader
        title="Treinos"
        description={`Fichas da ${selectedUnit.name}`}
        actions={
          <Button onClick={() => { setForm((f) => ({ ...f, trainer: f.trainer || defaultTrainer })); setShowNewModal(true) }} disabled={unitStudents.length === 0}>
            <Plus className="h-4 w-4" />
            Nova ficha
          </Button>
        }
      />

      {workoutSheets.length === 0 ? (
        <Card padding="lg" className="text-center" accent>
          <Dumbbell className="h-10 w-10 text-vertex-600 mx-auto mb-3" />
          <p className="text-sm text-vertex-400">Nenhuma ficha nesta unidade.</p>
          <Button className="mt-4" onClick={() => setShowNewModal(true)} disabled={unitStudents.length === 0}>
            <Plus className="h-4 w-4" /> Criar primeira ficha
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workoutSheets.map((sheet, i) => (
            <motion.div key={sheet.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card hover accent className="cursor-pointer" onClick={() => setSelected(sheet)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={sheet.studentName} size="md" />
                    <div>
                      <p className="text-sm font-semibold text-vertex-50">{sheet.studentName}</p>
                      <p className="text-xs text-vertex-500">{sheet.trainer}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-vertex-500" />
                </div>
                <h3 className="font-display text-lg font-bold uppercase text-vertex-50 mb-1">{sheet.title}</h3>
                <Badge variant="accent" className="mb-4">{sheet.goal}</Badge>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-vertex-500 uppercase tracking-wider font-bold">Progresso</span>
                    <span className="font-bold text-accent">{sheet.sessionsCompleted}/{sheet.totalSessions}</span>
                  </div>
                  <ProgressBar value={sheet.progress} />
                </div>
                <p className="text-[10px] text-vertex-500 mt-3 uppercase tracking-wider">
                  Atualizado {formatDate(sheet.updatedAt)}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-vertex-900 border-l border-vertex-700/50 shadow-elevated overflow-y-auto"
            >
              <div className="sticky top-0 flex items-center justify-between p-5 border-b border-vertex-700/50 bg-vertex-900 gym-stripe">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center bg-accent text-on-accent">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold uppercase text-vertex-50">{selected.title}</h2>
                    <p className="text-xs text-vertex-500">{selected.studentName}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelected(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-5 space-y-6">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="accent">{selected.goal}</Badge>
                  <Badge variant="default">Prof. {selected.trainer}</Badge>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-vertex-500">Progresso</span>
                    <span className="font-display text-xl font-bold text-accent">{selected.progress}%</span>
                  </div>
                  <ProgressBar value={selected.progress} />
                </div>
                <div>
                  <CardHeader>
                    <CardTitle>Exercícios</CardTitle>
                    <CardDescription>{selected.exercises.length} exercícios</CardDescription>
                  </CardHeader>
                  <div className="space-y-2">
                    {selected.exercises.map((ex, i) => (
                      <motion.div
                        key={ex.name}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="border border-vertex-600/40 border-l-[3px] border-l-accent bg-vertex-800/60 p-4"
                      >
                        <p className="text-sm font-semibold text-vertex-50">{ex.name}</p>
                        <div className="flex gap-4 mt-2 text-xs text-vertex-500">
                          <span>{ex.sets} séries</span>
                          <span>{ex.reps} reps</span>
                          {ex.load && <span>{ex.load}</span>}
                          <span>Descanso: {ex.rest}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Modal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="Nova ficha"
        description={`Criar ficha de treino na ${selectedUnit.name}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowNewModal(false)}>Cancelar</Button>
            <Button onClick={handleCreate}>Criar ficha</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Aluno *"
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            options={[
              { value: '', label: 'Selecione um aluno' },
              ...unitStudents.map((s) => ({ value: s.id, label: s.name })),
            ]}
          />
          <Input label="Título da ficha *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Hipertrofia — Upper Body" />
          <Select
            label="Objetivo"
            value={form.goal}
            onChange={(e) => setForm({ ...form, goal: e.target.value })}
            options={goals.map((g) => ({ value: g, label: g }))}
          />
          <TrainerSelect
            value={form.trainer || defaultTrainer}
            onChange={(trainer) => setForm({ ...form, trainer })}
          />
        </div>
      </Modal>
    </div>
  )
}
