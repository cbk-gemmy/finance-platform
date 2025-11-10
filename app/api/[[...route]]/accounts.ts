// hono 프레임워크를 import — 경량화된 서버 라우팅 라이브러리
import { Hono } from "hono";

// drizzle-orm의 eq 함수 (SQL WHERE 절에서 컬럼 비교에 사용)
import { eq } from "drizzle-orm";

// cuid2 라이브러리의 createId 함수 import
// → 충돌 가능성이 매우 낮은 고유 ID를 생성하기 위해 사용 (UUID 대체용)
import { createId } from "@paralleldrive/cuid2";

// Hono와 Zod를 함께 사용하기 위한 유효성 검사 미들웨어 import
// → 요청의 body(json)를 자동으로 검사하고, 스키마에 맞지 않으면 400 에러를 반환함
import { zValidator } from "@hono/zod-validator";

// DB 테이블 정의 (accounts 테이블 스키마) 및 insert 시 사용할 Zod 스키마 import
import { accounts, insertAccountSchema } from "@/db/schema";

// drizzle 인스턴스 — 실제 데이터베이스 연결 객체
import { db } from "@/db/drizzle";

// Clerk 인증 미들웨어와 인증 정보 가져오기 함수
// clerkMiddleware(): 요청에서 토큰을 파싱하고, 세션/사용자 정보를 c.env에 저장
// getAuth(): 현재 요청 컨텍스트에서 인증된 사용자 정보(userId 등)를 추출
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

// HTTP 상태 코드와 JSON 응답을 포함한 예외를 던질 때 사용
import { HTTPException } from "hono/http-exception";

// Hono 애플리케이션 인스턴스 생성 및 라우트 정의
const app = new Hono()

  // GET 요청 핸들러: 사용자의 계정 목록 조회
  .get("/", clerkMiddleware(), async (c) => {
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
  })

  // POST 요청 핸들러: 새로운 계정 생성
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

    // 실제 POST 요청 처리 로직 (비동기 핸들러)
    async (c) => {
      // 현재 요청의 인증 정보 가져오기
      const auth = getAuth(c);

      // 유효성 검사를 통과한 JSON body 데이터 가져오기
      // → zValidator가 자동으로 파싱하고 타입까지 보장함
      const values = c.req.valid("json");

      // 인증되지 않은 경우 401 반환
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // drizzle ORM을 이용해 accounts 테이블에 새 계정 데이터 추가
      // createId()를 사용해 고유한 ID 생성 (랜덤 문자열 기반)
      // userId는 Clerk에서 가져온 인증된 사용자 ID로 설정
      // values는 사용자가 보낸 name 값 포함
      // returning()은 INSERT 후 생성된 행(row)의 데이터를 반환함
      const [data] = await db
        .insert(accounts)
        .values({ id: createId(), userId: auth.userId, ...values })
        .returning(); // PostgreSQL의 RETURNING * 기능과 동일

      // const [data]: returning()은 배열을 반환하므로 구조분해로 첫 번째 요소를 추출함
      // → 생성된 새 account 레코드 객체 (예: { id, name, userId, plaidId })

      // 생성된 레코드를 JSON으로 응답
      // 클라이언트에서 새로 만든 계정 정보를 즉시 확인할 수 있음
      return c.json({ data });
    }
  );

// 다른 모듈에서 import 가능하도록 내보내기
// 이 app 객체는 route.ts 파일에서 .route("/accounts", app) 형태로 연결됨
export default app;
