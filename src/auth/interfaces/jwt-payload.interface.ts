import { Role } from '@common/enums/role.enum';

export interface JwtPayload {
  sub: string;
  role: Role;
  iat?: number; // Issued At (Thời gian tạo token - JwtModule tự thêm)
  exp?: number; // Expiration Time (Thời gian hết hạn - JwtModule tự thêm)
}
