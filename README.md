# Influon AI Backend

This is the backend service for Influon AI, built with NestJS, PostgreSQL, and Redis.

## Tech Stack
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT, OAuth (Social Login)
- **ORM**: TypeORM or Prisma (Prisma recommended for schema design)

## Database Schema Design

Based on the frontend data structures, here is the proposed database schema.

### Users (User)
- `id`: UUID (PK)
- `email`: String (Unique)
- `password`: String (Hashed, nullable for social login)
- `name`: String
- `nickname`: String (Unique)
- `profileImage`: String (URL)
- `location`: String
- `birthYear`: String
- `gender`: Enum ('MALE', 'FEMALE')
- `phone`: String
- `points`: Integer (Default 0)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `deletedAt`: DateTime (Soft delete for withdrawal)

### SocialConnections
- `id`: UUID (PK)
- `userId`: UUID (FK -> User.id)
- `platform`: Enum ('YOUTUBE', 'INSTAGRAM', 'BLOG', 'TIKTOK', 'FACEBOOK', 'OTHER')
- `providerId`: String (Social Platform ID)
- `accessToken`: String
- `refreshToken`: String
- `isConnected`: Boolean
- `url`: String (Profile URL)

### Campaigns (Campaign)
- `id`: Integer (PK, Auto-increment)
- `title`: String
- `subTitle`: String
- `shopName`: String
- `image`: String (URL)
- `platform`: Enum ('INSTAGRAM', 'YOUTUBE', 'BLOG', 'TIKTOK', 'TWITTER')
- `category`: String
- `status`: Enum ('IN_PROGRESS', 'RECRUITING', 'REVIEWING', 'ENDED', 'UPCOMING', 'TODAY_OPEN', 'OPEN_SOON', 'CLOSING_SOON')
- `period`: String (e.g., "2024.05.01 ~ 2024.05.31")
- `announcementDate`: DateTime
- `reviewDeadline`: DateTime
- `hasVideo`: Boolean
- `keywords`: String[] (Array of strings)
- `serviceDetail`: Text
- `missionGuide`: Text
- `notice`: Text
- `companionCount`: String
- `reviewMaintenance`: String
- `sponsoredTag`: String
- `address`: String
- `lat`: Float
- `lng`: Float
- `offDays`: String
- `breakTime`: String
- `availableTime`: String
- `blogUrl`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime

### CampaignApplications (Application)
- `id`: Integer (PK)
- `campaignId`: Integer (FK -> Campaign.id)
- `userId`: UUID (FK -> User.id)
- `status`: Enum ('APPLYING', 'SELECTED', 'NOT_SELECTED', 'CANCELED')
- `participationType`: Enum ('FREE', 'PAID')
- `rewardPoint`: Integer
- `visitDate`: Date
- `visitTime`: Time
- `companionCount`: Integer
- `reviewUrl`: String
- `reviewStatus`: Enum ('PENDING', 'COMPLETED')
- `visitStatus`: Enum ('PENDING', 'COMPLETED', 'NOT_COMPLETED')
- `createdAt`: DateTime
- `updatedAt`: DateTime

### PointTransactions
- `id`: UUID (PK)
- `userId`: UUID (FK -> User.id)
- `type`: Enum ('EARN', 'WITHDRAW', 'PENDING')
- `amount`: Integer
- `status`: Enum ('PROCESSING', 'COMPLETED', 'CANCELED')
- `description`: String (e.g., Campaign Name)
- `createdAt`: DateTime

### Penalties
- `id`: UUID (PK)
- `userId`: UUID (FK -> User.id)
- `type`: Enum ('APPLIED', 'RELEASED')
- `reason`: String
- `appliedAt`: DateTime
- `releasedAt`: DateTime
- `campaignId`: Integer (FK -> Campaign.id, Nullable)

### Favorites (Like)
- `userId`: UUID (FK -> User.id)
- `campaignId`: Integer (FK -> Campaign.id)
- (Composite PK: userId, campaignId)

### Inquiries
- `id`: UUID (PK)
- `userId`: UUID (FK -> User.id)
- `title`: String
- `content`: Text
- `type`: Enum ('POINT', 'CAMPAIGN', 'ACCOUNT', 'OTHER')
- `status`: Enum ('PENDING', 'COMPLETED')
- `answerContent`: Text
- `answeredAt`: DateTime
- `createdAt`: DateTime

### Notifications
- `id`: UUID (PK)
- `userId`: UUID (FK -> User.id)
- `title`: String
- `message`: String
- `type`: String
- `isRead`: Boolean
- `createdAt`: DateTime

## Setup Instructions

1.  Initialize NestJS project:
    ```bash
    nest new .
    ```
2.  Install dependencies:
    ```bash
    npm install @nestjs/typeorm typeorm pg @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt redis
    ```
3.  Configure `docker-compose.yml` for PostgreSQL and Redis.

## Push Notifications (FCM)

For details on how to set up and use the Push Notification system (FCM), please refer to the [Notification Guide](./notification.md).

- **Features**: Token registration, Event-based notifications (Apply, Select, etc.), Scheduled notifications.
- **Setup**: Requires `firebase-admin` setup and `.env` configuration.
