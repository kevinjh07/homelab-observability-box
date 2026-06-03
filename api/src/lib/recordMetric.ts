import type { Histogram } from "prom-client";

interface MetricInput {
  histogram: Histogram;
  method: string;
  route: string;
  statusCode: number;
  durationMs: number;
}

export function recordMetric(input: MetricInput): void {
  input.histogram.observe(
    {
      method: input.method,
      route: input.route,
      status_code: String(input.statusCode),
    },
    input.durationMs / 1000
  );
}
