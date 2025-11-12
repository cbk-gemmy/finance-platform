// tanstack/react-query의 useQuery 훅 import
// → 서버에서 데이터를 비동기로 가져오고, 캐싱/리패칭/로딩 상태를 자동 관리
import { useQuery } from "@tanstack/react-query";

// Hono 클라이언트 인스턴스 import
// → 서버의 Hono API 라우트와 타입 세이프하게 통신할 수 있게 함
import { client } from "@/lib/hono";

// ---------------------------------------------------------
// useGetAccount 커스텀 훅 정의
// ---------------------------------------------------------
// 특정 계정(account) 정보를 ID 기준으로 조회하는 React Query 훅
// - id가 없으면 요청을 보내지 않음 (enabled 옵션 사용)
// - 요청 결과를 자동 캐싱하고 상태를 관리함
export const useGetAccount = (id?: string) => {
  // -------------------------------------------------------
  // useQuery 훅 설정
  // -------------------------------------------------------
  const query = useQuery({
    // id가 존재할 때만 쿼리 실행 (false일 경우 비활성화)
    enabled: !!id,

    // React Query 캐시 키 — id별로 데이터 캐싱 가능
    queryKey: ["account", { id }],

    // 실제 API 호출 함수 정의 (비동기)
    queryFn: async () => {
      // Hono 클라이언트를 통해 /api/accounts/:id 엔드포인트 호출
      const response = await client.api.accounts[":id"].$get({
        param: { id },
      });

      // 응답이 실패한 경우 예외 발생
      if (!response.ok) {
        throw new Error("Failed to fetch account");
      }

      // 서버에서 반환된 JSON 데이터 구조 분해
      const { data } = await response.json();

      // data 객체 반환 (React Query가 내부적으로 캐싱)
      return data;
    },
  });

  // React Query의 query 객체 반환
  // → { data, error, isLoading, refetch, ... } 등 상태 포함
  return query;
};
