import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not set");
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret,
  corsOrigins: (process.env.CORS_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((s) => s.trim()),
};
