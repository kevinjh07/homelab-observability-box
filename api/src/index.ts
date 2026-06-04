import express from "express";
import type { ErrorRequestHandler } from "express";
import { collectDefaultMetrics, Histogram, Registry } from "prom-client";
import { requestLogger } from "./middleware/logger";
import { buildMetricsMiddleware } from "./middleware/metrics";
import { healthRouter } from "./routes/health";
import { buildMetricsRoute } from "./routes/metricsRoute";
import { usersRouter } from "./routes/users";
import { productsRouter } from "./routes/products";
import { ordersRouter } from "./routes/orders";
import { searchRouter } from "./routes/search";

const registry = new Registry();
collectDefaultMetrics({ register: registry });

const requestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [registry],
});

const app = express();
app.use(express.json());
app.use(requestLogger);
app.use(buildMetricsMiddleware(requestDuration));

app.use(healthRouter);
app.use(buildMetricsRoute(registry));
app.use(usersRouter);
app.use(productsRouter);
app.use(ordersRouter);
app.use(searchRouter);

// Error handler: garante resposta 500 padronizada (ex.: JSON malformado no body)
// em vez da página de erro default do Express.
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(
    JSON.stringify({
      level: "error",
      msg: "unhandled error",
      error: err instanceof Error ? err.message : String(err),
    }),
  );
  if (res.headersSent) return;
  res.status(500).json({ error: "internal server error" });
};
app.use(errorHandler);

const port = parseInt(process.env.PORT ?? "3000", 10);
const server = app.listen(port, () => {
  console.log(JSON.stringify({ level: "info", msg: "server started", port }));
});

// Shutdown limpo: para de aceitar conexões e encerra ao receber sinal do Docker,
// evitando requisições cortadas no meio em `docker compose down`.
function shutdown(signal: string): void {
  console.log(JSON.stringify({ level: "info", msg: "shutting down", signal }));
  server.close(() => process.exit(0));
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
