# 인플루언 AI 백엔드 프로젝트 분석 및 개발 가이드

이 문서는 `data.influon.al` 백엔드 프로젝트의 기술 스택, 환경 설정, 구조, 문제 해결 과정 등을 상세히 기록하여, 새로운 개발자나 다른 Gemini 채팅 세션에서 프로젝트의 전체 맥락을 빠르게 파악할 수 있도록 돕는 것을 목표로 합니다.

## 1. 프로젝트 개요

-   **프로젝트명**: `influon-backend` (디렉토리: `data.influon.al`)
-   **주요 기능**: 인플루언 AI 플랫폼의 백엔드 서비스
-   **기술 스택**:
    -   **프레임워크**: NestJS (TypeScript)
    -   **데이터베이스**: PostgreSQL (v16)
    -   **ORM**: TypeORM
    -   **캐시**: Redis (v7)
    -   **개발 환경**: Docker Compose

## 2. 개발 환경 설정

### 2.1. 환경 변수 관리 전략 (`.env`)

`cross-env`와 NestJS의 `ConfigModule`을 사용하여 개발 단계별로 환경 변수를 분리하여 관리합니다.

| 환경 | `NODE_ENV` | 사용하는 `.env` 파일 | 주요 목적 |
| :--- | :--- | :--- | :--- |
| **로컬** | `local` | `.env.local` | Docker를 이용한 개인 로컬 개발 (DB/Redis 컨테이너 사용) |
| **개발** | `development` | `.env.development` | 여러 개발자가 함께 사용하는 공유 개발 서버 |
| **상용** | `production` | `.env` | 실제 서비스 운영 서버 |

### 2.2. Docker Compose 설정 (`docker-compose.yml`)

로컬 개발에 필요한 PostgreSQL과 Redis를 Docker 컨테이너로 관리합니다.

-   **주요 기능**:
    -   **변수 관리**: `--env-file .env.local` 옵션을 통해 `.env.local` 파일의 변수(`POSTGRES_PORT` 등)를 Docker Compose 설정에 직접 사용합니다.
    -   **포트 설정**: `.env.local` 파일에 정의된 포트 번호를 사용하여 호스트와 컨테이너 간의 포트를 연결합니다. (예: `${POSTGRES_PORT}:5432`)
    -   **데이터 영속성**: Bind Mount 방식을 사용하여 프로젝트 내 `docker_data` 폴더에 실제 DB 데이터를 저장하여 관리의 편의성을 높였습니다.
    -   **Healthcheck 및 `--wait`**: `healthcheck`와 `--wait` 옵션을 통해 DB와 Redis가 완전히 준비된 후에 NestJS 앱이 시작되도록 보장하여, 실행 순서에 따른 접속 오류를 방지합니다.

### 2.3. API 문서 (Swagger)

-   **설정 위치**: `src/main.ts`
-   **기능**: `SwaggerModule`을 사용하여 실행 중인 API의 명세를 자동으로 생성하고, 테스트 UI를 제공합니다.
-   **접속 주소**: API 서버가 실행되면 `http://localhost:{PORT}/api` 주소로 접속할 수 있습니다. (예: `http://localhost:5000/api`)

## 3. 데이터베이스 스키마 (TypeORM Entities)

프론트엔드 요구사항을 기반으로 데이터베이스 스키마를 설계했으며, 모든 엔티티는 `src/entities` 폴더에서 관리합니다.

-   **핵심 엔티티**:
    -   `User`: 사용자 프로필, 포인트, 소셜 연동 정보 등
    -   `Campaign`: 캠페인 상세 정보, 상태, 모집 요건 등
    -   `CampaignApplication`: 사용자와 캠페인 간의 신청 정보 및 상태 관리
    -   `SocialConnection`: 플랫폼별(인스타그램, 유튜브 등) OAuth 정보 관리
-   **Enum 관리**: 모든 Enum(열거형)은 `src/entities/enums.ts` 파일에서 중앙 관리하여 순환 참조 문제를 방지하고 일관성을 유지합니다.
-   **TypeORM 설정**:
    -   **설정 파일**: `src/config/typeorm.config.ts`
    -   **동적 설정**: 활성화된 `.env` 파일의 `POSTGRES_...` 변수들을 읽어 동적으로 DB 접속 정보를 생성합니다.
    -   **스키마 동기화**: 상용 환경을 제외한 환경에서는 `synchronize: true` 옵션을 통해 코드가 변경될 때마다 DB 스키마를 자동으로 동기화합니다.

## 4. 구현된 API 목록

프론트엔드 목업 데이터를 기반으로 다음 API들이 구현되어 있습니다. (현재 인증 로직은 더미 데이터 사용)

