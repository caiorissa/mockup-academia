export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-10 w-10 border-2 border-vertex-600 border-t-accent animate-spin"
          role="status"
          aria-label="Carregando"
        />
        <p className="text-[10px] font-bold uppercase tracking-widest text-vertex-500">Carregando</p>
      </div>
    </div>
  )
}
