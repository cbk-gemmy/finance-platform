// hono 프레임워크를 import — 경량화된 서버 라우팅 라이브러리
import { Hono } from "hono";

// drizzle ORM 인스턴스 — 실제 데이터베이스 연결 객체
import { db } from "@/db/drizzle";

// drizzle-orm의 and, eq, inArray 함수
// - eq: WHERE 절에서 특정 컬럼과 값 비교
// - and: 여러 조건을 AND로 결합
// - inArray: 특정 배열 내 포함 여부를 검사 (SQL IN 절)
import { and, eq, inArray } from "drizzle-orm";

// DB 테이블 정의 (accounts 테이블 스키마) 및 insert 시 사용할 Zod 스키마 import
import { accounts, insertAccountSchema } from "@/db/schema";

// Clerk 인증 미들웨어와 인증 정보 가져오기 함수
// clerkMiddleware(): 요청에서 토큰을 파싱하고, 세션/사용자 정보를 c.env에 저장
// getAuth(): 현재 요청 컨텍스트에서 인증된 사용자 정보(userId 등)를 추출
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

// Hono와 Zod를 함께 사용하기 위한 유효성 검사 미들웨어 import
// → 요청의 body(json), param 등을 자동 검사하고 스키마 불일치 시 400 에러 반환
import { zValidator } from "@hono/zod-validator";

// cuid2 라이브러리의 createId 함수 import
// → 충돌 가능성이 매우 낮은 고유 ID를 생성하기 위해 사용 (UUID 대체용)
import { createId } from "@paralleldrive/cuid2";

// zod 라이브러리 — 요청 파라미터 및 body 구조를 정의할 때 사용
import { z } from "zod";

// ---------------------------------------------------------
// Hono 애플리케이션 인스턴스 생성 및 라우트 정의
// ---------------------------------------------------------
const app = new Hono()

  // -------------------------------------------------------
  // GET 요청 핸들러: 현재 사용자 계정 목록 조회
  // -------------------------------------------------------
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c); // 인증 정보 가져오기

    // 인증되지 않은 사용자일 경우 401 Unauthorized 반환
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // drizzle ORM으로 DB에서 해당 userId의 계정 목록 조회
    // SELECT id, name FROM accounts WHERE userId = auth.userId;
    const data = await db
      .select({
        id: accounts.id,
        name: accounts.name,
      })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));

    // 조회된 데이터를 JSON 형태로 응답
    return c.json({ data });
  })

  // -------------------------------------------------------
  // GET 요청 핸들러: 특정 ID의 계정 상세 조회
  // -------------------------------------------------------
  .get(
    "/:id",
    clerkMiddleware(),
    // zValidator: URL 파라미터(id)가 유효한 문자열인지 검사
    zValidator(
      "param",
      z.object({
        id: z.string().optional(), // id는 선택적 문자열
      })
    ),
    async (c) => {
      const auth = getAuth(c); // 인증 정보 가져오기
      const { id } = c.req.valid("param"); // 유효성 검사 통과된 파라미터 추출

      // id가 누락된 경우 400 Bad Request 반환
      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      // 인증되지 않은 사용자일 경우 401 반환
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const userId = auth.userId as string;

      // 해당 사용자(userId)의 특정 id 계정만 조회
      // SELECT id, name FROM accounts WHERE userId = ? AND id = ?;
      const [data] = await db
        .select({
          id: accounts.id,
          name: accounts.name,
        })
        .from(accounts)
        .where(and(eq(accounts.userId, userId), eq(accounts.id, id)));

      // 데이터가 없을 경우 404 Not Found 반환
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      // 조회 성공 시 JSON 응답
      return c.json({ data });
    }
  )

  // -------------------------------------------------------
  // POST 요청 핸들러: 새 계정 생성
  // -------------------------------------------------------
  .post(
    "/",
    // Clerk 인증 미들웨어 실행 — 로그인된 사용자만 접근 가능
    clerkMiddleware(),

    // zValidator: 요청 body(JSON)가 insertAccountSchema에서 정의한 구조와 일치하는지 검사
    // 여기서는 name 필드만 허용하도록 pick() 사용
    zValidator(
      "json",
      insertAccountSchema.pick({
        name: true,
      })
    ),

    async (c) => {
      const auth = getAuth(c); // 인증 정보 가져오기
      const values = c.req.valid("json"); // 유효성 검증 통과한 body 데이터

      // 인증되지 않은 경우 401 반환
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // drizzle ORM을 이용해 accounts 테이블에 새 계정 데이터 추가
      // createId()로 고유 ID 생성 후 userId와 함께 저장
      const [data] = await db
        .insert(accounts)
        .values({
          id: createId(),
          userId: auth.userId,
          ...values,
        })
        .returning(); // INSERT 후 생성된 행 반환

      // 생성된 레코드를 JSON으로 응답
      return c.json({ data });
    }
  )

  // -------------------------------------------------------
  // POST 요청 핸들러: 여러 계정 일괄 삭제 (Bulk Delete)
  // -------------------------------------------------------
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    // 요청 body 구조 정의
    // { ids: string[] } 형식의 JSON 배열을 요구
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),

    async (c) => {
      const auth = getAuth(c); // 인증 정보 가져오기
      const values = c.req.valid("json"); // 유효성 검증된 body 데이터

      // 인증되지 않은 경우 401 반환
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // drizzle ORM을 이용해 다중 계정 삭제
      // DELETE FROM accounts WHERE userId = ? AND id IN (values.ids);
      const data = await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.userId, auth.userId),
            inArray(accounts.id, values.ids)
          )
        )
        .returning({
          id: accounts.id, // 삭제된 항목의 id 반환
        });

      // 삭제된 ID 목록을 JSON 형태로 응답
      return c.json({ data });
    }
  );

// ---------------------------------------------------------
// 기본 내보내기 (route.ts 등에서 .route("/accounts", app) 형태로 연결 가능)
// ---------------------------------------------------------
export default app;
