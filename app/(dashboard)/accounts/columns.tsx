"use client";
// Next.js 13 이상에서 사용되는 지시어
// 이 파일이 클라이언트 컴포넌트임을 명시합니다.
// (React hooks, event handlers 등을 사용할 수 있게 함)

import { Button } from "@/components/ui/button"; // shadcn UI의 Button 컴포넌트
import { ColumnDef } from "@tanstack/react-table"; // 테이블 컬럼 타입 정의
import { ArrowUpDown } from "lucide-react"; // 정렬 화살표 아이콘
import { Checkbox } from "@/components/ui/checkbox"; // shadcn UI의 체크박스 컴포넌트

import { InferResponseType } from "hono"; // Hono 타입 유추 유틸리티
import { client } from "@/lib/hono"; // Hono 클라이언트 인스턴스

// -------------------------------------------------------
// ResponseType 타입 정의
// -------------------------------------------------------
// API 응답 데이터 중 200 OK 상태일 때의 첫 번째 데이터 항목 타입을 추출합니다.
// 이 타입은 React Table의 제네릭 타입 <TData>로 사용됩니다.
export type ResponseType = InferResponseType<
  typeof client.api.accounts.$get,
  200
>["data"][0];

// -------------------------------------------------------
// columns: 테이블 컬럼 정의 배열
// -------------------------------------------------------
// TanStack Table은 각 열(column)을 ColumnDef 객체로 정의합니다.
// 컬럼마다 header, cell, accessorKey 등의 속성을 지정해 렌더링 방식을 제어할 수 있습니다.
export const columns: ColumnDef<ResponseType>[] = [
  // (1) 선택(Select) 컬럼 -------------------------------------------------
  {
    id: "select", // accessorKey 대신 id를 직접 지정 (데이터 필드가 없기 때문)

    // 🔹 헤더 부분: 전체 선택용 체크박스
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || // 모든 행이 선택된 경우
          (table.getIsSomePageRowsSelected() && "indeterminate") // 일부만 선택된 경우 (회색 체크)
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        // 체크 상태가 바뀔 때, 모든 행의 선택 상태를 토글
        aria-label="Select all" // 접근성(스크린리더) 라벨
      />
    ),

    // 셀 부분: 각 행(row)마다 개별 선택 체크박스 표시
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()} // 해당 행이 선택되었는지 여부
        onCheckedChange={(value) => row.toggleSelected(!!value)} // 선택 상태 변경
        aria-label="Select row"
      />
    ),

    enableSorting: false, // 이 컬럼은 정렬 기능 비활성화 (체크박스 컬럼이므로)
    enableHiding: false, // 컬럼 숨김 기능 비활성화 (사용자가 숨길 수 없게)
  },

  // (2) 이름(Name) 컬럼 -------------------------------------------------
  {
    accessorKey: "name", // ResponseType 객체의 name 필드와 연결

    // header: 버튼 형태로 만들어 정렬 기능을 활성화
    header: ({ column }) => {
      return (
        <Button
          variant="ghost" // 투명한 버튼 스타일 (shadcn 스타일)
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          // 정렬 상태가 "asc"이면 내림차순으로, 아니면 오름차순으로 변경
        >
          Name
          {/* 정렬 방향 표시용 화살표 아이콘 */}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    // cell: 기본적으로 name 값을 자동 렌더링
  },

  // (3) 금액(Amount) 컬럼 -------------------------------------------------
  {
    accessorKey: "amount", // ResponseType 객체의 amount 필드와 연결
    header: "Amount", // 헤더에 단순히 "Amount" 텍스트 표시
    // cell: 기본적으로 row.original.amount 값을 렌더링
  },
];
