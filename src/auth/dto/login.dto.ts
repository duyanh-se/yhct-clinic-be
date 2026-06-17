import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Số điện thoại của người dùng (Bệnh nhân hoặc Nhân viên)',
    example: '0901234567',
  })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: 'Mật khẩu đăng nhập',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  password!: string;
}
