import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  IsEmail,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Địa chỉ email của bệnh nhân',
    example: 'nguyenvana@gmail.com',
  })
  @IsEmail({}, { message: 'Định dạng email không hợp lệ' }) // ✅ Dùng cái này
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: 'Số điện thoại đăng nhập',
    example: '0901234567',
  })
  @IsString()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
    message: 'Số điện thoại không hợp lệ',
  })
  phoneNumber!: string;

  @ApiProperty({
    description: 'Mật khẩu bảo mật',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 100, { message: 'Mật khẩu phải từ 6 đến 100 ký tự' })
  password!: string;

  @ApiProperty({
    description: 'Họ và tên đầy đủ của bệnh nhân',
    example: 'Nguyễn Văn A',
  })
  @IsString()
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  fullName!: string;
}
