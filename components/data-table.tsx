"use client";
// Next.js 13 이상에서 사용하는 지시어
// 이 파일이 서버 컴포넌트(Server Component)가 아닌
// 클라이언트 컴포넌트(Client Component)임을 명시합니다.
// React hooks (useState, useEffect 등)를 사용하기 위해 필요합니다.

import {
  ColumnDef, // 각 컬럼의 정의 구조를 지정하는 타입
  ColumnFiltersState, // 테이블의 컬럼 필터 상태 타입
  flexRender, // TanStack이 제공하는 안전한 렌더링 유틸 함수
  getCoreRowModel, // 기본 행 데이터 모델 (필터/정렬 전)
  useReactTable, // 테이블을 실제로 생성하고 상태를 관리하는 핵심 훅
  getPaginationRowModel, // 페이지네이션 로직을 추가하는 모델
  getSortedRowModel, // 정렬된 데이터를 반환하는 모델
  getFilteredRowModel, // 필터링된 데이터를 반환하는 모델
  SortingState, // 정렬 상태를 위한 타입
} from "@tanstack/react-table";
// TanStack React Table의 핵심 기능을 불러옵니다.
// 이 훅과 유틸 함수들을 조합하여 복잡한 테이블 기능(정렬, 필터, 페이지 등)을 구성합니다.

import { Button } from "@/components/ui/button"; // Shadcn UI의 버튼 컴포넌트
import { Input } from "@/components/ui/input"; // Shadcn UI의 인풋 컴포넌트
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// UI 부분 (Shadcn UI 기반)
// HTML 테이블 구조를 컴포넌트 단위로 분리한 버전입니다.

import React from "react";

// ------------------------------------------------------
// 인터페이스 정의: DataTableProps
// ------------------------------------------------------
// 제네릭 타입 <TData, TValue> 를 사용합니다.
//  - TData: 테이블의 "한 행(row)" 데이터의 타입
//  - TValue: 각 셀의 값(value) 타입
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // 테이블의 컬럼 구조 정의
  data: TData[]; // 렌더링할 실제 데이터
  filterKey: string; // 특정 컬럼을 기준으로 필터링할 key
}

// ------------------------------------------------------
// DataTable 컴포넌트 정의
// ------------------------------------------------------
export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
}: DataTableProps<TData, TValue>) {
  // 정렬 상태 관리 (예: "email 오름차순" 등)
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // 필터 상태 관리 (예: "email includes 'gmail'")
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  // 테이블 인스턴스 생성
  // useReactTable 훅은 TanStack Table의 모든 상태와 동작을 관리합니다.
  const table = useReactTable({
    data, // 렌더링할 데이터 (ex. users, payments 등)
    columns, // 각 열의 정의 (컬럼 헤더명, 셀 내용 등)
    getCoreRowModel: getCoreRowModel(), // 기본 데이터 모델 (가장 기초적인 행 구조)
    getPaginationRowModel: getPaginationRowModel(), // 페이지네이션 모델 (이전/다음 페이지 기능)
    onSortingChange: setSorting, // 정렬 이벤트가 발생할 때 상태 업데이트
    getSortedRowModel: getSortedRowModel(), // 정렬 적용된 행 데이터 반환
    onColumnFiltersChange: setColumnFilters, // 필터 값 변경 시 상태 업데이트
    getFilteredRowModel: getFilteredRowModel(), // 필터링된 데이터 반환
    state: {
      sorting, // 현재 정렬 상태 (asc, desc)
      columnFilters, // 현재 필터 상태
    },
  });

  // ------------------------------------------------------
  // 실제 렌더링 영역 (UI 부분)
  // ------------------------------------------------------
  return (
    <div>
      {/* 검색/필터 입력창 영역 */}
      <div className="flex items-center py-4">
        <Input
          placeholder={`Filter ${filterKey}...`}
          // 입력창 placeholder (ex: "Filter email...")

          value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
          // 현재 선택된 컬럼(filterKey)의 필터 값 가져오기

          onChange={(event) =>
            table.getColumn(filterKey)?.setFilterValue(event.target.value)
          }
          // 입력값이 바뀔 때 필터 상태 업데이트

          className="max-w-sm"
          // 입력창 최대 너비 제한
        />
      </div>

      {/* 테이블 본체 (헤더 + 바디) */}
      <div className="rounded-md border">
        <Table>
          {/* 테이블 헤더 */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              // getHeaderGroups(): 다중 헤더(그룹 헤더 포함) 지원
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header, // header 정의 가져오기
                          header.getContext() // 현재 컬럼의 컨텍스트 전달
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* 테이블 바디 */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              // 데이터가 있을 경우 행 렌더링
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  // 선택된 행이면 'selected' 속성 부여 (스타일링용)
                >
                  {/* 각 행의 셀을 렌더링 */}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell, // 셀 정의 가져오기
                        cell.getContext() // 셀 컨텍스트 전달
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // 데이터가 없을 경우
              <TableRow>
                <TableCell
                  colSpan={columns.length} // 열 전체 병합
                  className="h-24 text-center"
                >
                  No results. {/* 데이터 없음 메시지 */}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 버튼 영역 */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()} // 이전 페이지 이동
          disabled={!table.getCanPreviousPage()} // 첫 페이지일 경우 비활성화
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()} // 다음 페이지 이동
          disabled={!table.getCanNextPage()} // 마지막 페이지일 경우 비활성화
        >
          Next
        </Button>
      </div>
    </div>
  );
}
