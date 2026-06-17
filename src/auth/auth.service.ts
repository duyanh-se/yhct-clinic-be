import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterStaffDto } from './dto/register-staff.dto';
import { Role } from '@common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // 1. Tìm user theo số điện thoại
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Email không tồn tại hoặc mật khẩu không đúng',
      );
    }

    // 2. Kiểm tra mật khẩu (so sánh mã băm)
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // 3. Tạo payload cho JWT
    const payload = { sub: user.id, role: user.role };

    // 4. Trả về Token
    return {
      access_token: await this.jwtService.signAsync(payload),
      role: user.role,
    };
  }
  async register(registerDto: RegisterDto) {
    const { email, phoneNumber, password, fullName } = registerDto;

    // 1. Kiểm tra xem số điện thoại đã tồn tại chưa
    const existingUser = await this.prisma.user.findUnique({
      where: { email, phoneNumber },
    });

    if (existingUser) {
      throw new ConflictException(
        'Email hoặc số điện thoại này đã được đăng ký tài khoản',
      );
    }

    // 2. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Tạo mã bệnh nhân tự động (Ví dụ: BN + Chuỗi thời gian)
    // Thực tế có thể thiết kế format: BN-2026-0001
    const patientCode = `BN${Date.now()}`;

    // 4. Sử dụng Transaction để tạo đồng thời User và Patient
    // Nếu 1 trong 2 lỗi, toàn bộ thao tác sẽ bị hủy (Rollback)
    const result = await this.prisma.$transaction(async (tx) => {
      // 4.1 Tạo tài khoản đăng nhập (Mặc định Role là PATIENT)
      const newUser = await tx.user.create({
        data: {
          email,
          phoneNumber,
          passwordHash: hashedPassword,
          role: 'PATIENT',
        },
      });

      // 4.2 Tạo hồ sơ bệnh nhân và liên kết với User vừa tạo qua userId
      const newPatient = await tx.patient.create({
        data: {
          userId: newUser.id,
          patientCode: patientCode,
          fullName: fullName,
        },
      });

      return { newUser, newPatient };
    });

    // 5. Trả về kết quả (Không trả về passwordHash)
    return {
      message: 'Đăng ký tài khoản thành công',
      data: {
        userId: result.newUser.id,
        patientCode: result.newPatient.patientCode,
        fullName: result.newPatient.fullName,
      },
    };
  }

  async registerStaff(dto: RegisterStaffDto) {
    const { email, phoneNumber, password, role } = dto;

    // Chặn không cho tạo tài khoản Patient qua API này (Patient đã có API riêng)
    if (role === Role.PATIENT) {
      throw new ConflictException(
        'Không thể tạo tài khoản Bệnh nhân qua cổng nội bộ',
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { phoneNumber },
    });
    if (existingUser) throw new ConflictException('Số điện thoại đã tồn tại');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo User nhân viên (Bạn có thể dùng $transaction nếu có bảng Employee riêng giống như bảng Patient)
    const newUser = await this.prisma.user.create({
      data: {
        email,
        phoneNumber,
        passwordHash: hashedPassword,
        role: role,
      },
    });

    return {
      message: `Tạo tài khoản ${role} thành công`,
      data: { userId: newUser.id, role: newUser.role },
    };
  }
}
