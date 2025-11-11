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
// “새 계정 추가(Add new account)” 모달/폼을 여는 기능을 담당합니다.

import { Loader2, Plus } from "lucide-react";
// lucide-react 아이콘 패키지
// Loader2: 로딩 스피너 아이콘
// Plus: “Add new” 버튼에 사용하는 플러스 기호

import { columns } from "./columns";
// 같은 폴더의 columns.ts 파일에서 테이블 컬럼 정의 가져오기
// columns → @tanstack/react-table 의 ColumnDef<ResponseType>[] 형태

import { DataTable } from "@/components/data-table";
// 공통 테이블 컴포넌트 (필터링, 정렬, 페이지네이션 등을 포함한 UI 캡슐화)

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
// 계정 목록을 가져오는 API 요청 훅

import { Skeleton } from "@/components/ui/skeleton";
// 로딩 상태에서 사용할 스켈레톤 UI 컴포넌트

import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete";
// 여러 계정을 한 번에 삭제하는 API 요청 훅

// ---------------------------------------------------------
// 메인 페이지 컴포넌트 정의
// ---------------------------------------------------------
const AccountsPage = () => {
  const newAccount = useNewAccount();
  // 새 계정 추가용 모달 오픈 핸들러 훅

  const deleteAccounts = useBulkDeleteAccounts();
  // 여러 계정을 한 번에 삭제하는 훅

  const accountsQuery = useGetAccounts();
  // 계정 목록을 불러오는 API 호출 훅

  const accounts = accountsQuery.data || [];
  // 데이터가 없을 경우 빈 배열로 처리

  const isDisabled = accountsQuery.isLoading || deleteAccounts.isPending;
  // 로딩 중이거나 삭제 요청 중일 때 버튼/기능 비활성화

  // ---------------------------------------------------------
  // 로딩 상태 처리 (데이터 로드 중일 때)
  // ---------------------------------------------------------
  if (accountsQuery.isLoading) {
    return (
      <div className="max-x-screen-2xl mx-auto w-full pb-10 -mt-24">
        {/* 
          전체 레이아웃 컨테이너
          - 중앙 정렬 및 여백 설정
        */}
        <Card className="border-none drop-shadow-sm">
          {/* 
            shadcn UI의 Card 컴포넌트
            - border-none : 외곽선 제거
            - drop-shadow-sm : 부드러운 그림자 효과
          */}
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            {/* 제목 부분을 스켈레톤으로 표시 */}
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              {/* 로딩 중 표시 (중앙 정렬된 로더 아이콘) */}
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------------------------------------------------------
  // 데이터 로드 완료 후 렌더링
  // ---------------------------------------------------------
  return (
    <div className="max-x-screen-2xl mx-auto w-full pb-10 -mt-24">
      {/* 
        전체 페이지 컨테이너
        - max-x-screen-2xl : 최대 너비 제한
        - mx-auto : 중앙 정렬
        - pb-10 : 하단 여백
        - -mt-24 : 상단 여백 조정
      */}
      <Card className="border-none drop-shadow-sm">
        {/* 카드 UI 래퍼 */}
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          {/* 
            헤더 영역
            - 반응형 가로 정렬
            - 제목과 버튼을 양끝으로 배치
          */}
          <CardTitle className="text-xl line-clamp-1">Account page</CardTitle>
          {/* 페이지 제목 */}
          <Button onClick={newAccount.onOpen} size="sm">
            {/* “Add new” 버튼 */}
            <Plus className="size-4 mr-2" /> {/* 아이콘 (왼쪽) */}
            Add new {/* 버튼 텍스트 */}
          </Button>
        </CardHeader>

        <CardContent>
          {/* 
            본문 영역: 테이블 표시
          */}
          <DataTable
            columns={columns} // 테이블 컬럼 정의
            data={accounts} // 계정 데이터
            filterKey="name" // name 컬럼 기준으로 필터링 가능
            onDelete={(row) => {
              // 선택된 행(row) 삭제 처리
              const ids = row.map((r) => r.original.id);
              deleteAccounts.mutate({ ids }); // 삭제 요청
            }}
            disabled={isDisabled} // 로딩 중일 때 비활성화
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
