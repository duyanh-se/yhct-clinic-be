import { Request } from 'express';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface'; // Import payload bạn đã tạo

// Kế thừa toàn bộ Request gốc của Express, nhưng ghi đè/thêm thuộc tính user
export interface RequestWithUser extends Request {
  user: JwtPayload;
}
