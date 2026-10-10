/** Converte o LocalDateTime do Java (string ISO ou array) em Date. */
export function parseDataAbertura(value: string | number[] | null | undefined): Date | null {
  if (value == null) return null
  if (Array.isArray(value)) {
    const [y, mo, d, h = 0, mi = 0, s = 0, nano = 0] = value
    return new Date(y, mo - 1, d, h, mi, s, Math.floor(nano / 1_000_000))
  }
  const date = new Date(value) // sem fuso => interpretado como horário local
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDataHora(value: string | number[] | null | undefined): string {
  const date = parseDataAbertura(value)
  if (!date) return '—'
  return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}
