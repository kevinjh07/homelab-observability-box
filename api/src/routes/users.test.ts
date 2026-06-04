import { describe, it, expect, vi } from "vitest";
import express from "express";
import request from "supertest";

vi.mock("../lib/simulateDelay", () => ({ simulateDelay: vi.fn().mockResolvedValue(undefined) }));
vi.mock("../lib/simulateError", () => ({ shouldFail: vi.fn().mockReturnValue(false) }));

import { usersRouter } from "./users";

const app = express();
app.use(express.json());
app.use(usersRouter);

describe("GET /users", () => {
  it("returns 200 with an array", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("returns 500 when error is injected", async () => {
    const { shouldFail } = await import("../lib/simulateError");
    vi.mocked(shouldFail).mockReturnValueOnce(true);
    const res = await request(app).get("/users");
    expect(res.status).toBe(500);
  });
});

describe("GET /users/:id", () => {
  it("returns 200 with a user object", async () => {
    const res = await request(app).get("/users/1");
    expect(res.status).toBe(200);
    const body = res.body as Record<string, unknown>;
    expect(body.id).toBe(1);
  });

  it("returns 500 when error is injected", async () => {
    const { shouldFail } = await import("../lib/simulateError");
    vi.mocked(shouldFail).mockReturnValueOnce(true);
    const res = await request(app).get("/users/1");
    expect(res.status).toBe(500);
  });
});

describe("POST /users", () => {
  it("returns 201 with created user", async () => {
    const res = await request(app)
      .post("/users")
      .send({ name: "Alice", email: "alice@example.com" });
    expect(res.status).toBe(201);
    const body = res.body as Record<string, unknown>;
    expect(typeof body.id).toBe("number");
    expect(body.name).toBe("Alice");
  });

  it("returns 500 when error is injected", async () => {
    const { shouldFail } = await import("../lib/simulateError");
    vi.mocked(shouldFail).mockReturnValueOnce(true);
    const res = await request(app).post("/users").send({ name: "Bob", email: "bob@example.com" });
    expect(res.status).toBe(500);
  });
});
