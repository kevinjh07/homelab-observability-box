import express from "express";
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

const port = parseInt(process.env.PORT ?? "3000", 10);
app.listen(port, () => {
  console.log(JSON.stringify({ level: "info", msg: "server started", port }));
});
