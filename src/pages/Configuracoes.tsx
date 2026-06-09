import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import {
  User,
  Building2,
  Bell,
  Palette,
  Shield,
  Monitor,
  Moon,
  Sun,
  Check,
  RotateCcw,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { Avatar } from '@/components/ui/Avatar'
import { useApp } from '@/context/AppContext'
import { units } from '@/data/mock/units'
import { cn } from '@/lib/utils'
import type { ThemeMode } from '@/types'

const themeOptions: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Escuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
]

export function Configuracoes() {
  const {
    theme,
    setTheme,
    settings,
    updateSettings,
    updateNotifications,
    updatePreferences,
    saveSettings,
    resetSettings,
    savedMessage,
  } = useApp()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const shouldReduce = useReducedMotion()

  const handlePasswordChange = () => {
    if (!currentPassword) {
      setPasswordMessage('Informe a senha atual.')
      return
    }
    if (newPassword.length < 8) {
      setPasswordMessage('A nova senha deve ter pelo menos 8 caracteres.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage('As senhas não coincidem.')
      return
    }
    setPasswordMessage('Senha alterada com sucesso!')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setTimeout(() => setPasswordMessage(null), 3000)
  }

  return (
    <div>
      <PageHeader
        title="Configurações da conta"
        description="Gerencie seu perfil, preferências e notificações"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={resetSettings}>
              <RotateCcw className="h-4 w-4" />
              Restaurar padrão
            </Button>
            <Button onClick={saveSettings}>Salvar alterações</Button>
          </div>
        }
      />

      <AnimatePresence>
        {savedMessage && (
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduce ? undefined : { opacity: 0, y: -8 }}
            className="mb-6 flex items-center gap-2 rounded-xl bg-success-muted border border-success/30 px-4 py-3 text-sm text-success"
          >
            <Check className="h-4 w-4 shrink-0" />
            {savedMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ScrollReveal delay={0}>
        <Card padding="lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 border border-accent/25">
                <User className="h-4 w-4 text-accent" />
              </div>
              <div>
                <CardTitle>Perfil</CardTitle>
                <CardDescription>Informações pessoais e de contato</CardDescription>
              </div>
            </div>
          </CardHeader>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-vertex-700/40">
            <Avatar name={settings.name} size="lg" />
            <div>
              <p className="text-sm font-medium text-vertex-100">{settings.name}</p>
              <p className="text-xs text-vertex-400">{settings.role}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-vertex-300 mb-1.5 block">Nome completo</label>
              <Input
                value={settings.name}
                onChange={(e) => updateSettings({ name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-vertex-300 mb-1.5 block">E-mail</label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => updateSettings({ email: e.target.value })}
              />
            </div>
            <PhoneInput
              label="Telefone"
              value={settings.phone}
              onChange={(phone) => updateSettings({ phone })}
            />
            <div>
              <label className="text-xs font-medium text-vertex-300 mb-1.5 block">Cargo</label>
              <Input
                value={settings.role}
                onChange={(e) => updateSettings({ role: e.target.value })}
              />
            </div>
          </div>
        </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
        <Card padding="lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-info-muted border border-info/25">
                <Building2 className="h-4 w-4 text-info" />
              </div>
              <div>
                <CardTitle>Academia</CardTitle>
                <CardDescription>Configurações da rede e unidade padrão</CardDescription>
              </div>
            </div>
          </CardHeader>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-vertex-300 mb-1.5 block">Nome da academia</label>
              <Input
                value={settings.gymName}
                onChange={(e) => updateSettings({ gymName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-vertex-300 mb-1.5 block">Unidade padrão ao entrar</label>
              <select
                value={settings.defaultUnitId}
                onChange={(e) => updateSettings({ defaultUnitId: e.target.value })}
                className="h-10 w-full rounded-xl border border-vertex-600/50 bg-vertex-800/60 px-3 text-sm text-vertex-50 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
              >
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} — {unit.city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
        <Card padding="lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning-muted border border-warning/25">
                <Palette className="h-4 w-4 text-warning" />
              </div>
              <div>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>Tema visual do sistema</CardDescription>
              </div>
            </div>
          </CardHeader>

          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((opt) => {
              const Icon = opt.icon
              const active = theme === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                    active
                      ? 'border-accent bg-accent-muted text-accent shadow-glow'
                      : 'border-vertex-600/40 bg-vertex-900/40 text-vertex-300 hover:border-accent/40 hover:bg-accent-muted/50',
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{opt.label}</span>
                </button>
              )
            })}
          </div>
        </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
        <Card padding="lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success-muted border border-success/25">
                <Bell className="h-4 w-4 text-success" />
              </div>
              <div>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>Escolha o que deseja receber</CardDescription>
              </div>
            </div>
          </CardHeader>

          <div className="space-y-5">
            <Toggle
              checked={settings.notifications.email}
              onChange={(v) => updateNotifications({ email: v })}
              label="Notificações por e-mail"
              description="Receba atualizações importantes no seu e-mail"
            />
            <Toggle
              checked={settings.notifications.push}
              onChange={(v) => updateNotifications({ push: v })}
              label="Notificações push"
              description="Alertas em tempo real no navegador"
            />
            <Toggle
              checked={settings.notifications.overduePayments}
              onChange={(v) => updateNotifications({ overduePayments: v })}
              label="Pagamentos em atraso"
              description="Aviso quando um aluno estiver inadimplente"
            />
            <Toggle
              checked={settings.notifications.newEnrollments}
              onChange={(v) => updateNotifications({ newEnrollments: v })}
              label="Novas matrículas"
              description="Notificar quando um novo aluno se matricular"
            />
            <Toggle
              checked={settings.notifications.dailySummary}
              onChange={(v) => updateNotifications({ dailySummary: v })}
              label="Resumo diário"
              description="Relatório consolidado enviado todo dia às 20h"
            />
          </div>
        </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
        <Card padding="lg">
          <CardHeader>
            <div>
              <CardTitle>Preferências de exibição</CardTitle>
              <CardDescription>Personalize a interface do painel</CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-5">
            <Toggle
              checked={settings.preferences.showRevenueInDashboard}
              onChange={(v) => updatePreferences({ showRevenueInDashboard: v })}
              label="Exibir receita no dashboard"
              description="Mostra o card de receita mensal na página inicial"
            />
            <Toggle
              checked={settings.preferences.compactSidebar}
              onChange={(v) => updatePreferences({ compactSidebar: v })}
              label="Menu lateral compacto"
              description="Reduz o espaçamento dos itens de navegação"
            />
          </div>
        </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.14}>
        <Card padding="lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger-muted border border-danger/25">
                <Shield className="h-4 w-4 text-danger" />
              </div>
              <div>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>Altere sua senha de acesso</CardDescription>
              </div>
            </div>
          </CardHeader>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-vertex-300 mb-1.5 block">Senha atual</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-vertex-300 mb-1.5 block">Nova senha</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-vertex-300 mb-1.5 block">Confirmar nova senha</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
              />
            </div>

            {passwordMessage && (
              <p
                className={cn(
                  'text-xs',
                  passwordMessage.includes('sucesso') ? 'text-success' : 'text-danger',
                )}
              >
                {passwordMessage}
              </p>
            )}

            <Button variant="secondary" onClick={handlePasswordChange}>
              Alterar senha
            </Button>
          </div>
        </Card>
        </ScrollReveal>
      </div>
    </div>
  )
}
