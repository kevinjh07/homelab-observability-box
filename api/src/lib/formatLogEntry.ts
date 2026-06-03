export interface LogEntryInput {
  level: "info" | "warn" | "error";
  method: string;
  route: string;
  statusCode: number;
  durationMs: number;
  errorMessage?: string;
}

export function formatLogEntry(input: LogEntryInput): string {
  const base = {
    level: input.level,
    method: input.method,
    route: input.route,
    status_code: input.statusCode,
    duration_ms: input.durationMs,
    ts: new Date().toISOString(),
  };

  if (input.errorMessage !== undefined) {
    return JSON.stringify({ ...base, error: input.errorMessage });
  }

  return JSON.stringify(base);
}
