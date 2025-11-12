// ---------------------------------------------------------
// UI 컴포넌트 및 모듈 import
// ---------------------------------------------------------
import {
  Sheet, // 사이드 슬라이드 모달(패널) 컴포넌트
  SheetContent, // 모달 내부 컨텐츠 영역
  SheetDescription, // 설명 텍스트
  SheetHeader, // 헤더 컨테이너
  SheetTitle, // 제목 텍스트
} from "@/components/ui/sheet";

import { AccountForm } from "@/features/accounts/components/account-from"; // 계정 생성/수정 폼 컴포넌트
import { insertAccountSchema } from "@/db/schema"; // 계정 데이터 스키마
import { z } from "zod"; // 런타임 타입 검증 라이브러리

import { useCreateAccount } from "@/features/accounts/api/use-create-account"; // 계정 생성 API 훅
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account"; // 계정 수정 시 시트 상태 관리 훅
import { useGetAccount } from "@/features/accounts/api/use-get-account"; // 단일 계정 데이터 조회 훅

import { Loader2 } from "lucide-react"; // 로딩 스피너 아이콘

// ---------------------------------------------------------
// formSchema: 폼 유효성 검사 스키마 정의
// ---------------------------------------------------------
// insertAccountSchema에서 name 필드만 추출하여 사용
const formSchema = insertAccountSchema.pick({
  name: true,
});

// zod 스키마 기반으로 폼 값 타입 정의
type FormValues = z.input<typeof formSchema>;

// ---------------------------------------------------------
// EditAccountSheet 컴포넌트
// ---------------------------------------------------------
// 계정 편집(Edit Account)을 위한 슬라이드 패널 UI
// - useOpenAccount 훅으로 열림/닫힘 상태 및 현재 선택된 계정 ID 관리
// - useGetAccount으로 기존 데이터 불러오기
// - useCreateAccount으로 수정(업데이트) 요청 처리
const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();
  // isOpen: 시트 열림 여부
  // onClose(): 시트 닫기 함수
  // id: 현재 편집 중인 계정의 ID

  const accountQuery = useGetAccount(id);
  // 현재 선택된 id로 계정 데이터 조회

  const mutation = useCreateAccount();
  // 계정 생성/업데이트용 mutation 훅

  const isLoading = accountQuery.isLoading;
  // 데이터 로딩 중 여부 (스피너 표시용)

  // -------------------------------------------------------
  // onSubmit: 폼 제출 시 실행되는 핸들러
  // -------------------------------------------------------
  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        // 성공 시 시트 닫기
        onClose();
      },
    });
  };

  // -------------------------------------------------------
  // defaultValues: 폼 초기값 설정
  // -------------------------------------------------------
  // 기존 계정 데이터가 있으면 해당 값 사용, 없으면 빈 문자열
  const defaultValues = accountQuery.data
    ? {
        name: accountQuery.data.name,
      }
    : {
        name: "",
      };

  // -------------------------------------------------------
  // UI 렌더링
  // -------------------------------------------------------
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        {/* 헤더 영역 */}
        <SheetHeader>
          <SheetTitle>Edit Account</SheetTitle>
          <SheetDescription>Edit an existing account.</SheetDescription>
        </SheetHeader>

        {/* 로딩 상태일 때 스피너 표시 */}
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          // 로딩 완료 후 폼 표시
          <AccountForm
            id={id} // 현재 편집 중인 계정 ID 전달
            onSubmit={onSubmit} // 폼 제출 핸들러
            disabled={mutation.isPending} // 요청 중일 때 버튼 비활성화
            defaultValues={defaultValues} // 폼 초기값
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

// ---------------------------------------------------------
// 기본 내보내기
// ---------------------------------------------------------
export default EditAccountSheet;
