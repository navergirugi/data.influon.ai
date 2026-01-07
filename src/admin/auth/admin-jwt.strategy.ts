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
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('ADMIN_JWT_SECRET') || configService.get<string>('JWT_SECRET'),
      passReqToCallback: true, // To access the token itself
    });
  }

  async validate(req: any, payload: any): Promise<User> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    
    // Check Blacklist
    const isBlacklisted = await this.cacheManager.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token is invalidated (logged out).');
    }

    const { id, isAdmin } = payload;

    if (!isAdmin) {
      throw new UnauthorizedException('Not an admin token.');
    }

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user || user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Access denied. Admin only.');
    }

    return user;
  }
}
