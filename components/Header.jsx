export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img
            src="/adipa-icon.png"
            alt="ADIPA"
            className="h-10 w-10 rounded-xl sm:h-11 sm:w-11"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-secondary-navy sm:text-lg">
              ADIPA
            </span>
            <span className="text-xs font-medium text-secondary-navy/60 sm:text-sm">
              Academia Digital de Psicología y Aprendizaje
            </span>
          </div>
        </div>

        <span className="hidden rounded-full bg-primary-gray px-4 py-1.5 text-sm font-medium text-primary-purple sm:inline-block">
          Descubre tu Especialidad
        </span>
      </div>
    </header>
  );
}