### 4.1. 캠페인 (`CampaignsModule`)
-   `GET /v1/campaigns/main-list`: 메인 화면 캠페인 목록 조회 (오늘 오픈, 내 주변 등)
-   `GET /v1/campaigns/search`: 캠페인 검색 (카테고리, 플랫폼 필터)
-   `GET /v1/campaigns/:id`: 캠페인 상세 정보 조회
-   `POST /v1/campaigns/apply`: 캠페인 신청

### 4.2. 마이페이지 (`MyPageModule`)
-   `GET /v1/mypage`: 내 프로필 정보 조회
-   `POST /v1/mypage/nickname-check`: 닉네임 중복 확인
-   `POST /v1/mypage/profile`: 프로필 정보 수정
-   `GET /v1/mypage/point-history`: 포인트 적립/사용 내역 조회
-   `POST /v1/mypage/withdraw`: 포인트 인출 신청

### 4.3. 인증 (`AuthModule`)
-   `POST /v1/auth/signin`: 로그인 (더미 토큰 발급)
-   `POST /v1/auth/signup`: 회원가입
-   `POST /v1/auth/find-account`: 계정 찾기 (미구현)
-   `POST /v1/auth/check-nickname`: 닉네임 중복 확인 (회원가입용)
-   `POST /v1/auth/send-email-code`: 이메일 인증 코드 전송 (미구현)
-   `DELETE /v1/auth/withdrawal`: 회원 탈퇴 (Soft Delete)

## 5. 주요 문제 해결 히스토리 (Troubleshooting)

개발 환경 설정 과정에서 발생했던 주요 문제와 해결 과정을 기록합니다.

### 5.1. 문제: "Database is uninitialized and superuser password is not specified"
-   **원인**: `docker-compose.yml`의 변수 치환(`${...}`) 시, `docker-compose` 명령어가 `.env.local` 파일을 자동으로 읽지 못해 `POSTGRES_PASSWORD`가 빈 값으로 전달됨.
-   **해결**: `package.json`의 `docker-compose` 실행 스크립트에 `--env-file .env.local` 옵션을 명시하여, 변수 치환에 사용할 파일을 직접 지정해 줌.

### 5.2. 문제: "ECONNREFUSED" (NestJS 앱이 DB에 접속 실패)
-   **원인**: `docker-compose up -d` 명령어가 컨테이너의 준비 상태를 기다리지 않고 바로 종료되어, 아직 준비되지 않은 DB에 NestJS 앱이 접속을 시도함.
-   **해결**:
    1.  `docker-compose.yml`에 `healthcheck`를 추가하여 DB와 Redis의 서비스 준비 상태를 확인할 수 있도록 함.
    2.  `package.json`의 `docker-compose up` 명령어에 `--wait` 옵션을 추가하여, `healthcheck`가 성공할 때까지 대기하도록 만듦.

### 5.3. 문제: "Column ... is defined as enum, but missing enumName"
-   **원인**: TypeORM을 사용하여 PostgreSQL에 Enum 타입을 매핑할 때, DB에 생성될 Enum 타입의 이름을 지정하는 `enumName` 속성이 누락됨.
-   **해결**: 모든 엔티티의 Enum 타입 컬럼 데코레이터(`@Column`)에 `enumName: '..._enum'` 속성을 추가함.

## 6. 로컬 개발 시작 가이드

새로운 개발 환경에서 프로젝트를 실행하는 방법입니다.

1.  **`.env.local` 파일 생성**:
    프로젝트 루트의 `.env.local.example` 파일을 복사하여 `.env.local` 파일을 생성합니다. (이 파일은 `.gitignore`에 의해 버전 관리에서 제외됩니다.)
    ```properties
    # PostgreSQL 접속 정보
    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    POSTGRES_USER=influon
    POSTGRES_PASSWORD=password
    POSTGRES_DB=influon_db

    # Redis 접속 정보
    REDIS_HOST=localhost
    REDIS_PORT=6379

    # JWT 인증 시크릿 키
    JWT_SECRET="local_secret_key"

    # NestJS 앱 실행 포트
    PORT=5000
    ```

2.  **의존성 패키지 설치**:
    ```bash
    npm install
    ```

3.  **데이터베이스 초기화 (Seeding)**:
    (DB가 실행 중이어야 함. 최초 1회 실행)
    ```bash
    npm run seed:local
    ```

4.  **로컬 서버 실행**:
    ```bash
    npm run start:local
    ```
    위 명령어는 다음 작업을 순차적으로 자동 실행합니다.
    -   기존 Docker 컨테이너를 중지 및 삭제 (`docker-compose down`)
    -   `.env.local` 파일을 참조하여 Docker 컨테이너(Postgres, Redis)를 백그라운드로 실행 (`docker-compose up -d`)
    -   컨테이너들이 완전히 준비될 때까지 대기 (`--wait`)
    -   NestJS API 서버를 `watch` 모드로 실행

5.  **API 접속 및 확인**:
    -   **API 서버**: `http://localhost:5000`
    -   **Swagger API 문서**: `http://localhost:5000/api`
