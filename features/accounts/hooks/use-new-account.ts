// Zustand 라이브러리의 create 함수를 import
// → 전역 상태(store)를 생성하는 함수
import { create } from "zustand";

// 상태(store)의 타입 정의
// 이 상태는 '새 계정 모달(NewAccount)'이 열렸는지 여부를 관리함
type NewAccountState = {
  // 모달이 열려 있는지 여부 (true = 열림, false = 닫힘)
  isOpen: boolean;

  // 모달을 여는 함수
  onOpen: () => void;

  // 모달을 닫는 함수
  onClose: () => void;
};

// Zustand로 전역 상태 스토어 생성
// useNewAccount 훅을 통해 어디서든 모달 상태를 제어 가능
export const useNewAccount = create<NewAccountState>((set) => ({
  // 기본값: 모달은 닫혀 있음
  isOpen: false,

  // 모달 열기: isOpen 값을 true로 변경
  onOpen: () => set({ isOpen: true }),

  // 모달 닫기: isOpen 값을 false로 변경
  onClose: () => set({ isOpen: false }),
}));
