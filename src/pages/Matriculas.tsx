import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Filter, MoreHorizontal, Mail, Phone } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { useUnitStudents } from '@/hooks/useUnitData'
import { useApp } from '@/context/AppContext'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { StudentStatus } from '@/types'

const statusMap: Record<StudentStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'default' }> = {
  ativo: { label: 'Ativo', variant: 'success' },
  pendente: { label: 'Pendente', variant: 'warning' },
  suspenso: { label: 'Suspenso', variant: 'danger' },
  inativo: { label: 'Inativo', variant: 'default' },
}

const planLabels = {
  mensal: 'Mensal',
  trimestral: 'Trimestral',
  semestral: 'Semestral',
  anual: 'Anual',
}

export function Matriculas() {
  const students = useUnitStudents()
  const { selectedUnit } = useApp()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StudentStatus | 'todos'>('todos')

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'todos' || s.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div>
      <PageHeader
        title="Matrículas"
        description={`Alunos da ${selectedUnit.name} — planos e status de matrícula`}
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Nova matrícula
          </Button>
        }
      />

      <Card className="mb-6" padding="md">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />
          <div className="flex items-center gap-2 flex-wrap">
            {(['todos', 'ativo', 'pendente', 'suspenso', 'inativo'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  statusFilter === status
                    ? 'bg-accent/15 text-accent border border-accent/30'
                    : 'text-vertex-300 hover:bg-vertex-700/50 border border-transparent'
                }`}
              >
                {status === 'todos' ? 'Todos' : statusMap[status].label}
              </button>
            ))}
            <Button variant="outline" size="sm" className="ml-auto">
              <Filter className="h-3.5 w-3.5" />
              Filtros
            </Button>
          </div>
        </div>
      </Card>

      <div className="hidden lg:block">
        <Card padding="none" className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-vertex-700/50 bg-vertex-800/40">
                {['Aluno', 'Plano', 'Status', 'Mensalidade', 'Próx. vencimento', 'Frequência', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-vertex-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, i) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-vertex-700/30 hover:bg-vertex-700/20 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={student.name} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-vertex-50">{student.name}</p>
                        <p className="text-xs text-vertex-400">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="accent">{planLabels[student.plan]}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={statusMap[student.status].variant} dot>
                      {statusMap[student.status].label}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-sm text-vertex-200">
                    {formatCurrency(student.monthlyFee)}
                  </td>
                  <td className="px-5 py-4 text-sm text-vertex-300">
                    {formatDate(student.nextDueDate)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-vertex-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${student.attendanceRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-vertex-300">{student.attendanceRate}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {filtered.map((student, i) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card hover>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar name={student.name} />
                  <div>
                    <p className="font-medium text-vertex-50">{student.name}</p>
                    <Badge variant={statusMap[student.status].variant} dot className="mt-1">
                      {statusMap[student.status].label}
                    </Badge>
                  </div>
                </div>
                <Badge variant="accent">{planLabels[student.plan]}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-vertex-300">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3" />
                  {student.email}
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3" />
                  {student.phone}
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-vertex-700/40">
                <span className="text-sm font-medium text-vertex-100">
                  {formatCurrency(student.monthlyFee)}/mês
                </span>
                <span className="text-xs text-vertex-400">
                  Vence {formatDate(student.nextDueDate)}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
