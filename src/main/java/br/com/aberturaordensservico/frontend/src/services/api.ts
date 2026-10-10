import axios from 'axios'
import { normalizeError } from '../utils/errors'

/**
 * Cliente Axios central.
 *
 * O back-end responde em http://localhost:9090, porém não configura CORS (e não pode ser alterado).
 * Em desenvolvimento, `/api` é encaminhado pelo proxy do Vite (vite.config.ts) para http://localhost:9090,
 * então as chamadas funcionam sem erro de CORS. Para apontar direto ao back-end (se ele aceitar CORS),
 * defina VITE_API_URL=http://localhost:9090 no arquivo .env.
 */
export const API_BASE_URL: string = import.meta.env.VITE_API_URL || '/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Qualquer falha vira um ApiError com mensagem amigável + erros por campo.
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeError(error)),
)
