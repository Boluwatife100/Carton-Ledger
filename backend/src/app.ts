import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { config } from "./config";
import { errorHandler, notFound } from "./middleware/errorHandler";
import authRoutes from "./routes/auth";
import expenseRoutes from "./routes/expenses";
import reportRoutes from "./routes/reports";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.corsOrigins, credentials: true }));
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use(
    "/api/auth",
    rateLimit({ windowMs: 15 * 60 * 1000, limit: 50, standardHeaders: "draft-7", legacyHeaders: false }),
    authRoutes
  );
  app.use("/api/expenses", expenseRoutes);
  app.use("/api/reports", reportRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
