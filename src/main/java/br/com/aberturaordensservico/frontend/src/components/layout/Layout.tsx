import type { ReactNode } from 'react'

export type TabId = 'ordens' | 'equipamentos' | 'setores'

const tabs: { id: TabId; label: string }[] = [
  { id: 'ordens', label: 'Ordens de Serviço' },
  { id: 'equipamentos', label: 'Equipamentos' },
  { id: 'setores', label: 'Setores' },
]

interface LayoutProps {
  active: TabId
  onChange: (tab: TabId) => void
  children: ReactNode
}

export function Layout({ active, onChange, children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg font-bold text-slate-900">
            <span className="text-indigo-600">OS</span> · Abertura de Ordens de Serviço
          </h1>
          <nav className="flex gap-1 overflow-x-auto" aria-label="Navegação principal">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChange(tab.id)}
                aria-current={active === tab.id ? 'page' : undefined}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active === tab.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">{children}</main>
    </div>
  )
}
