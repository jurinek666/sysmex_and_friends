export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              SYSMEX & Friends
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Nejlepší kvízový tým ve městě.
            </p>
          </div>
          
          <p className="text-sm text-gray-400">
            &copy; {currentYear} Všechna práva vyhrazena.
          </p>
        </div>
      </div>
    </footer>
  );
}