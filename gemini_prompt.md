# Backend API Implementation Status (2024-Current)

## 1. 구현된 API (Endpoints)

### A. Admin Controller (`/admin`)
- **User Management**
  - `GET /users/search`: 사용자 검색 (이름, 이메일, 닉네임)
  - `POST /users`: 사용자 생성 (관리자에 의한 수동 생성)
  - `PATCH /users/:id`: 사용자 정보 수정
  - `DELETE /users/:id`: 사용자 삭제 (자산 잔액 확인)
  - `GET /advertisers`, `GET /influencers`: 역할별 목록 조회
- **Admin Management**
  - `GET /admins`, `POST /admins`, `PATCH /admins/:id`, `DELETE /admins/:id`: 관리자 CRUD
  - `PATCH /admins/:id/role`: 관리자 권한 변경
- **Campaign Management**
  - `GET /campaigns`: 전체 캠페인 목록 조회
  - `POST /campaigns/create-by-admin`: 캠페인 생성
  - `PATCH /campaigns/:id`: 캠페인 정보 수정
  - `DELETE /campaigns/:id`: 캠페인 삭제
  - `GET /campaign-applications`: 캠페인 참여 신청 목록 조회
  - `PATCH /campaign-applications/:id/status`: 신청 상태 변경 (승인/반려)
- **Finance**
  - `GET /transactions`: 포인트 변동 내역 조회 (`Transaction` 테이블)
  - `POST /users/:id/balance/adjust`: 포인트 수동 지급/차감 (유효기간 설정 가능)
  - `GET /points/withdrawals`: 출금 신청 목록 조회 (`PointTransaction` 테이블)
  - `PATCH /points/withdrawals/:id`: 출금 신청 처리

### B. Payments Controller (`/admin/payments`)
- `GET /`: 결제 내역 조회 (`Payment` 테이블)

## 2. 데이터베이스 및 엔티티 (Database)

### Entities
- **User**: `name`, `businessName`, `businessNumber` 등 필드 확인 및 활용
- **Transaction**: 자산 변동 로그. `expiresAt` 컬럼 추가 (포인트 유효기간)
- **PointTransaction**: 출금 신청 관리용 (Legacy 호환)
- **Payment**: PG사 결제 내역 저장용 (신규 생성)
- **CampaignApplication**: 캠페인 참여 신청 관리

### Service Logic
- **WalletService**:
  - `adjustBalance`: 관리자 수동 지급 시 유효기간(`expiresAt`) 설정 로직 추가
  - `Transaction` 테이블에 로그 기록
- **TasksService**:
  - 매일 자정 만료된 포인트를 자동 차감하는 스케줄러 구현 (`@Cron`)
- **AdminService**:
  - 모든 관리자 기능에 대한 비즈니스 로직 통합 구현

## 3. 설정 및 기타 (Configuration)
- **NestJS**: CORS 설정, Global Prefix 확인
- **Security**: `AdminAuthGuard` 및 `RolesGuard` 적용
