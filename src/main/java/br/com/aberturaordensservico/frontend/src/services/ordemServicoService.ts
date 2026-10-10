import { api } from './api'
import { ApiError } from '../utils/errors'
import type { OrdemServico, OrdemServicoRequest } from '../types'

/** Endpoints: OrdemServicoController (/ordens-servico) */
export const ordemServicoService = {
  /** GET /ordens-servico */
  async listar(): Promise<OrdemServico[]> {
    const { data } = await api.get<OrdemServico[]>('/ordens-servico')
    return data
  },

  /** GET /ordens-servico/{id} */
  async buscarPorId(id: number): Promise<OrdemServico> {
    const { data } = await api.get<OrdemServico | ''>(`/ordens-servico/${id}`)
    if (!data) throw new ApiError('Ordem de serviço não encontrada.', 404)
    return data
  },

  /**
   * POST /ordens-servico — corpo: { descricao, equipamentoId }.
   * `dataAbertura` é gerada pelo back-end (LocalDateTime.now()).
   * Se o equipamento não existir, o back-end devolve HTTP 200 sem corpo.
   */
  async abrir(payload: OrdemServicoRequest): Promise<OrdemServico> {
    const { data } = await api.post<OrdemServico | ''>('/ordens-servico', payload)
    if (!data) {
      throw new ApiError('O equipamento informado não foi encontrado.', 404, {
        equipamentoId: 'Equipamento não encontrado',
      })
    }
    return data
  },
}
