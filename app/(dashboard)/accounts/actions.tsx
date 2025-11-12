"use client";
// Next.js 13 이상에서 사용하는 지시어
// 이 컴포넌트는 클라이언트에서 렌더링되어야 함을 의미합니다.
// → 서버 컴포넌트에서는 React state나 event handler를 사용할 수 없기 때문.

import { Button } from "@/components/ui/button"; // shadcn UI의 버튼 컴포넌트
import {
  DropdownMenu, // 드롭다운 메뉴 전체 컨테이너
  DropdownMenuContent, // 드롭다운 내부 컨텐츠 영역
  DropdownMenuItem, // 드롭다운 개별 항목
  DropdownMenuTrigger, // 드롭다운 열림을 트리거하는 컴포넌트
} from "@/components/ui/dropdown-menu";

import { Edit, MoreHorizontal } from "lucide-react";
// lucide-react 아이콘 패키지
// Edit: 수정 아이콘 / MoreHorizontal: 점 3개(옵션 메뉴) 아이콘

import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
// Zustand 훅 — 계정 편집 시트를 열기 위한 전역 상태 관리 훅

// ---------------------------------------------------------
// Props 타입 정의
// ---------------------------------------------------------
// id: 액션이 적용될 특정 계정의 고유 ID
type Props = {
  id: string;
};

// ---------------------------------------------------------
// Actions 컴포넌트
// ---------------------------------------------------------
// 각 테이블 행(Row)에 표시되는 “⋯ (더보기)” 액션 버튼 컴포넌트
// - 클릭 시 드롭다운 메뉴를 열어 “Edit” 등의 기능을 선택 가능
// - 선택된 행의 id를 기반으로 편집 시트 오픈
export const Actions = ({ id }: Props) => {
  const { onOpen } = useOpenAccount();
  // onOpen(): 특정 ID의 계정 수정 시트 열기 함수

  // -------------------------------------------------------
  // UI 렌더링
  // -------------------------------------------------------
  return (
    <>
      <DropdownMenu>
        {/* ⋯ 버튼 (드롭다운 트리거) */}
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        {/* 드롭다운 메뉴 내용 */}
        <DropdownMenuContent>
          {/* Edit 메뉴 항목 */}
          <DropdownMenuItem disabled={false} onClick={() => onOpen(id)}>
            <Edit /> {/* 수정 아이콘 */}
            Edit {/* 텍스트 라벨 */}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
