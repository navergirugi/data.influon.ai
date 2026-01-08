import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository, DataSource } from 'typeorm';
import { UpdateBusinessStatusDto } from '../admin/dto/update-business-status.dto';
import { BusinessStatus, UserRole, UserStatus } from '../entities/enums';
import { UpdateUserStatusDto } from '../admin/dto/update-user-status.dto';
import { CreateUserManualDto } from '../admin/dto/create-user-manual.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserInfoManualDto } from '../admin/dto/update-user-info-manual.dto';
import { UserStatusHistory } from '../entities/user-status-history.entity';
import { Wallet } from '../entities/wallet.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserStatusHistory)
    private readonly userStatusHistoryRepository: Repository<UserStatusHistory>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private dataSource: DataSource,
  ) {}

  async createUserManual(dto: CreateUserManualDto): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const { email, password, ...rest } = dto;

      const existingUser = await manager.findOne(User, { where: [{ email }, { nickname: rest.nickname }] });
      if (existingUser) {
        throw new ConflictException('Email or nickname already exists.');
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = manager.create(User, {
        email,
        password: hashedPassword,
        ...rest,
        status: UserStatus.ACTIVE,
      });
      const savedUser = await manager.save(user);

      const wallet = manager.create(Wallet, { user: savedUser });
      await manager.save(wallet);

      return savedUser;
    });
  }

  async updateUserInfoManual(userId: string, dto: UpdateUserInfoManualDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async updateUserStatusWithHistory(userId: string, status: UserStatus, reason: string, adminUser: User): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID "${userId}" not found`);
      }

      const previousStatus = user.status;
      user.status = status;

      const history = new UserStatusHistory();
      history.targetUser = user;
      history.changedBy = adminUser;
      history.previousStatus = previousStatus;
      history.newStatus = status;
      history.reason = reason;

      await queryRunner.manager.save(user);
      await queryRunner.manager.save(history);

      await queryRunner.commitTransaction();
      return user;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateBusinessStatus(userId: string, updateDto: UpdateBusinessStatusDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId, role: UserRole.ADVERTISER } });

    if (!user) {
      throw new NotFoundException(`Advertiser with ID "${userId}" not found`);
    }

    user.businessStatus = updateDto.businessStatus;
    if (updateDto.businessStatus === BusinessStatus.REJECTED) {
      user.rejectionReason = updateDto.rejectionReason;
    } else {
      user.rejectionReason = null;
    }

    return this.userRepository.save(user);
  }

  async updateUserStatus(userId: string, updateDto: UpdateUserStatusDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    user.status = updateDto.status;
    return this.userRepository.save(user);
  }
}
