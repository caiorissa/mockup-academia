import { motion } from 'framer-motion'
import {
  Users,
  DollarSign,
  Activity,
  ScanLine,
  UserPlus,
  CreditCard,
  Dumbbell,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/ui/PageHeader'
import { useUnitMetrics } from '@/hooks/useUnitData'
import { useChartTheme } from '@/hooks/useChartTheme'
import { useApp } from '@/context/AppContext'
import { formatCurrency, formatRelative } from '@/lib/utils'

const activityIcons = {
  enrollment: UserPlus,
  payment: CreditCard,
  checkin: ScanLine,
  workout: Dumbbell,
}

const activityColors = {
  enrollment: 'text-info',
  payment: 'text-success',
  checkin: 'text-accent',
  workout: 'text-warning',
}

export function Dashboard() {
  const m = useUnitMetrics()
  const chart = useChartTheme()
  const { selectedUnit, settings } = useApp()

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`${selectedUnit.name} — visão geral da unidade`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Alunos ativos"
          value={m.activeStudents.toString()}
          change={m.activeStudentsChange}
          icon={Users}
          delay={0}
        />
        {settings.preferences.showRevenueInDashboard && (
          <StatCard
            label="Receita mensal"
            value={formatCurrency(m.monthlyRevenue)}
            change={m.monthlyRevenueChange}
            icon={DollarSign}
            iconColor="text-success"
            delay={0.05}
          />
        )}
        <StatCard
          label="Taxa de retenção"
          value={`${m.retentionRate}%`}
          change={m.retentionChange}
          icon={Activity}
          iconColor="text-info"
          delay={0.1}
        />
        <StatCard
          label="Check-ins hoje"
          value={m.todayCheckIns.toString()}
          change={m.todayCheckInsChange}
          icon={ScanLine}
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <Card className="xl:col-span-2" padding="lg">
          <CardHeader>
            <div>
              <CardTitle>Receita mensal</CardTitle>
              <CardDescription>Últimos 6 meses — {selectedUnit.name}</CardDescription>
            </div>
            {m.monthlyRevenueChange !== 0 && (
              <Badge variant={m.monthlyRevenueChange >= 0 ? 'success' : 'danger'} dot>
                {m.monthlyRevenueChange >= 0 ? '+' : ''}{m.monthlyRevenueChange}%
              </Badge>
            )}
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={m.revenueHistory}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chart.accent} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={chart.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
                <XAxis dataKey="month" stroke={chart.axis} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke={chart.axis}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: chart.tooltipBg,
                    border: `1px solid ${chart.tooltipBorder}`,
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [formatCurrency(Number(value)), 'Receita']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={chart.accent}
                  strokeWidth={2}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="lg">
          <CardHeader>
            <div>
              <CardTitle>Distribuição de planos</CardTitle>
              <CardDescription>Por tipo de assinatura</CardDescription>
            </div>
          </CardHeader>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={m.planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {m.planDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: chart.tooltipBg,
                    border: `1px solid ${chart.tooltipBorder}`,
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [`${value}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {m.planDistribution.map((plan) => (
              <div key={plan.name} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ background: plan.color }}
                />
                <span className="text-xs text-vertex-300">{plan.name}</span>
                <span className="text-xs font-medium text-vertex-100 ml-auto">{plan.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Atividade recente</CardTitle>
          </CardHeader>
          <div className="space-y-1">
            {m.recentActivity.length === 0 && (
              <p className="text-sm text-vertex-500 text-center py-6">Nenhuma atividade recente.</p>
            )}
            {m.recentActivity.map((item, i) => {
              const Icon = activityIcons[item.type]
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 rounded-xl p-3 hover:bg-vertex-700/30 transition-colors"
                >
                  <div className={`mt-0.5 ${activityColors[item.type]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-vertex-100">{item.message}</p>
                    <p className="text-xs text-vertex-400 mt-0.5">
                      {formatRelative(item.timestamp)}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Card>

        <Card padding="lg">
          <CardHeader>
            <CardTitle>Alertas rápidos</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-danger-muted border border-danger/20 p-4">
              <div>
                <p className="text-sm font-medium text-danger">Cobranças pendentes</p>
                <p className="text-xs text-vertex-300 mt-0.5">
                  {m.overduePayments === 0
                    ? 'Nenhuma pendência nesta unidade'
                    : `${m.overduePayments} cobrança(s) em aberto`}
                </p>
              </div>
              <span className="text-2xl font-bold text-danger">{m.overduePayments}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-success-muted border border-success/20 p-4">
              <div>
                <p className="text-sm font-medium text-success">Novas matrículas</p>
                <p className="text-xs text-vertex-300 mt-0.5">Este mês</p>
              </div>
              <span className="text-2xl font-bold text-success">{m.newEnrollments}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-warning-muted border border-warning/20 p-4">
              <div>
                <p className="text-sm font-medium text-warning">Taxa de churn</p>
                <p className="text-xs text-vertex-300 mt-0.5">Cancelamentos no mês</p>
              </div>
              <span className="text-2xl font-bold text-warning">{m.churnRate}%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
