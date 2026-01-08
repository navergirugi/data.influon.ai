import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { User } from '../../entities/user.entity';
import { Campaign } from '../../entities/campaign.entity';
import { Wallet } from '../../entities/wallet.entity';
import { Transaction } from '../../entities/transaction.entity';
import { SocialConnection } from '../../entities/social-connection.entity';
import {
  UserRole,
  UserStatus,
  BusinessStatus,
  Gender,
  Platform,
  CampaignStatus,
  TransactionType,
} from '../../entities/enums';

export const seedDatabase = async (dataSource: DataSource) => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Clear existing data from all relevant tables
    await queryRunner.manager.query('TRUNCATE "user" CASCADE;');
    await queryRunner.manager.query('TRUNCATE wallet CASCADE;');
    await queryRunner.manager.query('TRUNCATE transaction CASCADE;');
    await queryRunner.manager.query('TRUNCATE campaign CASCADE;');
    await queryRunner.manager.query('TRUNCATE campaign_application CASCADE;');
    await queryRunner.manager.query('TRUNCATE admin_audit_log CASCADE;');
    await queryRunner.manager.query('TRUNCATE user_status_history CASCADE;');
    await queryRunner.manager.query('TRUNCATE admin_note CASCADE;');
    await queryRunner.manager.query('TRUNCATE social_connection CASCADE;');
    await queryRunner.manager.query('TRUNCATE penalty CASCADE;');
    await queryRunner.manager.query('TRUNCATE favorite CASCADE;');
    await queryRunner.manager.query('TRUNCATE inquiry CASCADE;');
    await queryRunner.manager.query('TRUNCATE notification CASCADE;');
    await queryRunner.manager.query('TRUNCATE device_token CASCADE;');


    const userRepository = queryRunner.manager.getRepository(User);
    const walletRepository = queryRunner.manager.getRepository(Wallet);
    const transactionRepository = queryRunner.manager.getRepository(Transaction);
    const campaignRepository = queryRunner.manager.getRepository(Campaign);
    const socialConnectionRepository = queryRunner.manager.getRepository(SocialConnection);

    const ADMIN_PASSWORD = 'admin1234';
    const USER_PASSWORD = 'password123';
    const NUM_ADVERTISERS = 10;
    const NUM_INFLUENCERS = 10;
    const CAMPAIGNS_PER_ADVERTISER = 10;

    const createdUsers: { [key: string]: User } = {};
    const createdAdvertisers: User[] = [];
    const createdInfluencers: User[] = [];

    // --- 1. Create Admin Users ---
    const salt = await bcrypt.genSalt();

    const superAdmin = userRepository.create({
      email: 'superadmin@influon.com',
      name: 'Super Admin',
      nickname: 'super_admin',
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      password: await bcrypt.hash(ADMIN_PASSWORD, salt),
    });
    createdUsers['super_admin'] = await userRepository.save(superAdmin);
    await walletRepository.save(walletRepository.create({ user: createdUsers['super_admin'] }));

    const operator = userRepository.create({
      email: 'operator@influon.com',
      name: 'Operator',
      nickname: 'operator',
      role: UserRole.OPERATOR,
      status: UserStatus.ACTIVE,
      password: await bcrypt.hash(ADMIN_PASSWORD, salt),
    });
    createdUsers['operator'] = await userRepository.save(operator);
    await walletRepository.save(walletRepository.create({ user: createdUsers['operator'] }));

    console.log('Admin users created.');

    // --- Fixed Test Users ---
    const fixedAdvertiser = userRepository.create({
      email: 'advertiser@influon.com',
      name: 'Fixed Advertiser',
      nickname: 'fixed_advertiser',
      role: UserRole.ADVERTISER,
      status: UserStatus.ACTIVE,
      businessName: 'Fixed Corp',
      businessNumber: '999-88-77777',
      businessStatus: BusinessStatus.APPROVED,
      password: await bcrypt.hash(USER_PASSWORD, salt),
    });
    createdUsers['fixed_advertiser'] = await userRepository.save(fixedAdvertiser);
    const fixedAdvertiserWallet = walletRepository.create({ user: createdUsers['fixed_advertiser'], cashBalance: 1000000 });
    await walletRepository.save(fixedAdvertiserWallet);
    await transactionRepository.save(transactionRepository.create({
        wallet: fixedAdvertiserWallet,
        type: TransactionType.DEPOSIT,
        amount: fixedAdvertiserWallet.cashBalance,
        balanceAfter: fixedAdvertiserWallet.cashBalance,
        currency: 'CASH',
        description: '고정 광고주 초기 충전',
    }));
    createdAdvertisers.unshift(fixedAdvertiser); // Add to the beginning

    const fixedInfluencer = userRepository.create({
      email: 'influencer@influon.com',
      name: 'Fixed Influencer',
      nickname: 'fixed_influencer',
      role: UserRole.INFLUENCER,
      status: UserStatus.ACTIVE,
      gender: Gender.FEMALE,
      birthYear: '1990',
      password: await bcrypt.hash(USER_PASSWORD, salt),
    });
    createdUsers['fixed_influencer'] = await userRepository.save(fixedInfluencer);
    const fixedInfluencerWallet = walletRepository.create({ user: createdUsers['fixed_influencer'], pointBalance: 50000 });
    await walletRepository.save(fixedInfluencerWallet);
    await transactionRepository.save(transactionRepository.create({
        wallet: fixedInfluencerWallet,
        type: TransactionType.ADMIN_ADJUSTMENT,
        amount: fixedInfluencerWallet.pointBalance,
        balanceAfter: fixedInfluencerWallet.pointBalance,
        currency: 'POINT',
        description: '고정 인플루언서 초기 포인트',
        adminUser: createdUsers['super_admin'],
    }));
    createdInfluencers.unshift(fixedInfluencer); // Add to the beginning
    await socialConnectionRepository.save(socialConnectionRepository.create({
      user: fixedInfluencer,
      platform: Platform.INSTAGRAM,
      url: 'https://instagram.com/fixed_influencer',
      isConnected: true,
      providerId: faker.string.uuid(),
    }));
    console.log('Fixed test users created.');


    // --- 2. Create Advertisers (Dynamic) ---
    for (let i = 0; i < NUM_ADVERTISERS; i++) {
      const user = userRepository.create({
        email: faker.internet.email(),
        name: faker.person.fullName(),
        nickname: `advertiser_${i + 1}`,
        role: UserRole.ADVERTISER,
        status: UserStatus.ACTIVE,
        businessName: faker.company.name(),
        businessNumber: faker.string.numeric(10),
        businessStatus: i === 0 ? BusinessStatus.PENDING : BusinessStatus.APPROVED, // One pending advertiser
        password: await bcrypt.hash(USER_PASSWORD, salt),
      });
      const savedUser = await userRepository.save(user);
      const wallet = walletRepository.create({ user: savedUser, cashBalance: faker.number.int({ min: 100000, max: 1000000 }) });
      await walletRepository.save(wallet);
      await transactionRepository.save(transactionRepository.create({
        wallet,
        type: TransactionType.DEPOSIT,
        amount: wallet.cashBalance,
        balanceAfter: wallet.cashBalance,
        currency: 'CASH',
        description: '초기 충전',
      }));
      createdAdvertisers.push(savedUser);
      createdUsers[savedUser.nickname] = savedUser;
    }
    console.log(`${NUM_ADVERTISERS} dynamic advertisers created.`);

    // --- 3. Create Influencers (Dynamic) ---
    for (let i = 0; i < NUM_INFLUENCERS; i++) {
      const user = userRepository.create({
        email: faker.internet.email(),
        name: faker.person.fullName(),
        nickname: `influencer_${i + 1}`,
        role: UserRole.INFLUENCER,
        status: UserStatus.ACTIVE,
        gender: faker.helpers.arrayElement([Gender.MALE, Gender.FEMALE]),
        birthYear: faker.date.past({ years: 30 }).getFullYear().toString(),
        password: await bcrypt.hash(USER_PASSWORD, salt),
      });
      const savedUser = await userRepository.save(user);
      const wallet = walletRepository.create({ user: savedUser, pointBalance: faker.number.int({ min: 5000, max: 50000 }) });
      await walletRepository.save(wallet);
      await transactionRepository.save(transactionRepository.create({
        wallet,
        type: TransactionType.ADMIN_ADJUSTMENT,
        amount: wallet.pointBalance,
        balanceAfter: wallet.pointBalance,
        currency: 'POINT',
        description: '가입 축하 포인트',
        adminUser: createdUsers['super_admin'],
      }));
      createdInfluencers.push(savedUser);
      createdUsers[savedUser.nickname] = savedUser;

      // Add some social connections
      await socialConnectionRepository.save(socialConnectionRepository.create({
        user: savedUser,
        platform: faker.helpers.arrayElement(Object.values(Platform)),
        url: faker.internet.url(),
        isConnected: true,
        providerId: faker.string.uuid(),
      }));
    }
    console.log(`${NUM_INFLUENCERS} dynamic influencers created.`);

    // --- 4. Create Campaigns for each Advertiser ---
    const campaignStatuses = Object.values(CampaignStatus).filter(s => ![CampaignStatus.PENDING_APPROVAL, CampaignStatus.APPROVED].includes(s as CampaignStatus));
    const platforms = Object.values(Platform);

    for (const advertiser of createdAdvertisers) {
      for (let i = 0; i < CAMPAIGNS_PER_ADVERTISER; i++) {
        const startDate = faker.date.soon({ days: 60 }); // Start date within next 60 days
        const endDate = faker.date.soon({ days: 30, refDate: startDate }); // End date within 30 days of start
        const announcementDate = faker.date.soon({ days: 7, refDate: startDate });
        const reviewDeadline = faker.date.soon({ days: 14, refDate: endDate });

        const campaign = campaignRepository.create({
          title: faker.lorem.sentence(3) + ` (${advertiser.nickname}'s Campaign ${i + 1})`,
          subTitle: faker.lorem.sentence(5),
          shopName: faker.company.name(),
          image: faker.image.urlLoremFlickr({ category: 'business' }),
          platform: faker.helpers.arrayElement(platforms),
          category: faker.commerce.department(),
          status: i === 0 ? CampaignStatus.PENDING_APPROVAL : faker.helpers.arrayElement(campaignStatuses), // One pending campaign per advertiser
          period: `${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]}`,
          announcementDate: announcementDate,
          reviewDeadline: reviewDeadline,
          hasVideo: faker.datatype.boolean(),
          keywords: faker.lorem.words(3).split(' '),
          serviceDetail: faker.lorem.paragraph(),
          missionGuide: faker.lorem.paragraph(),
          notice: faker.lorem.sentence(),
          address: faker.location.streetAddress(true),
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
          advertiser: advertiser,
          createdByAdmin: faker.datatype.boolean(0.1) ? createdUsers['operator'] : null, // 10% chance created by admin
        });
        await campaignRepository.save(campaign);
      }
    }
    console.log(`${createdAdvertisers.length * CAMPAIGNS_PER_ADVERTISER} campaigns created.`);

    await queryRunner.commitTransaction();
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
};
