import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 1. Khởi tạo connection pool bằng thư viện pg
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    // 2. Bọc pool vào adapter của Prisma
    const adapter = new PrismaPg(pool);

    // 3. Bắt buộc truyền adapter vào hàm super() đối với Prisma v7
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
