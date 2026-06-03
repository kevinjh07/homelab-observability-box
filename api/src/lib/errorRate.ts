const DEFAULT_ERROR_RATE = 0.05;

/**
 * Faz o parse da taxa de erro vinda do ambiente, com guarda contra NaN.
 * Valores ausentes ou inválidos (ex.: "abc") caem no fallback, em vez de
 * desligar silenciosamente a injeção de erro.
 */
export function parseErrorRate(
  value: string | undefined,
  fallback: number = DEFAULT_ERROR_RATE
): number {
  if (value === undefined) return fallback;
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) return fallback;
  return parsed;
}

/** Taxa de erro base, resolvida uma única vez a partir do ambiente. */
export const errorRate = parseErrorRate(process.env.ERROR_RATE);
