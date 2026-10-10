import { api } from './api'
import { ApiError } from '../utils/errors'
import type { Equipamento, EquipamentoRequest } from '../types'

/** Endpoints: EquipamentoController (/equipamentos) */
export const equipamentoService = {
  /** GET /equipamentos */
  async listar(): Promise<Equipamento[]> {
    const { data } = await api.get<Equipamento[]>('/equipamentos')
    return data
  },

  /** GET /equipamentos/setor/{setorId} */
  async listarPorSetor(setorId: number): Promise<Equipamento[]> {
    const { data } = await api.get<Equipamento[]>(`/equipamentos/setor/${setorId}`)
    return data
  },

  /** GET /equipamentos/{id} — 200 com corpo vazio quando não existe. */
  async buscarPorId(id: number): Promise<Equipamento> {
    const { data } = await api.get<Equipamento | ''>(`/equipamentos/${id}`)
    if (!data) throw new ApiError('Equipamento não encontrado.', 404)
    return data
  },

  /**
   * POST /equipamentos — corpo: { nome, numeroPatrimonio, setorId }.
   * Quando o setorId não existe, o back-end devolve Optional.empty() => HTTP 200 sem corpo.
   */
  async cadastrar(payload: EquipamentoRequest): Promise<Equipamento> {
    const { data } = await api.post<Equipamento | ''>('/equipamentos', payload)
    if (!data) throw new ApiError('O setor informado não foi encontrado.', 404, { setorId: 'Setor não encontrado' })
    return data
  },

  /**
   * PUT /equipamentos/{id} — o DTO exige os 3 campos (@Valid), mas o service do back-end
   * só persiste o `nome`. Enviamos sempre os valores atuais dos demais campos.
   */
  async atualizar(id: number, payload: EquipamentoRequest): Promise<Equipamento> {
    const { data } = await api.put<Equipamento>(`/equipamentos/${id}`, payload)
    return data
  },

  /** DELETE /equipamentos/{id} — devolve boolean. */
  async excluir(id: number): Promise<void> {
    const { data } = await api.delete<boolean>(`/equipamentos/${id}`)
    if (!data) throw new ApiError('Equipamento não encontrado.', 404)
  },
}
