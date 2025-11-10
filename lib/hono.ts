// hono의 클라이언트 유틸리티 hc()를 import
// → 서버에서 정의한 Hono 라우트를 클라이언트 측에서 타입 안전하게 호출할 수 있게 해줌
import { hc } from "hono/client";

// 서버 라우트의 타입 정의를 import
// → Hono 서버 코드(`app/api/[[...route]]/route.ts`)에서 export한 AppType을 가져옴
//    이 타입이 있어야 client.api.경로 형식으로 API를 호출할 때 타입 체크가 가능함
import { AppType } from "@/app/api/[[...route]]/route";

// Hono 클라이언트를 초기화
// hc<AppType>(URL)은 지정된 서버 엔드포인트를 기준으로 타입이 연결된 fetch 클라이언트를 생성함
// NEXT_PUBLIC_APP_URL: 환경 변수에서 서버의 base URL을 가져옴 (예: "https://myapp.vercel.app")
// '!'는 TypeScript의 non-null assertion operator → 값이 반드시 존재한다고 가정
export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
