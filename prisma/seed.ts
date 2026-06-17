import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient, Role } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@yhct.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@123456';
  const adminPhoneNumber = process.env.SEED_ADMIN_PHONE ?? null;

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      phoneNumber: adminPhoneNumber,
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
    },
    update: {
      phoneNumber: adminPhoneNumber,
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  console.log('Seeded admin account:', {
    id: adminUser.id,
    email: adminUser.email,
    role: adminUser.role,
  });
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
