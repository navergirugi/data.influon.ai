import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async withdrawUser(userId: string) {
    // Soft delete user
    await this.userRepository.softDelete(userId);
    
    return {
      success: true,
      message: '회원 탈퇴가 완료되었습니다.',
    };
  }
}
