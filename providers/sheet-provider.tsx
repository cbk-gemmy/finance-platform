"use client";
// Next.js 13 이상에서 사용하는 지시어
// 이 컴포넌트는 클라이언트에서 렌더링되어야 함을 의미합니다.
// → 서버 컴포넌트에서는 React state, event handler 등을 사용할 수 없기 때문.

import NewAccountSheet from "@/features/accounts/components/new-account-sheet";
// 새 계정 추가용 시트 컴포넌트

import { useMountedState } from "react-use";
// react-use 라이브러리의 훅
// 컴포넌트가 마운트된 이후의 상태를 안전하게 확인하기 위해 사용

import EditAccountSheet from "../features/accounts/components/edit-account-sheet";
// 기존 계정 수정용 시트 컴포넌트

// ---------------------------------------------------------
// SheetProvider 컴포넌트
// ---------------------------------------------------------
// 계정 관련 시트(NewAccountSheet, EditAccountSheet)를 전역적으로 렌더링하는 Provider 역할
// - Next.js의 레이아웃 구조 상, 페이지 전반에서 시트를 쉽게 접근 가능하도록 함
// - useMountedState()를 통해 클라이언트 사이드에서만 렌더링 보장
const SheetProvider = () => {
  const isMounted = useMountedState();
  // 컴포넌트가 실제로 브라우저에 마운트되었는지 여부
  // SSR(서버 사이드 렌더링) 시 오류를 방지하기 위해 사용

  // 마운트되지 않은 상태에서는 아무것도 렌더링하지 않음
  if (!isMounted) return null;

  // -------------------------------------------------------
  // UI 렌더링
  // -------------------------------------------------------
  return (
    <>
      {/* 새 계정 생성용 시트 */}
      <NewAccountSheet />

      {/* 계정 수정용 시트 */}
      <EditAccountSheet />
    </>
  );
};

// ---------------------------------------------------------
// 기본 내보내기
// ---------------------------------------------------------
export default SheetProvider;
