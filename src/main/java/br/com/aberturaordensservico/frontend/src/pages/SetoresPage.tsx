import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { setorService } from '../services/setorService'
import { getErrorMessage, getFieldErrors } from '../utils/errors'
import type { Setor, ValidationErrors } from '../types'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field, inputClass } from '../components/ui/Field'
import { EmptyState, Spinner } from '../components/ui/Feedback'

export default function SetoresPage() {
  const [setores, setSetores] = useState<Setor[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [nome, setNome] = useState('')
  const [editing, setEditing] = useState<Setor | null>(null)
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({})
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      setSetores(await setorService.listar())
      setError(null)
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void carregar()
  }, [carregar])

  const resetForm = () => {
    setNome('')
    setEditing(null)
    setFieldErrors({})
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSuccess(null)
    setError(null)

    // POST /setores não usa @Valid no back-end, então validamos aqui para não gravar nome vazio.
    if (!nome.trim()) {
      setFieldErrors({ nome: 'O nome do setor não pode ser vazio' })
      return
    }

    setSaving(true)
    setFieldErrors({})
    try {
      if (editing) {
        await setorService.atualizar(editing.id, { nome: nome.trim() })
        setSuccess('Setor atualizado com sucesso.')
      } else {
        await setorService.cadastrar({ nome: nome.trim() })
        setSuccess('Setor cadastrado com sucesso.')
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

  const handleEdit = (setor: Setor) => {
    setEditing(setor)
    setNome(setor.nome)
    setFieldErrors({})
    setSuccess(null)
  }

  const handleDelete = async (setor: Setor) => {
    if (!window.confirm(`Excluir o setor "${setor.nome}"?`)) return
    setSuccess(null)
    try {
      await setorService.excluir(setor.id)
      if (editing?.id === setor.id) resetForm()
      setSuccess('Setor excluído.')
      await carregar()
    } catch (e) {
      // Um 500 aqui normalmente é violação de chave estrangeira (há equipamentos no setor).
      setError(getErrorMessage(e, 'Não foi possível excluir: o setor possui equipamentos vinculados.'))
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card title={editing ? `Editar setor #${editing.id}` : 'Novo setor'} className="lg:col-span-1 lg:self-start">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field label="Nome do setor" htmlFor="nome" error={fieldErrors.nome}>
            <input
              id="nome"
              name="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Manutenção"
              className={inputClass(!!fieldErrors.nome)}
            />
          </Field>
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

        <Card title={`Setores (${setores.length})`}>
          {loading ? (
            <Spinner />
          ) : setores.length === 0 ? (
            <EmptyState title="Nenhum setor cadastrado" description="Cadastre o primeiro setor no formulário ao lado." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Nome</th>
                    <th className="px-3 py-2 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {setores.map((setor) => (
                    <tr key={setor.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 text-slate-500">{setor.id}</td>
                      <td className="px-3 py-2.5 font-medium">{setor.nome}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" onClick={() => handleEdit(setor)}>
                            Editar
                          </Button>
                          <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => void handleDelete(setor)}>
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
