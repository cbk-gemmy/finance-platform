// Drizzle ORM의 PostgreSQL 전용 유틸리티 함수 import
// pgTable: PostgreSQL 테이블을 정의할 때 사용
// text: 텍스트 타입 컬럼을 정의할 때 사용
import { pgTable, text } from "drizzle-orm/pg-core";

// drizzle-zod의 헬퍼 함수 import
// → Drizzle에서 정의한 스키마로부터 자동으로 Zod validation schema를 생성할 수 있음
import { createInsertSchema } from "drizzle-zod";

// PostgreSQL의 "accounts" 테이블 정의
// 각 컬럼은 Drizzle의 타입 세이프티를 유지하면서 선언됨
export const accounts = pgTable("accounts", {
  // 기본 키(primary key)
  id: text("id").primaryKey(),

  // plaid 연동 계정 ID (Plaid API와 연동할 때 사용)
  plaidId: text("plaid_id"),

  // 계정 이름 (필수 값)
  name: text("name").notNull(),

  // 해당 계정을 소유한 사용자 ID (Clerk userId 등)
  userId: text("user_id").notNull(),
});

// 위에서 정의한 Drizzle 스키마(accounts)를 기반으로
// 자동으로 Zod의 insert용 validation schema 생성
// → 프론트엔드나 API 요청에서 데이터 유효성 검증 시 사용
export const insertAccountSchema = createInsertSchema(accounts);
