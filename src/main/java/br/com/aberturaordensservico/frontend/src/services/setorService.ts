import { api } from './api'
import { ApiError } from '../utils/errors'
import type { Setor, SetorRequest } from '../types'

/** Endpoints: SetorController (/setores) */
export const setorService = {
  /** GET /setores */
  async listar(): Promise<Setor[]> {
    const { data } = await api.get<Setor[]>('/setores')
    return data
  },

  /** GET /setores/{id} — o back-end devolve 200 com corpo vazio quando não existe. */
  async buscarPorId(id: number): Promise<Setor> {
    const { data } = await api.get<Setor | ''>(`/setores/${id}`)
    if (!data) throw new ApiError('Setor não encontrado.', 404)
    return data
  },

  /** POST /setores — corpo: { nome } (o endpoint não usa @Valid, então validamos no front). */
  async cadastrar(payload: SetorRequest): Promise<Setor> {
    const { data } = await api.post<Setor>('/setores', payload)
    return data
  },

  /** PUT /setores/{id} — corpo: { nome } */
  async atualizar(id: number, payload: SetorRequest): Promise<Setor> {
    const { data } = await api.put<Setor | ''>(`/setores/${id}`, payload)
    if (!data) throw new ApiError('Setor não encontrado.', 404)
    return data
  },

  /** DELETE /setores/{id} — devolve boolean. */
  async excluir(id: number): Promise<void> {
    const { data } = await api.delete<boolean>(`/setores/${id}`)
    if (!data) throw new ApiError('Setor não encontrado.', 404)
  },
}
