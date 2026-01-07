import { DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Campaign } from '../../entities/campaign.entity';
import { CampaignApplication } from '../../entities/campaign-application.entity';
import { PointTransaction } from '../../entities/point-transaction.entity';
import { SocialConnection } from '../../entities/social-connection.entity';
import { Gender, Platform, CampaignStatus, ApplicationStatus, VisitStatus, ReviewStatus, PointType, PointStatus, UserRole } from '../../entities/enums';
import * as bcrypt from 'bcrypt';

export const seedDatabase = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  const campaignRepository = dataSource.getRepository(Campaign);
  const applicationRepository = dataSource.getRepository(CampaignApplication);
  const pointTransactionRepository = dataSource.getRepository(PointTransaction);
  const socialConnectionRepository = dataSource.getRepository(SocialConnection);

  // 0. Create Admin User
  const adminEmail = 'admin@influon.com';
  let adminUser = await userRepository.findOne({ where: { email: adminEmail } });
  if (!adminUser) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('admin1234', salt);
    adminUser = userRepository.create({
      email: adminEmail,
      password: hashedPassword,
      name: '관리자',
      nickname: 'influon_admin',
      role: UserRole.ADMIN,
    });
    await userRepository.save(adminUser);
    console.log('Admin user created!');
  }


  // 1. Create User
  let user = await userRepository.findOne({ where: { email: 'influon@example.com' } });
  if (!user) {
    user = userRepository.create({
      email: 'influon@example.com',
      name: '김인플',
      nickname: 'influencer_kim',
      profileImage: 'https://placehold.co/96x96/E9E9E9/757575?text=USER',
      location: '서울',
      birthYear: '1995',
      gender: Gender.FEMALE,
      phone: '010-1234-5678',
      points: 150000,
      role: UserRole.INFLUENCER,
    });
    await userRepository.save(user);

    // Social Connections
    const socials = [
      { platform: Platform.YOUTUBE, url: 'https://youtube.com/example', isConnected: true, providerId: 'yt_123' },
      { platform: Platform.INSTAGRAM, url: 'https://instagram.com/example', isConnected: true, providerId: 'ig_123' },
    ];

    for (const s of socials) {
      const social = socialConnectionRepository.create({
        user,
        platform: s.platform,
        url: s.url,
        isConnected: s.isConnected,
        providerId: s.providerId,
      });
      await socialConnectionRepository.save(social);
    }

    // Point History
    const points = [
        { type: PointType.EARN, amount: 50000, status: PointStatus.COMPLETED, description: '여름맞이 뷰티 캠페인', createdAt: new Date('2024-08-15') },
        { type: PointType.WITHDRAW, amount: 20000, status: PointStatus.COMPLETED, description: '인출', createdAt: new Date('2024-08-10') },
        { type: PointType.EARN, amount: 30000, status: PointStatus.COMPLETED, description: '맛집 탐방 캠페인', createdAt: new Date('2024-07-25') },
    ];

    for (const p of points) {
        const tx = pointTransactionRepository.create({
            user,
            type: p.type,
            amount: p.amount,
            status: p.status,
            description: p.description,
            createdAt: p.createdAt
        });
        await pointTransactionRepository.save(tx);
    }
  }

  // 2. Create Campaigns
  const campaignsData = [
    {
      title: '브이엔디 성수점 리뷰 이벤트',
      subTitle: '브이엔디 세트메뉴 + 사이드 제공',
      shopName: '브이엔디 성수점',
      image: 'https://placehold.co/400x300/E9E9E9/757575?text=VND_Seongsu',
      platform: Platform.YOUTUBE,
      category: '맛집',
      status: CampaignStatus.IN_PROGRESS, // Changed from TODAY_OPEN to IN_PROGRESS as per mock data logic, but let's use TODAY_OPEN for main list query
      period: '2024.08.24-2024.08.31',
      announcementDate: new Date('2024-09-01'),
      reviewDeadline: new Date('2024-09-15'),
      hasVideo: true,
      keywords: ['성수맛집', '성수동일식'],
      serviceDetail: '브이엔디 세트메뉴 + 사이드 제공',
      missionGuide: '영상 1분 내외 편집 필수',
      notice: '주말 방문 불가',
      address: '서울시 성동구 서울숲 6길 22 지하 1층',
      lat: 37.5469112,
      lng: 127.0433291,
    },
    {
      title: '[강남] 프리미엄 헤어살롱 체험단',
      subTitle: '전체 시술 50% 할인 및 클리닉 서비스',
      shopName: '프리미엄 헤어살롱',
      image: 'https://placehold.co/400x300/E9E9E9/757575?text=Hair_Gangnam',
      platform: Platform.INSTAGRAM,
      category: '뷰티',
      status: CampaignStatus.IN_PROGRESS,
      period: '2024.08.20-2024.08.30',
      announcementDate: new Date('2024-09-01'),
      reviewDeadline: new Date('2024-09-15'),
      hasVideo: false,
      keywords: ['강남미용실', '레이어드컷'],
      address: '서울 강남구 테헤란로 123',
      lat: 37.4999072,
      lng: 127.0344425,
    },
    {
      title: '[홍대] 숨은 카페 디저트 체험단',
      subTitle: '시그니처 에이드 2잔 + 디저트 플래터',
      shopName: '홍대 카페',
      image: 'https://placehold.co/400x300/E9E9E9/757575?text=Cafe_Hongdae',
      platform: Platform.YOUTUBE,
      category: '카페',
      status: CampaignStatus.UPCOMING,
      period: '2024.09.01-2024.09.10',
      announcementDate: new Date('2024-09-12'),
      reviewDeadline: new Date('2024-09-30'),
      hasVideo: true,
      keywords: ['홍대카페', '연남동디저트'],
      address: '서울 마포구 와우산로 45',
      lat: 37.5485376,
      lng: 126.9228062,
    }
  ];

  // Force one to be TODAY_OPEN for the main list query
  campaignsData[0].status = CampaignStatus.TODAY_OPEN;

  for (const cData of campaignsData) {
    const existing = await campaignRepository.findOne({ where: { title: cData.title } });
    if (!existing) {
      const campaign = campaignRepository.create(cData);
      await campaignRepository.save(campaign);
    }
  }

  console.log('Database seeded successfully!');
};
