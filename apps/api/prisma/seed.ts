import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  const passwordHash = await bcrypt.hash('Admin123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@trusttravel.sa' },
    update: {},
    create: {
      email: 'admin@trusttravel.sa',
      passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
    },
  });

  const agent = await prisma.user.upsert({
    where: { email: 'agent@trusttravel.sa' },
    update: {},
    create: {
      email: 'agent@trusttravel.sa',
      passwordHash,
      firstName: 'Booking',
      lastName: 'Agent',
      role: UserRole.BOOKING_AGENT,
    },
  });

  const visaReviewer = await prisma.user.upsert({
    where: { email: 'visa@trusttravel.sa' },
    update: {},
    create: {
      email: 'visa@trusttravel.sa',
      passwordHash,
      firstName: 'Visa',
      lastName: 'Reviewer',
      role: UserRole.VISA_REVIEWER,
    },
  });

  const financeViewer = await prisma.user.upsert({
    where: { email: 'finance@trusttravel.sa' },
    update: {},
    create: {
      email: 'finance@trusttravel.sa',
      passwordHash,
      firstName: 'Finance',
      lastName: 'Viewer',
      role: UserRole.FINANCE_VIEWER,
    },
  });

  const travelerPassword = await bcrypt.hash('Travel123!', 12);
  const traveler = await prisma.user.upsert({
    where: { email: 'traveler@test.com' },
    update: {},
    create: {
      email: 'traveler@test.com',
      passwordHash: travelerPassword,
      firstName: 'Test',
      lastName: 'Traveler',
      role: UserRole.TRAVELER,
    },
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
