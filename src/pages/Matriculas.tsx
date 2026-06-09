import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Filter, MoreHorizontal, Mail, Phone, UserX, UserCheck, MessageCircle } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { TrainerSelect } from '@/components/ui/TrainerSelect'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { useUnitStudents } from '@/hooks/useUnitData'
import { useApp } from '@/context/AppContext'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { formatCurrency, formatDate, isValidPhone } from '@/lib/utils'
import type { PlanType, StudentStatus } from '@/types'

const statusMap: Record<StudentStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'default' }> = {
  ativo: { label: 'Ativo', variant: 'success' },
  pendente: { label: 'Pendente', variant: 'warning' },
  suspenso: { label: 'Suspenso', variant: 'danger' },
  inativo: { label: 'Inativo', variant: 'default' },
}

const planLabels: Record<PlanType, string> = {
  mensal: 'Mensal',
  trimestral: 'Trimestral',
  semestral: 'Semestral',
  anual: 'Anual',
}

const planFees: Record<PlanType, number> = {
  mensal: 219.9,
  trimestral: 199.9,
  semestral: 179.9,
  anual: 169.9,
}

export function Matriculas() {
  const students = useUnitStudents()
  const { selectedUnit, selectedUnitId } = useApp()
  const { addStudent, updateStudentStatus, trainers } = useData()
  const { toast } = useToast()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StudentStatus | 'todos'>('todos')
  const [planFilter, setPlanFilter] = useState<PlanType | 'todos'>('todos')
  const [showFilters, setShowFilters] = useState(false)
  const [showNewModal, setShowNewModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'mensal' as PlanType,
    trainer: '',
  })

  const defaultTrainer = trainers.find((t) => t.active)?.name ?? ''

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'todos' || s.status === statusFilter
    const matchPlan = planFilter === 'todos' || s.plan === planFilter
    return matchSearch && matchStatus && matchPlan
  })

  const handleNewEnrollment = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast('Preencha todos os campos obrigatórios.', 'error')
      return
    }
    if (!isValidPhone(form.phone)) {
      toast('Telefone inválido. Use o formato (11) 99999-9999.', 'error')
      return
    }
    addStudent({
      ...form,
      trainer: form.trainer || defaultTrainer,
      unitId: selectedUnitId,
      monthlyFee: planFees[form.plan],
    })
    toast(`Matrícula de ${form.name} criada com sucesso!`)
    setForm({ name: '', email: '', phone: '', plan: 'mensal', trainer: defaultTrainer })
    setShowNewModal(false)
  }

  const handleStatusChange = (id: string, status: StudentStatus, name: string) => {
    updateStudentStatus(id, status)
    toast(`Status de ${name} atualizado para ${statusMap[status].label}.`)
    setMenuOpen(null)
  }

  const handleContact = (student: { name: string; email: string; phone: string }) => {
    window.open(`mailto:${student.email}?subject=VÉRTEX - ${student.name}`, '_blank')
    toast(`Abrindo e-mail para ${student.name}.`)
    setMenuOpen(null)
  }

  return (
    <div>
      <PageHeader
        title="Matrículas"
        description={`Alunos da ${selectedUnit.name}`}
        actions={
          <Button onClick={() => { setForm((f) => ({ ...f, trainer: f.trainer || defaultTrainer })); setShowNewModal(true) }}>
            <Plus className="h-4 w-4" />
            Nova matrícula
          </Button>
        }
      />

      <Card className="mb-6" padding="md" accent>
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
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                  statusFilter === status
                    ? 'bg-accent text-vertex-950'
                    : 'text-vertex-400 hover:text-accent border border-vertex-600/40'
                }`}
              >
                {status === 'todos' ? 'Todos' : statusMap[status].label}
              </button>
            ))}
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => setShowFilters((v) => !v)}>
              <Filter className="h-3.5 w-3.5" />
              Filtros
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-vertex-700/40 flex flex-wrap gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-vertex-500 w-full mb-1">Plano</span>
                {(['todos', 'mensal', 'trimestral', 'semestral', 'anual'] as const).map((plan) => (
                  <button
                    key={plan}
                    type="button"
                    onClick={() => setPlanFilter(plan)}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                      planFilter === plan
                        ? 'bg-accent text-vertex-950'
                        : 'text-vertex-400 hover:text-accent border border-vertex-600/40'
                    }`}
                  >
                    {plan === 'todos' ? 'Todos' : planLabels[plan]}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <div className="hidden lg:block">
        <Card padding="none" className="overflow-hidden" accent>
          <table className="w-full">
            <thead>
              <tr className="border-b border-vertex-700/50 bg-vertex-800/60">
                {['Aluno', 'Plano', 'Status', 'Mensalidade', 'Próx. vencimento', 'Frequência', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-vertex-500 uppercase tracking-widest">
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
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-vertex-700/30 hover:bg-vertex-800/40 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={student.name} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-vertex-50">{student.name}</p>
                        <p className="text-xs text-vertex-500">{student.email}</p>
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
                  <td className="px-5 py-4 text-sm font-medium text-vertex-200">
                    {formatCurrency(student.monthlyFee)}
                  </td>
                  <td className="px-5 py-4 text-sm text-vertex-400">
                    {formatDate(student.nextDueDate)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-vertex-700 overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: `${student.attendanceRate}%` }} />
                      </div>
                      <span className="text-xs text-vertex-400">{student.attendanceRate}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setMenuOpen(menuOpen === student.id ? null : student.id)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    {menuOpen === student.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-5 top-12 z-20 w-44 border border-vertex-600/50 bg-vertex-900 shadow-elevated py-1"
                      >
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-vertex-300 hover:bg-vertex-800 hover:text-accent"
                          onClick={() => handleContact(student)}
                        >
                          <MessageCircle className="h-3.5 w-3.5" /> Contatar
                        </button>
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-vertex-300 hover:bg-vertex-800 hover:text-success"
                          onClick={() => handleStatusChange(student.id, 'ativo', student.name)}
                        >
                          <UserCheck className="h-3.5 w-3.5" /> Ativar
                        </button>
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-vertex-300 hover:bg-vertex-800 hover:text-danger"
                          onClick={() => handleStatusChange(student.id, 'suspenso', student.name)}
                        >
                          <UserX className="h-3.5 w-3.5" /> Suspender
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div className="lg:hidden space-y-3">
        {filtered.map((student, i) => (
          <motion.div key={student.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card hover accent>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar name={student.name} />
                  <div>
                    <p className="font-semibold text-vertex-50">{student.name}</p>
                    <Badge variant={statusMap[student.status].variant} dot className="mt-1">
                      {statusMap[student.status].label}
                    </Badge>
                  </div>
                </div>
                <Badge variant="accent">{planLabels[student.plan]}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-vertex-400">
                <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{student.email}</div>
                <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{student.phone}</div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-vertex-700/40">
                <span className="text-sm font-bold text-accent">{formatCurrency(student.monthlyFee)}/mês</span>
                <span className="text-xs text-vertex-500">Vence {formatDate(student.nextDueDate)}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="Nova matrícula"
        description={`Cadastrar aluno na ${selectedUnit.name}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowNewModal(false)}>Cancelar</Button>
            <Button onClick={handleNewEnrollment}>Confirmar matrícula</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nome completo *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome do aluno" />
          <Input label="E-mail *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@exemplo.com" />
          <PhoneInput label="Telefone *" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} />
          <Select
            label="Plano"
            value={form.plan}
            onChange={(e) => setForm({ ...form, plan: e.target.value as PlanType })}
            options={Object.entries(planLabels).map(([v, l]) => ({ value: v, label: `${l} — ${formatCurrency(planFees[v as PlanType])}` }))}
          />
          <TrainerSelect
            label="Personal trainer"
            value={form.trainer || defaultTrainer}
            onChange={(trainer) => setForm({ ...form, trainer })}
          />
        </div>
      </Modal>
    </div>
  )
}
