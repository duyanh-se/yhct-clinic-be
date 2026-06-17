import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { RequestWithUser } from '@common/interfaces/request-with-user.interface';
import { RegisterDto } from './dto/register.dto';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { RegisterStaffDto } from './dto/register-staff.dto';

@ApiTags('Xác thực (Auth)') // Nhóm API trên Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // API ví dụ để test việc dùng Token
  @UseGuards(AuthGuard('jwt')) // Bật Guard bảo vệ API
  @Get('profile')
  @ApiBearerAuth() // Báo cho Swagger biết API này cần nhập Token ở nút Authorize
  @ApiOperation({ summary: 'Lấy thông tin người dùng đang đăng nhập' })
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin giải mã từ Token.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token không hợp lệ hoặc đã hết hạn.',
  })
  getProfile(@Request() req: RequestWithUser) {
    // req.user chứa thông tin từ hàm validate() của JwtStrategy trả về
    return req.user;
  }

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản Bệnh nhân mới' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công.' })
  @ApiResponse({
    status: 409,
    description: 'Số điện thoại đã tồn tại (Conflict).',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập vào hệ thống' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register-staff')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo tài khoản Nhân sự (Chỉ dành cho Admin)' })
  async registerStaff(@Body() dto: RegisterStaffDto) {
    return this.authService.registerStaff(dto);
  }
}
