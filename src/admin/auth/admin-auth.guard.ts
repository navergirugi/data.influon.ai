import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminAuthGuard extends AuthGuard('admin-jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    // Passport가 왜 실패했는지 상세 정보를 로그로 출력합니다.
    if (err || !user) {
      console.error('--- [AdminAuthGuard] Authentication Failed ---');
      console.error('Error:', err);
      console.error('Info:', info);
      console.error('-------------------------------------------');
    }
    
    // 원래 로직(에러 발생)을 그대로 실행합니다.
    return super.handleRequest(err, user, info, context);
  }
}
