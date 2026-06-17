import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Trong thực tế, secret này nên lấy từ file .env (ví dụ: process.env.JWT_SECRET)
      secretOrKey: process.env.JWT_SECRET || 'JWT_SECRET',
    });
  }

  // Hàm này tự động chạy sau khi Token được giải mã thành công
  // ✅ Chuẩn xác, gọn gàng và tối ưu hiệu suất (Đồng bộ)
  validate(payload: JwtPayload) {
    return { userId: payload.sub, role: payload.role };
  }
}
