import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { QrCode, UserCheck, ScanFace, Clock } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'
import { useUnitCheckIns, useUnitHourlyCheckIns, useUnitMetrics } from '@/hooks/useUnitData'
import { useChartTheme } from '@/hooks/useChartTheme'
import { useApp } from '@/context/AppContext'
import { formatRelative } from '@/lib/utils'
import type { CheckInMethod } from '@/types'

const methodLabels: Record<CheckInMethod, { label: string; icon: typeof QrCode }> = {
  qr: { label: 'QR Code', icon: QrCode },
  manual: { label: 'Manual', icon: UserCheck },
  facial: { label: 'Facial', icon: ScanFace },
}

export function CheckIn() {
  const checkIns = useUnitCheckIns()
  const hourlyCheckIns = useUnitHourlyCheckIns()
  const metrics = useUnitMetrics()
  const chart = useChartTheme()
  const { selectedUnit, addManualCheckIn } = useApp()
  const [manualName, setManualName] = useState('')
  const [justCheckedIn, setJustCheckedIn] = useState(false)
  const shouldReduce = useReducedMotion()

  const handleManualCheckIn = () => {
    if (!manualName.trim()) return
    addManualCheckIn(manualName)
    setJustCheckedIn(true)
    setManualName('')
    setTimeout(() => setJustCheckedIn(false), 3000)
  }

  return (
    <div>
      <PageHeader
        title="Check-in"
        description={`Registro de presença — ${selectedUnit.name}`}
      />

      <ScrollReveal className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <Card padding="lg" className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Check-in manual</CardTitle>
            <CardDescription>Registre a entrada de um aluno</CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nome do aluno..."
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualCheckIn()}
            />
            <Button className="w-full" onClick={handleManualCheckIn}>
              <UserCheck className="h-4 w-4" />
              Registrar entrada
            </Button>
            {justCheckedIn && (
              <motion.div
                initial={shouldReduce ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl bg-success-muted border border-success/20 p-3 text-center"
              >
                <p className="text-sm font-medium text-success">Check-in registrado com sucesso!</p>
              </motion.div>
            )}
          </div>
        </Card>

        <Card padding="lg" className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Fluxo por horário</CardTitle>
              <CardDescription>Check-ins de hoje por faixa horária</CardDescription>
            </div>
            <Badge variant="accent" dot>{metrics.todayCheckIns} hoje</Badge>
          </CardHeader>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyCheckIns} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
                <XAxis dataKey="hour" stroke={chart.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={chart.axis} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: chart.tooltipBg,
                    border: `1px solid ${chart.tooltipBorder}`,
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill={chart.accent} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </ScrollReveal>

      <ScrollReveal delay={0.06}>
      <Card padding="lg">
        <CardHeader>
          <CardTitle>Últimos check-ins</CardTitle>
        </CardHeader>
        <Stagger className="space-y-2">
          {checkIns.length === 0 ? (
            <p className="text-sm text-vertex-400 text-center py-8">
              Nenhum check-in registrado nesta unidade hoje.
            </p>
          ) : (
            checkIns.map((checkin) => {
              const method = methodLabels[checkin.method]
              const MethodIcon = method.icon
              return (
                <StaggerItem key={checkin.id}>
                <div className="flex items-center gap-4 rounded-xl p-4 hover:bg-vertex-700/30 transition-colors duration-200 border border-transparent hover:border-vertex-600/30">
                  <Avatar name={checkin.studentName} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-vertex-50">{checkin.studentName}</p>
                    <p className="text-xs text-vertex-400 mt-0.5">
                      {formatRelative(checkin.timestamp)}
                    </p>
                  </div>
                  <Badge variant="default">
                    <MethodIcon className="h-3 w-3" />
                    {method.label}
                  </Badge>
                  {checkin.duration !== undefined && checkin.duration > 0 && (
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-vertex-300">
                      <Clock className="h-3.5 w-3.5" />
                      {checkin.duration} min
                    </div>
                  )}
                </div>
                </StaggerItem>
              )
            })
          )}
        </Stagger>
      </Card>
      </ScrollReveal>
    </div>
  )
}
