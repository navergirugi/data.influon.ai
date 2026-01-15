import {
  Injectable,
  UnauthorizedException,
  Inject,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { Repository, In } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { UserRole } from "../../entities/enums";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { ChangePasswordDto } from "./dto/change-password.dto";

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async login(loginDto: AdminLoginDto, ip: string) {
    const { email, password } = loginDto;
    const loginFailKey = `login_fail:${email}`;
    const blockKey = `block_login:${email}`;

    // 1. Check if blocked
    const isBlocked = await this.cacheManager.get(blockKey);
    if (isBlocked) {
      throw new ForbiddenException(
        "Too many login attempts. Please try again in 15 minutes.",
      );
    }

    // 2. Find Admin User (Allow ADMIN, SUPER_ADMIN, OPERATOR)
    const user = await this.userRepository.findOne({
      where: { 
        email, 
        role: In([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATOR]) 
      },
    });
    console.log("user not ---------------");
    // 3. Validate Password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      // Handle Login Failure (Rate Limiting)
      const fails = (await this.cacheManager.get<number>(loginFailKey)) || 0;
      if (fails >= 4) {
        // 5th attempt fails
        await this.cacheManager.set(blockKey, true, 900000); // Block for 15 mins (900000ms)
        await this.cacheManager.del(loginFailKey); // Reset counter
        throw new ForbiddenException(
          "Too many login attempts. Account blocked for 15 minutes.",
        );
      } else {
        await this.cacheManager.set(loginFailKey, fails + 1, 300000); // Count fails, expire in 5 mins
      }
      throw new UnauthorizedException("Invalid credentials");
    }

    // 4. Login Success
    await this.cacheManager.del(loginFailKey); // Reset fail counter

    // Update last login info
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    // Generate Token
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      isAdmin: true,
    };
    const accessToken = this.jwtService.sign(payload);
    console.log("user ==>", user);
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async logout(token: string) {
    // Add token to blacklist
    // Assuming token expiration is 12 hours (43200000 ms), we blacklist it for that duration
    await this.cacheManager.set(`blacklist:${token}`, true, 43200000);
    return { message: "Logged out successfully" };
  }

  async getProfile(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      lastLoginAt: user.lastLoginAt,
    };
  }

  async changePassword(user: User, dto: ChangePasswordDto) {
    const { currentPassword, newPassword } = dto;

    // Verify current password
    // Need to fetch password explicitly if select: false is used (not the case here but good practice)
    const admin = await this.userRepository.findOne({ where: { id: user.id } });

    if (!admin || !(await bcrypt.compare(currentPassword, admin.password))) {
      throw new UnauthorizedException("Current password is incorrect.");
    }

    // Hash new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    admin.password = hashedPassword;
    await this.userRepository.save(admin);

    return { message: "Password changed successfully." };
  }
}
