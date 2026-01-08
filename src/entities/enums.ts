export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum Platform {
  INSTAGRAM = 'INSTAGRAM',
  YOUTUBE = 'YOUTUBE',
  BLOG = 'BLOG',
  TIKTOK = 'TIKTOK',
  TWITTER = 'TWITTER',
  FACEBOOK = 'FACEBOOK',
  OTHER = 'OTHER',
}

export enum CampaignStatus {
  // Admin approval
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED', // This might not be a direct status, but a trigger for other statuses
  REJECTED = 'REJECTED',
  
  // Live statuses
  RECRUITING = 'RECRUITING',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEWING = 'REVIEWING',
  ENDED = 'ENDED',
  FORCE_ENDED = 'FORCE_ENDED', // Admin forced end

  // UI-driven statuses
  UPCOMING = 'UPCOMING',
  TODAY_OPEN = 'TODAY_OPEN',
  OPEN_SOON = 'OPEN_SOON',
  CLOSING_SOON = 'CLOSING_SOON',
}

export enum ApplicationStatus {
  APPLYING = 'APPLYING',
  SELECTED = 'SELECTED',
  NOT_SELECTED = 'NOT_SELECTED',
  CANCELED = 'CANCELED',
}

export enum VisitStatus {
  VISIT_PENDING = 'VISIT_PENDING',
  VISIT_COMPLETED = 'VISIT_COMPLETED',
  VISIT_NOT_COMPLETED = 'VISIT_NOT_COMPLETED',
}

export enum ReviewStatus {
  REVIEW_PENDING = 'REVIEW_PENDING',
  REVIEW_COMPLETED = 'REVIEW_COMPLETED',
}

export enum PointType {
  EARN = 'EARN',
  WITHDRAW = 'WITHDRAW',
  PENDING = 'PENDING',
  PAYMENT = 'PAYMENT', // Advertiser payment
}

export enum PointStatus {
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export enum PenaltyType {
  APPLIED = 'APPLIED',
  RELEASED = 'RELEASED',
}

export enum InquiryType {
  POINT = 'POINT',
  CAMPAIGN = 'CAMPAIGN',
  ACCOUNT = 'ACCOUNT',
  OTHER = 'OTHER',
}

export enum InquiryStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export enum UserRole {
  INFLUENCER = 'INFLUENCER',
  ADVERTISER = 'ADVERTISER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  OPERATOR = 'OPERATOR',
}

export enum BusinessStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
  BLACKLISTED = 'BLACKLISTED',
}

export enum AdminActionType {
  // User Management
  APPROVE_ADVERTISER = 'APPROVE_ADVERTISER',
  REJECT_ADVERTISER = 'REJECT_ADVERTISER',
  UPDATE_USER_STATUS = 'UPDATE_USER_STATUS',
  CREATE_USER = 'CREATE_USER', // Admin manually created user
  UPDATE_USER_INFO = 'UPDATE_USER_INFO', // Admin manually updated user info

  // Campaign Management
  APPROVE_CAMPAIGN = 'APPROVE_CAMPAIGN',
  REJECT_CAMPAIGN = 'REJECT_CAMPAIGN',
  FORCE_END_CAMPAIGN = 'FORCE_END_CAMPAIGN',
  CREATE_CAMPAIGN_BY_ADMIN = 'CREATE_CAMPAIGN_BY_ADMIN',

  // Point Management
  APPROVE_WITHDRAWAL = 'APPROVE_WITHDRAWAL',
  REJECT_WITHDRAWAL = 'REJECT_WITHDRAWAL',
  ADJUST_POINTS = 'ADJUST_POINTS',
  
  // Admin Management
  CREATE_ADMIN = 'CREATE_ADMIN',
  DELETE_ADMIN = 'DELETE_ADMIN',
  UPDATE_ADMIN_ROLE = 'UPDATE_ADMIN_ROLE',
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT', // Cash charge
  CAMPAIGN_LOCK = 'CAMPAIGN_LOCK', // Escrow for campaign
  CAMPAIGN_PAYOUT = 'CAMPAIGN_PAYOUT', // Point payout to influencer
  WITHDRAWAL_REQUEST = 'WITHDRAWAL_REQUEST', // Point withdrawal request
  WITHDRAWAL_COMPLETED = 'WITHDRAWAL_COMPLETED', // Withdrawal done
  WITHDRAWAL_REJECTED = 'WITHDRAWAL_REJECTED', // Withdrawal rejected (refund)
  ADMIN_ADJUSTMENT = 'ADMIN_ADJUSTMENT', // Admin manual adjustment
}
