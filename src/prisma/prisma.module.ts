import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Biến module này thành toàn cục (Global)
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export để các module khác có thể sử dụng
})
export class PrismaModule {}
