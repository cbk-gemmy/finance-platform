// Hono 프레임워크에서 Hono 클래스를 import
import { Hono } from "hono";

// Vercel 환경에서 Hono 앱을 핸들링하기 위한 도우미 함수 import
import { handle } from "hono/vercel";

// "/accounts" 라우트에 연결할 하위 라우터 import
import accounts from "./accounts";
import { error } from "console";
import { HTTPException } from "hono/http-exception";

// Vercel Edge Functions 환경에서 실행하도록 설정
export const runtime = "edge";

// 새로운 Hono 애플리케이션 인스턴스를 생성하고
// 모든 경로 앞에 "/api"를 기본 경로로 설정
const app = new Hono().basePath("/api");

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json({ error: "internal error " }, 500);
});

// "/api/accounts" 경로로 들어오는 요청을
// 외부에서 정의한 accounts 라우트로 연결
const routes = app.route("/accounts", accounts);

// Vercel의 Edge Function에서 GET, POST, PATCH 요청을 처리하도록 핸들러를 export
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);

// TypeScript에서 app의 타입을 다른 파일에서 재사용할 수 있도록 export
export type AppType = typeof routes;
