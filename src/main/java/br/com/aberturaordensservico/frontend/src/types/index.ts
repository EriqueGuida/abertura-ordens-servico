/**
 * Tipos espelhando o back-end Spring Boot (br.com.aberturaordensservico).
 * Fonte: model/*.java e dto/*.java
 */

// ---------- model/Setor.java ----------
export interface Setor {
  id: number // Long
  nome: string // @NotBlank
}

/** Corpo de POST /setores e PUT /setores/{id} (o back-end recebe a própria entidade Setor). */
export interface SetorRequest {
  nome: string
}

// ---------- model/Equipamento.java ----------
export interface Equipamento {
  id: number // Long
  nome: string // @NotBlank
  numeroPatrimonio: string // @NotBlank
  setor: Setor // @ManyToOne, @NotNull (serializado aninhado)
}

// ---------- dto/EquipamentoRequest.java ----------
export interface EquipamentoRequest {
  nome: string // @NotBlank
  numeroPatrimonio: string // @NotBlank
  setorId: number // @NotNull (Long)
}

// ---------- model/OrdemServico.java ----------
export interface OrdemServico {
  id: number // Long
  descricao: string
  /**
   * LocalDateTime. Normalmente chega como string ISO ("2026-10-09T10:15:30.123456"),
   * mas dependendo da configuração do Jackson pode chegar como array [ano, mês, dia, h, m, s, nano].
   */
  dataAbertura: string | number[]
  equipamento: Equipamento | null // @ManyToOne
}

// ---------- dto/OrdemServicoRequest.java ----------
export interface OrdemServicoRequest {
  descricao: string // @NotBlank
  equipamentoId: number // @NotNull (Long)
}

// ---------- exception/ValidationExceptionHandler.java ----------
/** Corpo do HTTP 400: { "campo": "mensagem" } (LinkedHashMap<String,String>) */
export type ValidationErrors = Record<string, string>
