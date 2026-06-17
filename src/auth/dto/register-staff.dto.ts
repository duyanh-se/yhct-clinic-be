import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  Matches,
  IsEmail,
} from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class RegisterStaffDto {
  @ApiProperty({
    description: 'Địa chỉ email của bệnh nhân',
    example: 'nguyenvana@gmail.com',
  })
  @IsEmail({}, { message: 'Định dạng email không hợp lệ' }) // ✅ Dùng cái này
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: '0909999888' })
  @IsString()
  @IsNotEmpty()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
  phoneNumber!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ example: 'Trần Thị B' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  // Điểm khác biệt quan trọng: Cho phép truyền Role vào
  @ApiProperty({
    enum: [Role.DOCTOR, Role.RECEPTIONIST, Role.ADMIN],
    description: 'Quyền hạn của nhân viên',
  })
  @IsEnum(Role)
  role!: Role;
}
