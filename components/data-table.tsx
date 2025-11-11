"use client";
// Next.js 13 이상에서 사용하는 지시어
// 이 컴포넌트는 클라이언트에서 렌더링되어야 함을 의미합니다.
// → 서버 컴포넌트에서는 React state, useEffect, event handler 등을 사용할 수 없기 때문.

import {
  ColumnDef, // 각 컬럼의 정의(헤더, 셀 등) 타입
  ColumnFiltersState, // 테이블의 컬럼별 필터 상태 타입
  Row, // 행(row) 타입 (데이터 + 내부 상태 포함)
  flexRender, // React Table에서 안전하게 JSX를 렌더링하기 위한 유틸 함수
  getCoreRowModel, // 기본 행 데이터 모델 (기초 데이터 구성)
  useReactTable, // React Table 훅: 모든 상태와 로직을 통합
  getPaginationRowModel, // 페이지네이션 기능 추가
  getSortedRowModel, // 정렬 기능 추가
  getFilteredRowModel, // 필터링 기능 추가
  SortingState, // 정렬 상태의 타입 정의
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button"; // shadcn UI 버튼 컴포넌트
import { Input } from "@/components/ui/input"; // shadcn UI 입력창 컴포넌트
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // shadcn UI 테이블 구성 컴포넌트들
import React from "react";
import { Trash } from "lucide-react"; // lucide-react 아이콘 라이브러리의 휴지통 아이콘

// -------------------------------------------------------------
// DataTableProps 인터페이스 정의
// -------------------------------------------------------------
// 제네릭 타입 <TData, TValue>로 어떤 데이터 구조든 재사용 가능하게 설계.
// - TData: 한 행(row)의 전체 데이터 구조 타입
// - TValue: 각 셀(cell)의 값 타입
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // 테이블 컬럼 정의 배열
  data: TData[]; // 테이블에 표시할 데이터 배열
  filterKey: string; // 필터링 기준 컬럼의 키 이름 (예: "email")
  onDelete: (rows: Row<TData>[]) => void; // 삭제 버튼 클릭 시 실행될 함수. 선택된 행(Row<TData>[])이 전달됨
  disabled?: boolean; // 삭제 버튼 비활성화 여부 (로딩 중 등 제어용)
}

// -------------------------------------------------------------
// DataTable 컴포넌트 본체
// -------------------------------------------------------------
export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  onDelete,
  disabled,
}: DataTableProps<TData, TValue>) {
  // 정렬 상태 관리 (예: "email" 컬럼 오름차순/내림차순)
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // 필터 상태 관리 (특정 컬럼 기준으로 검색어 필터링)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  // 행 선택 상태 관리 (체크박스로 선택된 행 추적)
  // 예: { "rowId_1": true, "rowId_3": true }
  const [rowSelection, setRowSelection] = React.useState({});

  // -------------------------------------------------------------
  // TanStack Table 인스턴스 생성
  // -------------------------------------------------------------
  // useReactTable 훅을 통해 테이블 동작(정렬, 필터, 페이지네이션, 선택 등)을 통합 관리합니다.
  const table = useReactTable({
    data, // 렌더링할 실제 데이터 배열
    columns, // 테이블 컬럼 정의
    getCoreRowModel: getCoreRowModel(), // 기본 데이터 모델 (행 구성)
    getPaginationRowModel: getPaginationRowModel(), // 페이지네이션 모델 활성화
    onSortingChange: setSorting, // 정렬 이벤트 발생 시 상태 업데이트
    getSortedRowModel: getSortedRowModel(), // 정렬된 결과를 계산하는 모델
    getFilteredRowModel: getFilteredRowModel(), // 필터링된 결과를 계산하는 모델
    onColumnFiltersChange: setColumnFilters, // 필터 입력 시 상태 업데이트
    onRowSelectionChange: setRowSelection, // 행 선택(체크박스) 상태 변경 시 업데이트
    state: {
      sorting, // 현재 정렬 상태
      columnFilters, // 현재 필터 상태
      rowSelection, // 현재 선택된 행 정보
    },
  });

  // -------------------------------------------------------------
  // 렌더링 영역 시작
  // -------------------------------------------------------------
  return (
    <div>
      {/* ---------------------------------------------------------
          상단 필터 입력창 + 삭제 버튼 영역
         --------------------------------------------------------- */}
      <div className="flex items-center py-4">
        {/* 필터 입력창 */}
        <Input
          placeholder={`Filter ${filterKey}...`}
          // placeholder 예: "Filter email..."
          value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
          // 현재 필터 값 불러오기 (없으면 빈 문자열)
          onChange={(event) =>
            table.getColumn(filterKey)?.setFilterValue(event.target.value)
          }
          // 사용자가 입력할 때마다 해당 컬럼의 필터 값 갱신
          className="max-w-sm"
        />

        {/* 삭제 버튼 (선택된 행이 있을 때만 표시됨) */}
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button
            disabled={disabled} // 삭제 기능 비활성화 옵션 (로딩 시 등)
            size="sm"
            variant="outline"
            className="ml-auto font-normal text-xs"
            onClick={() => onDelete(table.getFilteredSelectedRowModel().rows)}
            // 클릭 시 현재 선택된 행(Row<TData>[])을 부모 컴포넌트의 onDelete에 전달
          >
            <Trash className="size-4 mr-2" />
            {/* 휴지통 아이콘 표시 */}
            Delete ({table.getFilteredSelectedRowModel().rows.length})
            {/* 현재 선택된 행의 개수 표시 */}
          </Button>
        )}
      </div>

      {/* ---------------------------------------------------------
            테이블 본문 영역
         --------------------------------------------------------- */}
      <div className="rounded-md border">
        <Table>
          {/* 테이블 헤더 렌더링 */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null // placeholder 헤더는 렌더링하지 않음
                      : flexRender(
                          header.column.columnDef.header, // 컬럼 헤더 정의 불러오기
                          header.getContext() // 헤더 컨텍스트 전달
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* 테이블 데이터 행 렌더링 */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              // 데이터가 존재할 경우: 각 행을 렌더링
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  // 선택된 행일 경우 data-state="selected" 속성을 부여 (CSS 하이라이트용)
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell, // 셀의 렌더링 정의 가져오기
                        cell.getContext() // 셀 컨텍스트 전달
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              //데이터가 없을 경우: "No results." 표시
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ---------------------------------------------------------
            하단 정보 영역 (선택 행 개수 + 페이지네이션)
         --------------------------------------------------------- */}
      <div className="flex items-center justify-end space-x-2 py-4">
        {/* 현재 선택 정보 텍스트 */}
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
          {/* 예: “2 of 10 row(s) selected.” */}
        </div>

        {/* 페이지 이동 버튼 영역 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()} // 이전 페이지 이동
          disabled={!table.getCanPreviousPage()} // 첫 페이지라면 비활성화
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()} // 다음 페이지 이동
          disabled={!table.getCanNextPage()} // 마지막 페이지라면 비활성화
        >
          Next
        </Button>
      </div>
    </div>
  );
}
