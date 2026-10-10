import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { equipamentoService } from '../services/equipamentoService'
import { ordemServicoService } from '../services/ordemServicoService'
import { setorService } from '../services/setorService'
import { getErrorMessage, getFieldErrors } from '../utils/errors'
import { formatDataHora, parseDataAbertura } from '../utils/format'
import type { Equipamento, OrdemServico, OrdemServicoRequest, Setor, ValidationErrors } from '../types'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field, inputClass } from '../components/ui/Field'
import { EmptyState, Spinner } from '../components/ui/Feedback'

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

export default function OrdensServicoPage() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([])
  const [setores, setSetores] = useState<Setor[]>([])
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [setorSelecionado, setSetorSelecionado] = useState('') // apenas auxiliar de UI: não é enviado
  const [form, setForm] = useState({ descricao: '', equipamentoId: '' })
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({})
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      setOrdens(await ordemServicoService.listar())
      setError(null)
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void carregar()
    setorService.listar().then(setSetores).catch((e) => setError(getErrorMessage(e)))
  }, [carregar])

  // Equipamentos disponíveis no formulário: do setor escolhido, ou todos.
  useEffect(() => {
    const request = setorSelecionado
      ? equipamentoService.listarPorSetor(Number(setorSelecionado))
      : equipamentoService.listar()
    request.then(setEquipamentos).catch((e) => setError(getErrorMessage(e)))
  }, [setorSelecionado])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSuccess(null)
    setError(null)

    const local: ValidationErrors = {}
    if (!form.descricao.trim()) local.descricao = 'A descrição da ordem de serviço não pode ser vazia'
    if (!form.equipamentoId) local.equipamentoId = 'O ID do equipamento da ordem de serviço não pode ser nulo'
    if (Object.keys(local).length) {
      setFieldErrors(local)
      return
    }

    const payload: OrdemServicoRequest = {
      descricao: form.descricao.trim(),
      equipamentoId: Number(form.equipamentoId),
    }

    setSaving(true)
    setFieldErrors({})
    try {
      const nova = await ordemServicoService.abrir(payload)
      setSuccess(`Ordem de serviço #${nova.id} aberta com sucesso.`)
      setForm({ descricao: '', equipamentoId: '' })
      await carregar()
    } catch (e) {
      setFieldErrors(getFieldErrors(e))
      setError(getErrorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  // Mais recentes primeiro + busca por descrição/equipamento/setor
  const ordensVisiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return [...ordens]
      .sort((a, b) => (parseDataAbertura(b.dataAbertura)?.getTime() ?? 0) - (parseDataAbertura(a.dataAbertura)?.getTime() ?? 0))
      .filter((os) =>
        !termo
          ? true
          : [os.descricao, os.equipamento?.nome, os.equipamento?.numeroPatrimonio, os.equipamento?.setor?.nome]
              .filter(Boolean)
              .some((t) => String(t).toLowerCase().includes(termo)),
      )
  }, [ordens, busca])

  const stats = useMemo(() => {
    const hoje = new Date().toDateString()
    return {
      total: ordens.length,
      hoje: ordens.filter((os) => parseDataAbertura(os.dataAbertura)?.toDateString() === hoje).length,
      equipamentos: new Set(ordens.map((os) => os.equipamento?.id).filter((id) => id != null)).size,
    }
  }, [ordens])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total de OS" value={stats.total} />
        <Stat label="Abertas hoje" value={stats.hoje} />
        <Stat label="Equipamentos com OS" value={stats.equipamentos} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Abrir nova OS" className="lg:col-span-1 lg:self-start">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Field label="Setor" htmlFor="setorAux" hint="Filtra os equipamentos da lista abaixo.">
              <select
                id="setorAux"
                value={setorSelecionado}
                onChange={(e) => {
                  setSetorSelecionado(e.target.value)
                  setForm((f) => ({ ...f, equipamentoId: '' }))
                }}
                className={inputClass()}
              >
                <option value="">Todos os setores</option>
                {setores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Equipamento" htmlFor="equipamentoId" error={fieldErrors.equipamentoId}>
              <select id="equipamentoId" name="equipamentoId" value={form.equipamentoId} onChange={(e) => setForm((f) => ({ ...f, equipamentoId: e.target.value }))} className={inputClass(!!fieldErrors.equipamentoId)}>
                <option value="">Selecione um equipamento</option>
                {equipamentos.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.nome} — {eq.numeroPatrimonio}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Descrição do problema" htmlFor="descricao" error={fieldErrors.descricao}>
              <textarea id="descricao" name="descricao" rows={4} value={form.descricao} onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))} placeholder="Descreva o que precisa ser feito..." className={inputClass(!!fieldErrors.descricao)} />
            </Field>
            <Button type="submit" loading={saving}>
              Abrir ordem de serviço
            </Button>
          </form>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

          <Card
            title={`Ordens de serviço (${ordensVisiveis.length})`}
            action={
              <div className="flex items-center gap-2">
                <input type="search" aria-label="Buscar ordens" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar..." className={`${inputClass()} !w-48`} />
                <Button variant="secondary" onClick={() => void carregar()}>
                  Atualizar
                </Button>
              </div>
            }
          >
            {loading ? (
              <Spinner />
            ) : ordensVisiveis.length === 0 ? (
              <EmptyState title="Nenhuma ordem de serviço encontrada" description={busca ? 'Tente outro termo de busca.' : 'Abra a primeira OS no formulário ao lado.'} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Nº</th>
                      <th className="px-3 py-2">Abertura</th>
                      <th className="px-3 py-2">Equipamento</th>
                      <th className="px-3 py-2">Setor</th>
                      <th className="px-3 py-2">Descrição</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ordensVisiveis.map((os) => (
                      <tr key={os.id} className="align-top hover:bg-slate-50">
                        <td className="px-3 py-2.5 font-medium text-slate-500">#{os.id}</td>
                        <td className="whitespace-nowrap px-3 py-2.5">{formatDataHora(os.dataAbertura)}</td>
                        <td className="px-3 py-2.5">
                          <div className="font-medium">{os.equipamento?.nome ?? '—'}</div>
                          <div className="text-xs text-slate-500">{os.equipamento?.numeroPatrimonio}</div>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">{os.equipamento?.setor?.nome ?? '—'}</span>
                        </td>
                        <td className="max-w-xs px-3 py-2.5 text-slate-700">{os.descricao}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
