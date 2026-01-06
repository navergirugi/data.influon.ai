import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { PointTransaction } from '../entities/point-transaction.entity';
import { PointType, PointStatus } from '../entities/enums';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { WithdrawPointDto } from './dto/withdraw-point.dto';

@Injectable()
export class MyPageService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PointTransaction)
    private pointTransactionRepository: Repository<PointTransaction>,
  ) {}

  async getMyPageData(userId: string) {
    // Mocking user for now if not found (since no auth/seed)
    let user = await this.userRepository.findOne({ 
        where: { id: userId },
        relations: ['socialConnections'] 
    });

    if (!user) {
        // Return mock data structure if user not found (for dev)
        return {
            success: true,
            data: {
                userProfile: {
                    name: '김인플',
                    nickname: 'influencer_kim',
                    email: 'influon@example.com',
                    points: 150000,
                    // ... other fields
                }
            }
        };
    }

    return {
      success: true,
      data: {
        userProfile: user,
      },
    };
  }

  async checkNickname(nickname: string) {
    const existingUser = await this.userRepository.findOne({ where: { nickname } });
    if (existingUser) {
      throw new ConflictException('이미 사용 중인 닉네임입니다.');
    }
    return {
      success: true,
      message: '사용 가능한 닉네임입니다.',
    };
  }

  async updateProfile(userId: string, body: UpdateProfileDto) {
    // Implement update logic
    return {
      success: true,
      data: body, // Echo back
    };
  }

  async getPointHistory(userId: string, query: any) {
    const history = await this.pointTransactionRepository.find({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' }
    });

    return {
      success: true,
      data: history,
    };
  }

  async withdrawPoint(userId: string, body: WithdrawPointDto) {
    // Implement withdrawal logic
    // 1. Check balance
    // 2. Create transaction (PENDING)
    // 3. Deduct points (or hold)
    
    return {
      success: true,
      message: '포인트 인출 신청이 완료되었습니다.',
    };
  }
}
