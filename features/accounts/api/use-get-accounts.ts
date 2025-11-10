// React Query의 useQuery 훅을 import
// 서버 데이터(비동기 요청)의 상태 관리와 캐싱을 담당합니다.
import { useQuery } from "@tanstack/react-query";

// Hono 클라이언트 인스턴스를 import
// 이는 Hono 서버(route.ts)와 통신하기 위한 클라이언트입니다.
import { client } from "@/lib/hono";

// accounts 데이터를 가져오는 커스텀 훅 정의
export const useGetAccounts = () => {
  // useQuery 훅을 사용하여 데이터를 가져오고, 로딩/에러/데이터 상태를 관리합니다.
  const query = useQuery({
    // 쿼리 키: React Query가 캐싱할 때 사용할 고유 식별자
    // 같은 키를 사용하는 쿼리는 캐시를 공유합니다.
    queryKey: ["accounts"],

    // 쿼리 함수: 실제 데이터를 가져오는 비동기 함수
    queryFn: async () => {
      // Hono 클라이언트를 사용해 서버의 /api/accounts 엔드포인트로 GET 요청을 보냅니다.
      const response = await client.api.accounts.$get();

      // 응답이 실패한 경우 에러를 발생시켜 React Query가 에러 상태를 인식하게 합니다.
      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }

      // 응답을 JSON으로 파싱하고, 그중 data 필드만 반환합니다.
      // (서버 응답 구조가 { data: ... } 형태라고 가정)
      const { data } = await response.json();
      return data;
    },
  });

  // useQuery가 반환하는 쿼리 객체를 그대로 반환합니다.
  // 여기에는 data, isLoading, isError, refetch 등 유용한 속성이 포함됩니다.
  return query;
};
