import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ChevronRight, X, Dumbbell } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useUnitWorkouts } from '@/hooks/useUnitData'
import { useApp } from '@/context/AppContext'
import { formatDate } from '@/lib/utils'
import type { WorkoutSheet } from '@/types'

export function Treinos() {
  const workoutSheets = useUnitWorkouts()
  const { selectedUnit } = useApp()
  const [selected, setSelected] = useState<WorkoutSheet | null>(null)

  return (
    <div>
      <PageHeader
        title="Treinos"
        description={`Fichas de treino da ${selectedUnit.name}`}
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Nova ficha
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workoutSheets.map((sheet, i) => (
          <motion.div
            key={sheet.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card
              hover
              className="cursor-pointer"
              onClick={() => setSelected(sheet)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={sheet.studentName} size="md" />
                  <div>
                    <p className="text-sm font-medium text-vertex-50">{sheet.studentName}</p>
                    <p className="text-xs text-vertex-400">{sheet.trainer}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-vertex-400" />
              </div>

              <h3 className="text-base font-semibold text-vertex-50 mb-1">{sheet.title}</h3>
              <Badge variant="accent" className="mb-4">{sheet.goal}</Badge>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-vertex-400">Progresso do ciclo</span>
                  <span className="font-medium text-vertex-200">
                    {sheet.sessionsCompleted}/{sheet.totalSessions} sessões
                  </span>
                </div>
                <ProgressBar value={sheet.progress} />
              </div>

              <p className="text-xs text-vertex-400 mt-3">
                Atualizado em {formatDate(sheet.updatedAt)}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-vertex-900 border-l border-vertex-700/50 shadow-elevated overflow-y-auto"
            >
              <div className="sticky top-0 flex items-center justify-between p-5 border-b border-vertex-700/50 bg-vertex-900/95 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-vertex-50">{selected.title}</h2>
                    <p className="text-xs text-vertex-400">{selected.studentName}</p>
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
                    <span className="text-sm text-vertex-300">Progresso</span>
                    <span className="text-sm font-bold text-accent">{selected.progress}%</span>
                  </div>
                  <ProgressBar value={selected.progress} />
                </div>

                <div>
                  <CardHeader>
                    <CardTitle>Exercícios</CardTitle>
                    <CardDescription>{selected.exercises.length} exercícios na ficha</CardDescription>
                  </CardHeader>
                  <div className="space-y-2">
                    {selected.exercises.map((ex, i) => (
                      <motion.div
                        key={ex.name}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-xl bg-vertex-800/60 border border-vertex-600/30 p-4"
                      >
                        <p className="text-sm font-medium text-vertex-50">{ex.name}</p>
                        <div className="flex gap-4 mt-2 text-xs text-vertex-400">
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
    </div>
  )
}
