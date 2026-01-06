import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { FindAccountDto } from './dto/find-account.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    // private jwtService: JwtService, // Need to import JwtModule in AuthModule
  ) {}

  async signin(body: SignInDto) {
    const { email, password } = body;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || user.password !== password) { // TODO: Use bcrypt for password comparison
      throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    // const payload = { sub: user.id, email: user.email };
    // const token = this.jwtService.sign(payload);
    const token = 'dummy-jwt-token'; // Mock token

    return {
      success: true,
      data: {
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            nickname: user.nickname,
        }
      },
    };
  }

  async signup(body: SignUpDto) {
    const { email, password, name, nickname, phone } = body;

    const existingUser = await this.userRepository.findOne({ where: [{ email }, { nickname }] });
    if (existingUser) {
        throw new ConflictException('이미 존재하는 이메일 또는 닉네임입니다.');
    }

    const user = this.userRepository.create({
        email,
        password, // TODO: Hash password
        name,
        nickname,
        phone,
    });

    await this.userRepository.save(user);

    return {
      success: true,
      message: '회원가입이 완료되었습니다.',
    };
  }

  async findAccount(body: FindAccountDto) {
    // Mock implementation
    return {
      success: true,
      message: '계정 찾기 기능은 아직 구현되지 않았습니다.',
    };
  }

  async checkNickname(nickname: string) {
    const user = await this.userRepository.findOne({ where: { nickname } });
    if (user) {
        throw new ConflictException('이미 사용 중인 닉네임입니다.');
    }
    return {
        success: true,
        message: '사용 가능한 닉네임입니다.',
    };
  }

  async sendEmailCode(email: string) {
      // Mock implementation
      return {
          success: true,
          message: '인증 코드가 전송되었습니다.',
      };
  }

  async withdrawUser(userId: string) {
    // Soft delete user
    await this.userRepository.softDelete(userId);
    
    return {
      success: true,
      message: '회원 탈퇴가 완료되었습니다.',
    };
  }
}
