"use strict";

const http = require("http");

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000";
const INTERVAL_MS = parseInt(process.env.REQUEST_INTERVAL_MS ?? "500", 10);

const { hostname, port, protocol } = new URL(BASE_URL);

/** @typedef {{ method: string, path: string, body?: string }} Route */

/** @type {Route[]} */
const weightedRoutes = [
  ...Array(25).fill({ method: "GET", path: "/users" }),
  ...Array(15).fill({ method: "GET", path: "/users/1" }),
  ...Array(5).fill({
    method: "POST",
    path: "/users",
    body: JSON.stringify({ name: "test", email: "test@example.com" }),
  }),
  ...Array(15).fill({ method: "GET", path: "/products" }),
  ...Array(10).fill({ method: "GET", path: "/products/1" }),
  ...Array(20).fill({ method: "GET", path: "/orders" }),
  ...Array(5).fill({
    method: "POST",
    path: "/orders",
    body: JSON.stringify({ productId: 1, quantity: 1 }),
  }),
  ...Array(5).fill({ method: "GET", path: "/search?q=homelab" }),
];

/** @returns {Route} */
function pickRoute() {
  return weightedRoutes[Math.floor(Math.random() * weightedRoutes.length)];
}

/** @param {Route} route */
function fireRequest(route) {
  const options = {
    hostname,
    port: port || (protocol === "https:" ? 443 : 80),
    path: route.path,
    method: route.method,
    headers: {
      "Content-Type": "application/json",
      ...(route.body ? { "Content-Length": Buffer.byteLength(route.body) } : {}),
    },
  };

  const req = http.request(options, (res) => {
    res.resume();
    res.on("end", () => {
      process.stdout.write(
        JSON.stringify({
          ts: new Date().toISOString(),
          method: route.method,
          path: route.path,
          status: res.statusCode,
        }) + "\n",
      );
    });
  });

  req.on("error", (err) => {
    process.stderr.write(
      JSON.stringify({ ts: new Date().toISOString(), error: err.message }) + "\n",
    );
  });

  if (route.body) req.write(route.body);
  req.end();
}

console.log(
  JSON.stringify({
    level: "info",
    msg: "generator started",
    base_url: BASE_URL,
    interval_ms: INTERVAL_MS,
  }),
);

setInterval(() => fireRequest(pickRoute()), INTERVAL_MS);
