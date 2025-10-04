import { AppDataSource } from 'src/data.source';
import { seedUserRoles } from './userRoles';
import { seedUsers } from './users';

export async function seed() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  console.log('🔗 Database connected');

  try {
    await seedUserRoles(AppDataSource);
    await seedUsers(AppDataSource);
  } catch (err) {
    console.error('❌ Seeding failed', err);
  } finally {
    console.log('🌱 Seeding complete');
  }
}
seed();
