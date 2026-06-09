import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Clock, Send } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { useUnitPayments } from '@/hooks/useUnitData'
import { useApp } from '@/context/AppContext'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { PaymentStatus } from '@/types'

const statusConfig: Record<PaymentStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'default'; icon: typeof CheckCircle2 }> = {
  pago: { label: 'Pago', variant: 'success', icon: CheckCircle2 },
  pendente: { label: 'Pendente', variant: 'warning', icon: Clock },
  atrasado: { label: 'Atrasado', variant: 'danger', icon: AlertTriangle },
  cancelado: { label: 'Cancelado', variant: 'default', icon: Clock },
}

export function Mensalidades() {
  const payments = useUnitPayments()
  const { selectedUnit } = useApp()

  const totalPendente = payments
    .filter((p) => p.status === 'pendente' || p.status === 'atrasado')
    .reduce((sum, p) => sum + p.amount, 0)

  const atrasados = payments.filter((p) => p.status === 'atrasado').length
  const pagos = payments.filter((p) => p.status === 'pago').length

  return (
    <div>
      <PageHeader
        title="Mensalidades"
        description={`Cobranças da ${selectedUnit.name} — vencimentos e recebimentos`}
        actions={
          <Button variant="secondary">
            <Send className="h-4 w-4" />
            Enviar lembretes
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total pendente"
          value={formatCurrency(totalPendente)}
          icon={Clock}
          iconColor="text-warning"
        />
        <StatCard
          label="Pagamentos em atraso"
          value={atrasados.toString()}
          icon={AlertTriangle}
          iconColor="text-danger"
          delay={0.05}
        />
        <StatCard
          label="Recebidos este mês"
          value={pagos.toString()}
          icon={CheckCircle2}
          iconColor="text-success"
          delay={0.1}
        />
      </div>

      <Card padding="none" className="overflow-hidden">
        <CardHeader className="px-5 pt-5">
          <CardTitle>Histórico de cobranças</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-y border-vertex-700/50 bg-vertex-800/40">
                {['Aluno', 'Valor', 'Vencimento', 'Status', 'Método', 'Ação'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-vertex-400 uppercase tracking-wider">
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
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-vertex-700/30 hover:bg-vertex-700/20 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-medium text-vertex-50">
                      {payment.studentName}
                    </td>
                    <td className="px-5 py-4 text-sm text-vertex-200">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-5 py-4 text-sm text-vertex-300">
                      {formatDate(payment.dueDate)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={config.variant} dot>
                        <StatusIcon className="h-3 w-3 mr-0.5" />
                        {config.label}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-vertex-400">
                      {payment.method ?? '—'}
                    </td>
                    <td className="px-5 py-4">
                      {payment.status !== 'pago' && (
                        <Button variant="outline" size="sm">
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
    </div>
  )
}
