import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Kita tembak langsung filenya ke database Laravel kamu
    url: "file:C:/project-asessment/backend-api/database/database.sqlite",
  },
});