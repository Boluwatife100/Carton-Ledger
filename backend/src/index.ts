import { createApp } from "./app";
import { config } from "./config";
import { prisma } from "./lib/prisma";

const server = createApp().listen(config.port, () => {
  console.log(`API running on http://localhost:${config.port}`);
});

const shutdown = async () => {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
