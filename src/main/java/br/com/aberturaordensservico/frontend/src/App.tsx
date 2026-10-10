import { useState } from 'react'
import { Layout } from './components/layout/Layout'
import type { TabId } from './components/layout/Layout'
import EquipamentosPage from './pages/EquipamentosPage'
import OrdensServicoPage from './pages/OrdensServicoPage'
import SetoresPage from './pages/SetoresPage'

export default function App() {
  const [tab, setTab] = useState<TabId>('ordens')

  return (
    <Layout active={tab} onChange={setTab}>
      {tab === 'ordens' && <OrdensServicoPage />}
      {tab === 'equipamentos' && <EquipamentosPage />}
      {tab === 'setores' && <SetoresPage />}
    </Layout>
  )
}
