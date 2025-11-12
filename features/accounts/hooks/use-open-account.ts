// ---------------------------------------------------------
// Zustand 라이브러리 import
// ---------------------------------------------------------
// Zustand: 경량 상태 관리 라이브러리
// → React Context보다 간단하게 글로벌 상태를 관리할 수 있음
import { create } from "zustand";

// ---------------------------------------------------------
// OpenAccountState 타입 정의
// ---------------------------------------------------------
// 계정 편집 시트(Sheet)의 열림/닫힘 상태를 관리하는 전역 스토어 타입
// - id: 현재 선택된 계정의 고유 ID (선택적)
// - isOpen: 시트 열림 여부
// - onOpen(): 시트를 열고 특정 계정 ID를 설정
// - onClose(): 시트를 닫고 선택된 ID를 초기화
type OpenAccountState = {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

// ---------------------------------------------------------
// useOpenAccount 훅 (Zustand 스토어)
// ---------------------------------------------------------
// 계정 수정(Edit Account) 시트를 열고 닫는 상태를 전역으로 관리하는 훅
// - onOpen(id): 시트를 열고, 해당 id를 설정
// - onClose(): 시트를 닫고, id를 초기화
export const useOpenAccount = create<OpenAccountState>((set) => ({
  id: undefined, // 현재 선택된 계정 ID (없을 때 undefined)
  isOpen: false, // 시트 초기 상태: 닫힘(false)

  // 시트를 열 때 호출 — 선택한 계정 ID를 저장하고 isOpen을 true로 변경
  onOpen: (id: string) => set({ isOpen: true, id }),

  // 시트를 닫을 때 호출 — isOpen을 false로 변경하고 id 초기화
  onClose: () => set({ isOpen: false, id: undefined }),
}));
