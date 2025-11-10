// hono 프레임워크를 import — 경량화된 서버 라우팅 라이브러리
import { Hono } from "hono";

// drizzle-orm의 eq 함수 (SQL WHERE 절에서 컬럼 비교에 사용)
import { eq } from "drizzle-orm";

// DB 테이블 정의 (accounts 테이블 스키마)
import { accounts } from "@/DB/schema";

// drizzle 인스턴스 — 실제 데이터베이스 연결 객체
import { db } from "@/DB/drizzle";

// Clerk 인증 미들웨어와 인증 정보 가져오기 함수
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

// HTTP 상태 코드와 JSON 응답을 포함한 예외를 던질 때 사용
import { HTTPException } from "hono/http-exception";

// Hono 애플리케이션 인스턴스 생성 및 라우트 정의
const app = new Hono().get("/", clerkMiddleware(), async (c) => {
  // 현재 요청 컨텍스트(c)에서 인증 정보 가져오기
  const auth = getAuth(c);

  // 인증되지 않은 사용자일 경우 401 Unauthorized 에러 반환
  if (!auth?.userId) {
    throw new HTTPException(401, {
      res: c.json({ error: "Unauthorized" }, 401),
    });
  }

  // drizzle ORM으로 DB에서 해당 userId의 계정 데이터 조회
  // SELECT id, name FROM accounts WHERE userId = auth.userId;
  const data = await db
    .select({ id: accounts.id, name: accounts.name })
    .from(accounts)
    .where(eq(accounts.userId, auth.userId));

  // 조회된 데이터를 JSON 형태로 응답
  return c.json({ data });
});

// 다른 모듈에서 import 가능하도록 내보내기
export default app;
