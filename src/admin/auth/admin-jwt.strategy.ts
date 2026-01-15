import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../../entities/enums';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    const secret = configService.get<string>('ADMIN_JWT_SECRET') || configService.get<string>('JWT_SECRET');
    console.log('[AdminJwtStrategy] JWT Secret for Verification:', secret ? `${secret.substring(0, 5)}...` : 'NOT FOUND');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      passReqToCallback: true, // To access the token itself
    });
  }

  async validate(req: any, payload: any): Promise<User> {
    console.log('[AdminJwtStrategy] Validating payload:', payload);

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    
    // Check Blacklist
    const isBlacklisted = await this.cacheManager.get(`blacklist:${token}`);
    if (isBlacklisted) {
      console.error('[AdminJwtStrategy] Token is blacklisted');
      throw new UnauthorizedException('Token is invalidated (logged out).');
    }

    const { id, isAdmin } = payload;

    if (!isAdmin) {
      console.error('[AdminJwtStrategy] Not an admin token');
      throw new UnauthorizedException('Not an admin token.');
    }

    const user = await this.userRepository.findOne({ where: { id } });

    // 역할 체크 로직 수정: ADMIN, SUPER_ADMIN, OPERATOR 허용
    const allowedRoles = [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATOR];
    if (!user || !allowedRoles.includes(user.role)) {
      console.error(`[AdminJwtStrategy] User not found or invalid role. User: ${user?.email}, Role: ${user?.role}`);
      throw new UnauthorizedException('Access denied. Admin only.');
    }

    console.log('[AdminJwtStrategy] Validation success for user:', user.email);
    return user;
  }
}
