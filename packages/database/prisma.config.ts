import "dotenv/config";
import { defineConfig } from "prisma/config";

// For migrations, use DIRECT_URL (port 5432) — the pooler (port 6543) is not supported.
// For runtime, DATABASE_URL (pooler) is fine.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
