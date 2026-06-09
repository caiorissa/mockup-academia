import { useMemo } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { Users, TrendingUp, UserMinus, Calendar } from 'lucide-react'
import { useUnitMetrics } from '@/hooks/useUnitData'
import { useChartTheme } from '@/hooks/useChartTheme'
import { useApp } from '@/context/AppContext'
import { formatCurrency } from '@/lib/utils'

export function Metricas() {
  const m = useUnitMetrics()
  const chart = useChartTheme()
  const { selectedUnit } = useApp()

  const combinedData = useMemo(
    () =>
      m.revenueHistory.map((item, i) => ({
        month: item.month,
        receita: item.value,
        matriculas: m.enrollmentHistory[i].value,
        retencao: m.retentionHistory[i].value,
      })),
    [m],
  )

  const tooltipStyle = {
    background: chart.tooltipBg,
    border: `1px solid ${chart.tooltipBorder}`,
    borderRadius: '12px',
    fontSize: '12px',
  }

  return (
    <div>
      <PageHeader
        title="Métricas"
        description={`Indicadores estratégicos — ${selectedUnit.name}`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Taxa de retenção"
          value={`${m.retentionRate}%`}
          change={m.retentionChange}
          icon={TrendingUp}
          iconColor="text-success"
        />
        <StatCard
          label="Churn mensal"
          value={`${m.churnRate}%`}
          icon={UserMinus}
          iconColor="text-danger"
          delay={0.05}
        />
        <StatCard
          label="Frequência média"
          value={`${m.avgAttendance}%`}
          icon={Calendar}
          iconColor="text-info"
          delay={0.1}
        />
        <StatCard
          label="Base ativa"
          value={m.activeStudents.toString()}
          change={m.activeStudentsChange}
          icon={Users}
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <Card padding="lg">
          <CardHeader>
            <div>
              <CardTitle>Evolução da retenção</CardTitle>
              <CardDescription>Taxa mensal de permanência (%)</CardDescription>
            </div>
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={m.retentionHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
                <XAxis dataKey="month" stroke={chart.axis} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke={chart.axis}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 2', 'dataMax + 2']}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${value}%`, 'Retenção']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#34D399"
                  strokeWidth={2.5}
                  dot={{ fill: '#34D399', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="lg">
          <CardHeader>
            <div>
              <CardTitle>Novas matrículas</CardTitle>
              <CardDescription>Entradas por mês</CardDescription>
            </div>
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={m.enrollmentHistory} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
                <XAxis dataKey="month" stroke={chart.axis} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={chart.axis} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="#60A5FA" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card padding="lg">
        <CardHeader>
          <div>
            <CardTitle>Visão consolidada</CardTitle>
            <CardDescription>Receita, matrículas e retenção — últimos 6 meses</CardDescription>
          </div>
        </CardHeader>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
              <XAxis dataKey="month" stroke={chart.axis} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                yAxisId="left"
                stroke={chart.axis}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke={chart.axis}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => {
                  if (name === 'receita') return [formatCurrency(Number(value)), 'Receita']
                  if (name === 'retencao') return [`${value}%`, 'Retenção']
                  return [value, 'Matrículas']
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: chart.axis }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="receita"
                name="Receita"
                stroke="#FF6B35"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="matriculas"
                name="Matrículas"
                stroke="#60A5FA"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="retencao"
                name="Retenção"
                stroke="#34D399"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
