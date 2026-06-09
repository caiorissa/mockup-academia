import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Clock, Send, CreditCard } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Input'
import { useUnitPayments } from '@/hooks/useUnitData'
import { useApp } from '@/context/AppContext'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Payment, PaymentStatus } from '@/types'

const statusConfig: Record<PaymentStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'default'; icon: typeof CheckCircle2 }> = {
  pago: { label: 'Pago', variant: 'success', icon: CheckCircle2 },
  pendente: { label: 'Pendente', variant: 'warning', icon: Clock },
  atrasado: { label: 'Atrasado', variant: 'danger', icon: AlertTriangle },
  cancelado: { label: 'Cancelado', variant: 'default', icon: Clock },
}

const chargeMethods = [
  { value: 'PIX', label: 'PIX' },
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'E-mail', label: 'E-mail' },
  { value: 'SMS', label: 'SMS' },
]

export function Mensalidades() {
  const payments = useUnitPayments()
  const { selectedUnit, selectedUnitId } = useApp()
  const { chargePayment, markPaymentPaid, sendBulkReminders } = useData()
  const { toast } = useToast()

  const [chargeModal, setChargeModal] = useState<Payment | null>(null)
  const [chargeMethod, setChargeMethod] = useState('PIX')
  const [confirmReminders, setConfirmReminders] = useState(false)

  const totalPendente = payments
    .filter((p) => p.status === 'pendente' || p.status === 'atrasado')
    .reduce((sum, p) => sum + p.amount, 0)

  const atrasados = payments.filter((p) => p.status === 'atrasado').length
  const pagos = payments.filter((p) => p.status === 'pago').length
  const pendingCount = payments.filter((p) => p.status === 'pendente' || p.status === 'atrasado').length

  const handleCharge = () => {
    if (!chargeModal) return
    chargePayment(chargeModal.id, chargeMethod)
    toast(`Cobrança via ${chargeMethod} enviada para ${chargeModal.studentName}.`)
    setChargeModal(null)
  }

  const handleMarkPaid = () => {
    if (!chargeModal) return
    markPaymentPaid(chargeModal.id, chargeMethod)
    toast(`Pagamento de ${chargeModal.studentName} confirmado!`)
    setChargeModal(null)
  }

  const handleSendReminders = () => {
    const count = sendBulkReminders(selectedUnitId)
    if (count === 0) {
      toast('Nenhuma cobrança pendente nesta unidade.', 'info')
    } else {
      toast(`${count} lembretes enviados para alunos com pendência.`)
    }
    setConfirmReminders(false)
  }

  return (
    <div>
      <PageHeader
        title="Mensalidades"
        description={`Cobranças da ${selectedUnit.name}`}
        actions={
          <Button
            variant="secondary"
            onClick={() => setConfirmReminders(true)}
            disabled={pendingCount === 0}
          >
            <Send className="h-4 w-4" />
            Enviar lembretes
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total pendente" value={formatCurrency(totalPendente)} icon={Clock} iconColor="text-warning" />
        <StatCard label="Em atraso" value={atrasados.toString()} icon={AlertTriangle} iconColor="text-danger" delay={0.05} />
        <StatCard label="Recebidos" value={pagos.toString()} icon={CheckCircle2} iconColor="text-success" delay={0.1} />
      </div>

      <Card padding="none" className="overflow-hidden" accent>
        <CardHeader className="px-5 pt-5">
          <CardTitle>Histórico de cobranças</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-y border-vertex-700/50 bg-vertex-800/60">
                {['Aluno', 'Valor', 'Vencimento', 'Status', 'Método', 'Ação'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-vertex-500 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, i) => {
                const config = statusConfig[payment.status]
                const StatusIcon = config.icon
                return (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-vertex-700/30 hover:bg-vertex-800/40 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-vertex-50">{payment.studentName}</td>
                    <td className="px-5 py-4 text-sm font-medium text-accent">{formatCurrency(payment.amount)}</td>
                    <td className="px-5 py-4 text-sm text-vertex-400">{formatDate(payment.dueDate)}</td>
                    <td className="px-5 py-4">
                      <Badge variant={config.variant} dot>
                        <StatusIcon className="h-3 w-3 mr-0.5" />
                        {config.label}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-vertex-500">{payment.method ?? '—'}</td>
                    <td className="px-5 py-4">
                      {payment.status !== 'pago' && (
                        <Button variant="outline" size="sm" onClick={() => { setChargeModal(payment); setChargeMethod('PIX') }}>
                          Cobrar
                        </Button>
                      )}
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={!!chargeModal}
        onClose={() => setChargeModal(null)}
        title="Cobrança"
        description={chargeModal ? `${chargeModal.studentName} — ${formatCurrency(chargeModal.amount)}` : ''}
        footer={
          <>
            <Button variant="outline" onClick={() => setChargeModal(null)}>Cancelar</Button>
            <Button variant="secondary" onClick={handleCharge}>
              <Send className="h-4 w-4" /> Enviar cobrança
            </Button>
            <Button onClick={handleMarkPaid}>
              <CreditCard className="h-4 w-4" /> Confirmar pagamento
            </Button>
          </>
        }
      >
        <Select
          label="Canal de cobrança"
          value={chargeMethod}
          onChange={(e) => setChargeMethod(e.target.value)}
          options={chargeMethods}
        />
        <p className="text-xs text-vertex-500 mt-4">
          Envie a cobrança pelo canal selecionado ou confirme o pagamento se o aluno já quitou.
        </p>
      </Modal>

      <Modal
        open={confirmReminders}
        onClose={() => setConfirmReminders(false)}
        title="Enviar lembretes"
        description={`${pendingCount} aluno(s) com cobrança pendente na ${selectedUnit.name}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmReminders(false)}>Cancelar</Button>
            <Button onClick={handleSendReminders}>
              <Send className="h-4 w-4" /> Enviar {pendingCount} lembretes
            </Button>
          </>
        }
      >
        <p className="text-sm text-vertex-300">
          Será enviado um lembrete de pagamento para todos os alunos com mensalidade pendente ou em atraso nesta unidade.
        </p>
      </Modal>
    </div>
  )
}
