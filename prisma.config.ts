import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Neon : les migrations passent par l'adresse directe (DIRECT_URL), l'application par le pooler (DATABASE_URL).
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
});
