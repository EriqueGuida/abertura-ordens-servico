import axios from 'axios'
import type { ValidationErrors } from '../types'

/** Erro normalizado, lançado por todos os serviços. */
export class ApiError extends Error {
  readonly status: number | null
  /** Preenchido quando o ValidationExceptionHandler responde 400 com { campo: mensagem }. */
  readonly fieldErrors: ValidationErrors

  constructor(message: string, status: number | null = null, fieldErrors: ValidationErrors = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

const isStringMap = (v: unknown): v is ValidationErrors =>
  typeof v === 'object' &&
  v !== null &&
  !Array.isArray(v) &&
  Object.keys(v).length > 0 &&
  Object.values(v).every((x) => typeof x === 'string')

/**
 * Converte qualquer erro do axios em ApiError.
 * Formatos tratados:
 *  - 400 do ValidationExceptionHandler: { campo: mensagem }
 *  - 404 com texto puro (ex.: "Equipamento não encontrado")
 *  - erros padrão do Spring ({ message | detail | error, status, path ... })
 *  - falha de rede (back-end fora do ar)
 */
export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return new ApiError(
        'Não foi possível conectar ao servidor. Verifique se o back-end está em execução (porta 9090).',
      )
    }

    const { status, data } = error.response

    // Corpo de validação: só pares campo -> mensagem (e não o JSON padrão de erro do Spring)
    if (status === 400 && isStringMap(data) && !('status' in data) && !('error' in data)) {
      return new ApiError(Object.values(data).join(' • '), status, data)
    }

    if (typeof data === 'string' && data.trim()) return new ApiError(data, status)

    if (data && typeof data === 'object') {
      const d = data as Record<string, unknown>
      const text = [d.message, d.detail, d.error].find((x) => typeof x === 'string' && x.trim()) as
        | string
        | undefined
      if (status < 500 && text) return new ApiError(text, status)
    }

    if (status === 400) return new ApiError('Requisição inválida. Verifique os dados informados.', status)
    if (status === 404) return new ApiError('Registro não encontrado.', status)
    return new ApiError('O servidor encontrou um erro ao processar a solicitação. Tente novamente.', status)
  }

  return new ApiError(error instanceof Error ? error.message : 'Erro inesperado.')
}

/**
 * Mensagem amigável para exibir na tela.
 * `serverErrorFallback` substitui a mensagem genérica de HTTP 5xx (útil em exclusões,
 * onde o 500 costuma significar violação de chave estrangeira).
 */
export function getErrorMessage(error: unknown, serverErrorFallback?: string): string {
  const e = normalizeError(error)
  if (serverErrorFallback && e.status !== null && e.status >= 500) return serverErrorFallback
  return e.message
}

/** Erros por campo (para mostrar abaixo de cada input). */
export function getFieldErrors(error: unknown): ValidationErrors {
  return normalizeError(error).fieldErrors
}
