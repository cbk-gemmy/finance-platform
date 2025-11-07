# 💰 Finance SaaS 플랫폼

이 프로젝트는 **“Code With Antonio”** 튜토리얼을 기반으로 만들어졌고

유튜브 링크 : https://youtu.be/N_uNKAus0II?si=4-cEdWyJIB2ShXEg 

참고 저장소: https://github.com/JosueIsOffline/finance-platform

Finance SaaS Platform 프로젝트에 오신 것을 환영합니다!  
이 README는 프로젝트 설정, 주요 기능, 사용된 기술, 그리고 기여 방법까지 단계별로 안내합니다.  
이 프로젝트는 **수입 및 지출 추적**, **거래 분류**, **CSV 데이터 가져오기**, **은행 계좌 연동**, **수익화 기능** 등을 포함한 강력한 재무 관리 시스템을 구축하는 것을 목표로 합니다.

---

## 📋 목차 (Table of Contents)
1. [주요 기능](#주요-기능-key-features)
2. [사용 기술](#사용-기술-technologies-used)
3. [프로젝트 설정](#프로젝트-설정-project-setup)
4. [사용 방법](#사용-방법-usage)
5. [기여하기](#기여하기-contributing)
6. [라이선스](#라이선스-license)
7. [스크린샷/데모](#스크린샷데모-screenshotsdemo)
8. [사전 요구사항](#사전-요구사항-prerequisites)
9. [폴더 구조](#폴더-구조-folder-structure)
10. [감사의 말](#감사의-말-acknowledgments)

---

## 🏦 소개 (Introduction)
이 프로젝트에서는 **Finance SaaS 플랫폼**을 직접 구축하며,  
수입과 지출을 추적하고, 거래를 분류하며, CSV 파일로 데이터를 가져오는 방법을 배웁니다.  

또한 **Plaid**를 사용해 실제 은행 계좌를 연결하고,  
**Lemon Squeezy**를 통해 프리미엄 기능을 유료화할 수 있습니다.  

튜토리얼의 총 길이는 약 **11시간**으로,  
**앱 구축부터 배포까지 전체 과정**을 자세히 설명합니다.

---

## ✨ 주요 기능 (Key Features)
- 📊 **대화형 재무 대시보드**: 다양한 차트로 재무 데이터를 시각화  
- 🔁 **차트 유형 변경 기능**: 데이터를 다양한 형태로 표시  
- 🗓 **계좌 및 날짜 필터**: 거래 내역을 계좌와 날짜별로 필터링  
- 💹 **상세 거래 테이블**: 개별 거래를 조회하고 관리  
- ➕ **거래 추가 폼**: 새로운 거래를 손쉽게 등록  
- 🧩 **사용자 정의 Select 컴포넌트**: 유연한 컴포넌트 커스터마이징  
- 💵 **수입/지출 전환 기능**: 보기 모드를 간편하게 전환  
- 🔄 **CSV 거래 내역 가져오기**: CSV 파일을 통한 거래 업로드  
- 🔥 **Hono.js 기반 API**: 경량이면서 효율적인 API 관리  
- 🪝 **Tanstack React Query 상태 관리**: 서버 상태를 안정적으로 관리  
- 🔗 **Plaid 은행 계좌 연동**: 실제 금융 계좌 연결 및 데이터 가져오기  
- 💳 **Lemon Squeezy 프리미엄 결제 시스템**: 유료 구독 기능 지원  
- 🔐 **Clerk (Core 2)** 인증: 안전하고 확장 가능한 사용자 인증  
- 🗑 **거래 검색 및 일괄 삭제**: 대량 작업 및 검색 기능 지원  
- ⚙️ **은행 연결 해제 및 구독 관리**: 구독 상태 및 연결 관리  
- 👤 **사용자 설정 페이지**: 개인화된 환경 설정  
- 🌐 **Next.js 14 기반**: 최신 서버 기능을 활용한 현대적 구조  
- 🎨 **TailwindCSS + Shadcn UI 스타일링**: 세련되고 반응형 UI  
- 💾 **PostgreSQL & Drizzle ORM**: 안정적이고 효율적인 데이터 관리  
- 🚀 **Vercel 배포**: 간편한 배포와 자동 확장 지원  

---

## 🧠 사용 기술 (Technologies Used)
- **[Clerk](https://go.clerk.com/eoX6HkY)**: 인증 솔루션  
- **[Hono](https://hono.dev/)**: 경량 API 프레임워크  
- **[Drizzle ORM](https://orm.drizzle.team/)**: 데이터베이스 ORM  
- **[Neon DB](https://neon.tech/)**: 확장형 클라우드 DB  
- **[Logoipsum](https://logoipsum.com/)**: 임시 로고 리소스  
- **Next.js 14**: 서버 사이드 렌더링 React 프레임워크  
- **TailwindCSS**: 유틸리티 중심 CSS 프레임워크  
- **Shadcn UI**: 현대적이고 재사용 가능한 UI 컴포넌트  
- **Tanstack React Query**: 데이터 페칭 및 캐싱  
- **Plaid**: 금융 데이터 API 연동  
- **Lemon Squeezy**: 디지털 제품 판매 및 결제  
- **Vercel**: 서버리스 배포 플랫폼  

---

## ⚙️ 프로젝트 설정 (Project Setup)
다음 단계를 따라 로컬 환경에서 프로젝트를 설정하세요 👇

1. **저장소 클론**
   ```bash
   git clone https://github.com/JosueIsOffline/finance-platform.git
   cd finance-platform
   ```
