// Next.js에서는 일반적으로 이 파일 이름을 app/providers.jsx 로 지정합니다.
"use client";

// QueryClientProvider는 내부적으로 useContext를 사용하므로
// 컴포넌트 상단에 반드시 'use client' 지시어를 추가해야 합니다.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 새로운 QueryClient 인스턴스를 생성하는 함수
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR(서버사이드 렌더링)에서는 기본 staleTime(데이터 신선도 유지 시간)을
        // 0보다 크게 설정하여 클라이언트에서 즉시 재요청(refetch)하지 않도록 하는 것이 일반적입니다.
        staleTime: 60 * 1000, // 1분
      },
    },
  });
}

// 브라우저 환경에서 재사용할 QueryClient를 저장하기 위한 전역 변수
let browserQueryClient: QueryClient | undefined = undefined;

// 현재 실행 환경(서버/브라우저)에 따라 QueryClient를 반환하는 함수
function getQueryClient() {
  if (typeof window === "undefined") {
    // 서버 환경: 항상 새로운 QueryClient 인스턴스를 생성합니다.
    return makeQueryClient();
  } else {
    // 브라우저 환경:
    // 아직 QueryClient가 없다면 새로 만들고, 이미 있다면 재사용합니다.
    // 이렇게 해야 React가 초기 렌더링 도중 suspend 되더라도
    // QueryClient가 계속 유지되어 데이터가 초기화되지 않습니다.
    // (만약 QueryClient 생성 아래쪽에 suspense boundary가 있다면 필요하지 않을 수도 있습니다.)
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

// children 타입 정의
type Props = {
  children: React.ReactNode;
};

// QueryClientProvider를 감싸는 Provider 컴포넌트 정의
export function QueryProvider({ children }: Props) {
  // ⚠️ 주의:
  // QueryClient를 초기화할 때 useState를 사용하지 마세요.
  // suspense boundary가 이 컴포넌트 아래에 없다면,
  // React가 초기 렌더 도중 suspend될 때 QueryClient 인스턴스를 버릴 수 있습니다.
  const queryClient = getQueryClient();

  // QueryClientProvider로 자식 컴포넌트를 감싸 전역적으로 React Query 기능을 제공합니다.
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
