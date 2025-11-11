"use client";
// Next.js 13 이상에서 사용되는 지시어
// 이 파일이 클라이언트 컴포넌트임을 명시합니다.
// (React hooks, event handlers 등을 사용할 수 있게 함)

import { Button } from "@/components/ui/button"; // shadcn UI의 Button 컴포넌트
import { ColumnDef } from "@tanstack/react-table"; // 테이블 컬럼 타입 정의
import { ArrowUpDown } from "lucide-react"; // 정렬 화살표 아이콘
import { Checkbox } from "@/components/ui/checkbox"; // shadcn UI의 체크박스 컴포넌트

// -------------------------------------------------------
// Payment 타입 정의
// -------------------------------------------------------
// 테이블의 각 행(row)이 어떤 데이터 구조를 가지는지를 정의합니다.
// 이 타입은 React Table의 제네릭 타입 <TData>로 사용됩니다.
export type Payment = {
  id: string; // 결제 ID
  amount: number; // 결제 금액
  status: "pending" | "processing" | "success" | "failed"; // 결제 상태 (Union Type)
  email: string; // 결제 관련 이메일 주소
};

// -------------------------------------------------------
// columns: 테이블 컬럼 정의 배열
// -------------------------------------------------------
// TanStack Table은 각 열(column)을 ColumnDef 객체로 정의합니다.
// 컬럼마다 header, cell, accessorKey 등의 속성을 지정해 렌더링 방식을 제어할 수 있습니다.
export const columns: ColumnDef<Payment>[] = [
  // (1) 선택(Select) 컬럼 -------------------------------------------------
  {
    id: "select", // 이 컬럼은 accessorKey 대신 id를 직접 지정 (데이터 필드가 없기 때문)

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

  // (2) 상태(Status) 컬럼 -------------------------------------------------
  {
    accessorKey: "status", // Payment 객체의 status 필드와 연결
    header: "Status", // 단순히 문자열 헤더를 표시
    // cell: 기본적으로 row.original.status 값을 렌더링합니다.
  },

  // (3) 이메일(Email) 컬럼 -------------------------------------------------
  {
    accessorKey: "email", // Payment 객체의 email 필드와 연결

    // 🔹 header: 버튼 형태로 만들어 정렬 기능을 활성화
    header: ({ column }) => {
      return (
        <Button
          variant="ghost" // 투명한 버튼 스타일 (shadcn 스타일)
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          // 정렬 상태가 "asc"이면 내림차순으로, 아니면 오름차순으로 변경
        >
          Email
          {/* 정렬 방향 표시용 화살표 아이콘 */}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    // cell: 기본적으로 email 값을 자동 렌더링
  },

  // (4) 금액(Amount) 컬럼 -------------------------------------------------
  {
    accessorKey: "amount", // Payment 객체의 amount 필드와 연결
    header: "Amount", // 헤더에 단순히 "Amount" 텍스트 표시
    // cell: 기본적으로 row.original.amount 값을 렌더링
  },
];
