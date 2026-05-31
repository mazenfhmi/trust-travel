import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@trusttravel.com';
  
  // Check if admin already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.log('Admin user already exists!');
    return;
  }

  const passwordHash = await bcrypt.hash('Admin@1234', 10);
  
  const admin = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: 'System',
      lastName: 'Administrator',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    }
  });

  console.log('Admin user created successfully:');
  console.log(`Email: ${admin.email}`);
  console.log(`Password: Admin@1234`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
