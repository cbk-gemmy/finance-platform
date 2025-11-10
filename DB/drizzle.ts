// src/db/index.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// 환경변수에서 Neon DB URL을 불러옴
export const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
