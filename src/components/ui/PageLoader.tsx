export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-vertex-600 border-t-accent"
        role="status"
        aria-label="Carregando"
      />
    </div>
  )
}
