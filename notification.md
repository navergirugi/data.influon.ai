# 푸시 알림 (FCM) 구현 가이드

이 문서는 Influon 서비스의 푸시 알림 시스템(FCM) 설정 및 구현 방법을 설명합니다.

## 1. 개요
Influon은 **Firebase Cloud Messaging (FCM)**을 사용하여 웹(Web) 및 앱(Android/iOS) 사용자에게 푸시 알림을 전송합니다.
백엔드(NestJS)에서 중앙 집중식으로 알림을 관리하며, 캠페인 신청/선정/결과 등 주요 이벤트 발생 시 자동으로 알림을 발송합니다.

## 2. 사전 준비 사항 (Firebase 설정)

### 2.1 Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/)에 접속하여 새 프로젝트를 생성합니다.
2. 프로젝트 이름은 `influon-push` (예시) 등으로 설정합니다.

### 2.2 서비스 계정 키 생성 (백엔드용)
백엔드 서버가 FCM API를 호출하기 위한 인증 키입니다.
1. Firebase Console > **프로젝트 설정** (톱니바퀴 아이콘) > **서비스 계정** 탭으로 이동합니다.
2. **Firebase Admin SDK** 섹션에서 'Node.js'를 선택하고 **새 비공개 키 생성** 버튼을 클릭합니다.
3. 다운로드된 JSON 파일(예: `influon-push-firebase-adminsdk-xxx.json`)을 안전한 곳에 보관합니다.
4. 이 파일을 백엔드 프로젝트의 `src/config` 폴더 또는 보안이 유지되는 경로에 복사합니다. (Git에 커밋되지 않도록 주의!)

### 2.3 웹/앱 앱 추가 (프론트엔드용)
1. **프로젝트 개요** 페이지에서 앱 추가 버튼을 클릭합니다.
2. **웹 (Web)**:
   - 앱 닉네임 입력 후 등록.
   - `firebaseConfig` 객체 정보(apiKey, authDomain, projectId 등)를 복사하여 프론트엔드 프로젝트(`influon-ai`)의 환경 변수에 설정합니다.
3. **안드로이드 (Android)**:
   - 패키지 이름 입력 (예: `com.influon.app`).
   - `google-services.json` 파일을 다운로드하여 React Native 프로젝트의 `android/app` 폴더에 넣습니다.
4. **iOS**:
   - Bundle ID 입력.
   - `GoogleService-Info.plist` 파일을 다운로드하여 Xcode 프로젝트에 추가합니다.
   - APNs 인증 키(.p8)를 발급받아 Firebase Console의 클라우드 메시징 설정에 업로드해야 합니다.

## 3. 백엔드 설정 (NestJS)

### 3.1 환경 변수 설정 (.env)
`.env` 파일에 다음 내용을 추가합니다.

```env
# Firebase Admin SDK 설정
# 서비스 계정 키 파일의 절대 경로 또는 프로젝트 루트 기준 상대 경로
FIREBASE_CREDENTIAL_PATH=./src/config/firebase-adminsdk.json
```

### 3.2 패키지 설치
```bash
npm install firebase-admin @nestjs/schedule
```

### 3.3 서비스 계정 키 파일 배치
위 2.2에서 다운로드한 JSON 파일의 이름을 `firebase-adminsdk.json`으로 변경하고, `src/config/` 폴더에 위치시킵니다.
(파일명과 경로는 `.env` 설정과 일치해야 합니다.)

## 4. 프론트엔드/앱 연동 가이드

### 4.1 토큰 등록 API 호출
사용자가 로그인하거나 앱을 실행할 때, FCM 토큰을 발급받아 백엔드에 등록해야 합니다.

- **API 엔드포인트**: `POST /v1/notifications/token`
- **Header**: `Authorization: Bearer {JWT_TOKEN}`
- **Body**:
  ```json
  {
    "token": "fcm_device_token_string...",
    "deviceType": "web" // "android", "ios", "web" 중 하나
  }
  ```

### 4.2 웹 (Next.js) 구현
1. `firebase` 패키지 설치.
2. 서비스 워커(`firebase-messaging-sw.js`) 설정.
3. `getToken()` 메서드로 토큰 발급 후 위 API 호출.
4. `onMessage()`로 포그라운드 알림 처리.

### 4.3 앱 (React Native) 구현
1. `@react-native-firebase/app`, `@react-native-firebase/messaging` 설치.
2. 권한 요청 (`requestPermission`).
3. 토큰 발급 (`messaging().getToken()`) 후 위 API 호출.
4. 백그라운드/포그라운드 메시지 핸들러 설정.

## 5. 알림 발송 로직 (백엔드)

`NotificationsService`를 통해 알림을 발송합니다.

```typescript
// 예시: 캠페인 선정 알림 발송
await this.notificationsService.notifyCampaignSelected(user, '맛있는 파스타 체험단');
```

### 주요 메서드
- `notifyCampaignApplied(user, campaignTitle)`: 신청 완료 알림
- `notifyCampaignSelected(user, campaignTitle)`: 선정 알림
- `notifyCampaignRejected(user, campaignTitle)`: 미선정 알림
- `notifyPointPayment(user, amount, reason)`: 포인트 지급 알림
- `sendNotification(user, title, body, type, data)`: 커스텀 알림 발송

## 6. 트러블슈팅

- **알림이 오지 않을 때**:
  - DB의 `device_token` 테이블에 해당 사용자의 토큰이 등록되어 있는지 확인하세요.
  - 토큰의 `isActive`가 `true`인지 확인하세요.
  - Firebase Console의 "Cloud Messaging" 테스트 전송 기능을 이용해 해당 토큰으로 직접 발송해보세요.
  - 백엔드 로그에 `[Mock FCM]`이 아닌 실제 전송 성공 로그가 찍히는지 확인하세요. (현재 코드는 Mock 모드일 수 있음)

- **DB 에러 (deviceType 관련)**:
  - `device_token` 테이블의 `deviceType` 컬럼이 `NULL`인 데이터가 있는지 확인하고 정리해주세요.
