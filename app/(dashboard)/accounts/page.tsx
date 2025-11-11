"use client";
// Next.js 13 이상에서 사용하는 지시어
// 이 파일이 클라이언트 컴포넌트임을 명시합니다.
// (useState, custom hooks 등 클라이언트 전용 기능 사용 가능)

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// shadcn UI 컴포넌트 임포트
// Card, Button 등은 shadcn에서 제공하는 기본 UI 블록입니다.

import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
// 커스텀 훅 (useNewAccount) 임포트
// 아마도 “새 계정 추가(Add new account)” 모달/폼을 여는 기능을 담당하는 훅입니다.
// (예: newAccount.onOpen() 실행 시 다이얼로그 열기)

import { Plus } from "lucide-react";
// lucide-react 아이콘 패키지
// Plus 아이콘은 “Add new” 버튼 옆에 표시될 플러스 기호입니다.

import { columns, Payment } from "./columns";
// 같은 폴더의 columns.ts 파일에서 테이블 컬럼 정의와 데이터 타입 가져오기
// columns → @tanstack/react-table 의 ColumnDef<Payment>[] 형태
// Payment → 데이터 타입 정의 (id, amount, status, email)

import { DataTable } from "@/components/data-table";
// 공통 테이블 컴포넌트 (앞서 작성한 DataTable.tsx)
// 필터링, 정렬, 페이지네이션 등을 포함하는 테이블 로직을 캡슐화한 컴포넌트

// ---------------------------------------------------------
// 예시용 데이터 (mock data)
// 실제 서비스에서는 API 요청으로 데이터를 가져오지만,
// 여기서는 임시 하드코딩 데이터를 사용합니다.
// ---------------------------------------------------------
const data: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed52f",
    amount: 5,
    status: "success",
    email: "a@example.com",
  },
];

// ---------------------------------------------------------
// 메인 페이지 컴포넌트 정의
// ---------------------------------------------------------
const AccountsPage = () => {
  const newAccount = useNewAccount();
  // 커스텀 훅 호출
  // 이 훅은 보통 “새 계정 추가” 모달을 열기 위한 상태 및 핸들러를 제공합니다.
  // newAccount.onOpen() 호출 → 모달 오픈 트리거

  return (
    <div className="max-x-screen-2xl mx-auto w-full pb-10 -mt-24">
      {/* 
        전체 레이아웃 컨테이너 
        - max-x-screen-2xl : 최대 너비 제한 (중앙 정렬)
        - mx-auto : 좌우 중앙 정렬
        - pb-10 : 하단 여백
        - -mt-24 : 위쪽 여백을 음수로 당겨서 배치 조정
      */}

      <Card className="border-none drop-shadow-sm">
        {/* 
          shadcn UI의 Card 컴포넌트
          - border-none : 외곽선 제거
          - drop-shadow-sm : 부드러운 그림자 효과
        */}

        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          {/* 
            Card 헤더 (상단 영역)
            - gap-y-2 : 수직 간격
            - lg:flex-row : 큰 화면에서는 가로 정렬
            - lg:justify-between : 제목과 버튼을 양끝 정렬
          */}

          <CardTitle className="text-xl line-clamp-1">Account page</CardTitle>
          {/* 
            제목 부분
            - line-clamp-1 : 긴 텍스트일 경우 한 줄로 자르고 '...' 표시
          */}

          <Button onClick={newAccount.onOpen} size="sm">
            {/* 
                “Add new” 버튼
              - onClick: newAccount.onOpen → 모달 열기
              - size="sm": 작은 크기의 버튼
            */}
            <Plus className="size-4 mr-2" /> {/* 아이콘 (왼쪽) */}
            Add new {/* 버튼 텍스트 */}
          </Button>
        </CardHeader>

        <CardContent>
          {/* 
            카드 본문 영역 (테이블 표시)
          */}
          <DataTable
            columns={columns} // 컬럼 정의 (columns.ts에서 가져옴)
            data={data} // 테이블에 표시할 데이터
            filterKey="email" // email 컬럼 기준으로 필터링 가능
            onDelete={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  );
};

// ---------------------------------------------------------
// 기본 내보내기 (Next.js page component)
// ---------------------------------------------------------
export default AccountsPage;
