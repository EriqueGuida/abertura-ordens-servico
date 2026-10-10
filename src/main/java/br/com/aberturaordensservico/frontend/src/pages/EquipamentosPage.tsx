import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { equipamentoService } from '../services/equipamentoService'
import { setorService } from '../services/setorService'
import { getErrorMessage, getFieldErrors } from '../utils/errors'
import type { Equipamento, EquipamentoRequest, Setor, ValidationErrors } from '../types'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field, inputClass } from '../components/ui/Field'
import { EmptyState, Spinner } from '../components/ui/Feedback'

// Campos do formulário com os mesmos nomes do EquipamentoRequest (setorId como string no <select>).
const emptyForm = { nome: '', numeroPatrimonio: '', setorId: '' }

export default function EquipamentosPage() {
  const [setores, setSetores] = useState<Setor[]>([])
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [filtroSetorId, setFiltroSetorId] = useState('') // '' = todos
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<Equipamento | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({})
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    setorService.listar().then(setSetores).catch((e) => setError(getErrorMessage(e)))
  }, [])

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const lista = filtroSetorId
        ? await equipamentoService.listarPorSetor(Number(filtroSetorId))
        : await equipamentoService.listar()
      setEquipamentos(lista)
      setError(null)
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [filtroSetorId])

  useEffect(() => {
    void carregar()
  }, [carregar])

  const setField = (name: keyof typeof emptyForm, value: string) => setForm((f) => ({ ...f, [name]: value }))

  const resetForm = () => {
    setForm(emptyForm)
    setEditing(null)
    setFieldErrors({})
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSuccess(null)
    setError(null)

    const payload: EquipamentoRequest = {
      nome: form.nome.trim(),
      numeroPatrimonio: form.numeroPatrimonio.trim(),
      setorId: Number(form.setorId),
    }

    // Validação prévia (espelha as mensagens do back-end); o servidor continua sendo a fonte da verdade.
    const local: ValidationErrors = {}
    if (!payload.nome) local.nome = 'O nome do equipamento não pode ser vazio'
    if (!payload.numeroPatrimonio) local.numeroPatrimonio = 'O número de patrimônio do equipamento não pode ser vazio'
    if (!form.setorId) local.setorId = 'O ID do setor não pode ser nulo'
    if (Object.keys(local).length) {
      setFieldErrors(local)
      return
    }

    setSaving(true)
    setFieldErrors({})
    try {
      if (editing) {
        await equipamentoService.atualizar(editing.id, payload)
        setSuccess('Equipamento atualizado com sucesso.')
      } else {
        await equipamentoService.cadastrar(payload)
        setSuccess('Equipamento cadastrado com sucesso.')
      }
      resetForm()
      await carregar()
    } catch (e) {
      setFieldErrors(getFieldErrors(e))
      setError(getErrorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (eq: Equipamento) => {
    setEditing(eq)
    setForm({ nome: eq.nome, numeroPatrimonio: eq.numeroPatrimonio, setorId: String(eq.setor.id) })
    setFieldErrors({})
    setSuccess(null)
  }

  const handleDelete = async (eq: Equipamento) => {
    if (!window.confirm(`Excluir o equipamento "${eq.nome}"?`)) return
    setSuccess(null)
    try {
      await equipamentoService.excluir(eq.id)
      if (editing?.id === eq.id) resetForm()
      setSuccess('Equipamento excluído.')
      await carregar()
    } catch (e) {
      setError(getErrorMessage(e, 'Não foi possível excluir: o equipamento possui ordens de serviço vinculadas.'))
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card title={editing ? `Editar equipamento #${editing.id}` : 'Novo equipamento'} className="lg:col-span-1 lg:self-start">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field label="Nome" htmlFor="nome" error={fieldErrors.nome}>
            <input id="nome" name="nome" value={form.nome} onChange={(e) => setField('nome', e.target.value)} placeholder="Ex.: Impressora HP" className={inputClass(!!fieldErrors.nome)} />
          </Field>
          <Field
            label="Número de patrimônio"
            htmlFor="numeroPatrimonio"
            error={fieldErrors.numeroPatrimonio}
            hint={editing ? 'O back-end só atualiza o nome do equipamento.' : undefined}
          >
            <input id="numeroPatrimonio" name="numeroPatrimonio" value={form.numeroPatrimonio} onChange={(e) => setField('numeroPatrimonio', e.target.value)} disabled={!!editing} placeholder="Ex.: 000123" className={inputClass(!!fieldErrors.numeroPatrimonio)} />
          </Field>
          <Field label="Setor" htmlFor="setorId" error={fieldErrors.setorId}>
            <select id="setorId" name="setorId" value={form.setorId} onChange={(e) => setField('setorId', e.target.value)} disabled={!!editing} className={inputClass(!!fieldErrors.setorId)}>
              <option value="">Selecione um setor</option>
              {setores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome}
                </option>
              ))}
            </select>
          </Field>
          {setores.length === 0 && <p className="text-xs text-amber-600">Cadastre um setor antes de cadastrar equipamentos.</p>}
          <div className="flex gap-2">
            <Button type="submit" loading={saving}>
              {editing ? 'Salvar alterações' : 'Cadastrar'}
            </Button>
            {editing && (
              <Button variant="secondary" onClick={resetForm}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div className="space-y-4 lg:col-span-2">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

        <Card
          title={`Equipamentos (${equipamentos.length})`}
          action={
            <select aria-label="Filtrar por setor" value={filtroSetorId} onChange={(e) => setFiltroSetorId(e.target.value)} className={`${inputClass()} !w-auto`}>
              <option value="">Todos os setores</option>
              {setores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome}
                </option>
              ))}
            </select>
          }
        >
          {loading ? (
            <Spinner />
          ) : equipamentos.length === 0 ? (
            <EmptyState title="Nenhum equipamento encontrado" description={filtroSetorId ? 'Não há equipamentos neste setor.' : 'Cadastre o primeiro equipamento.'} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Nome</th>
                    <th className="px-3 py-2">Patrimônio</th>
                    <th className="px-3 py-2">Setor</th>
                    <th className="px-3 py-2 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {equipamentos.map((eq) => (
                    <tr key={eq.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 text-slate-500">{eq.id}</td>
                      <td className="px-3 py-2.5 font-medium">{eq.nome}</td>
                      <td className="px-3 py-2.5">{eq.numeroPatrimonio}</td>
                      <td className="px-3 py-2.5">
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">{eq.setor?.nome ?? '—'}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" onClick={() => handleEdit(eq)}>
                            Editar
                          </Button>
                          <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => void handleDelete(eq)}>
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
