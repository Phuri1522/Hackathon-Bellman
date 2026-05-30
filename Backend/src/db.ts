import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import dotenv from "dotenv";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const backendRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: resolve(backendRoot, ".env") });

const resolveDatabaseUrl = (url: string): string => {
  if (!url.startsWith("file:")) {
    return url;
  }

  const filePath = url.slice("file:".length);
  if (filePath.startsWith("//") || isAbsolute(filePath)) {
    return url;
  }

  return `file:${resolve(backendRoot, filePath).replace(/\\/g, "/")}`;
};

const adapter = new PrismaLibSql({
  url: resolveDatabaseUrl(process.env["DATABASE_URL"]!),
});

export const prisma = new PrismaClient({
  adapter,
});
