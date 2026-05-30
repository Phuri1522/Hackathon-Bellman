import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import "dotenv/config";

const adapter = new PrismaLibSql({
  url: process.env["DATABASE_URL"]!,
});

export const prisma = new PrismaClient({
  adapter,
});
