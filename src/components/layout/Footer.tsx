const links = [
  { label: '@caaiio.dev', href: 'https://instagram.com/caaiio.dev' },
  { label: 'github.com/caiorissa', href: 'https://github.com/caiorissa' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/caiorissa' },
]

export function Footer() {
  return (
    <footer className="border-t border-vertex-700/40 bg-vertex-900/70 px-4 lg:px-8 py-5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-vertex-500 text-center sm:text-left">
          Desenvolvido por{' '}
          <span className="font-semibold text-vertex-200">Caio Rissa Silveira</span>
        </p>
        <div className="flex items-center gap-5">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-vertex-500 hover:text-accent transition-colors underline-offset-4 hover:underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
