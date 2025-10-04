import { DataSource } from 'typeorm';
import { User } from 'src/users/user.entity';
import { UserRole } from 'src/userRoles/userRole.entity';
import { UserRoles } from 'src/userRoles/userRoles.enum';

const usersToCreate = [
  { name: 'john1', email: 'john1.official@mail.ru', password: '123456', roleId: 0 },
  { name: 'admin', email: 'admin.official@mail.ru', password: '123456', roleId: 0 },
];

export const seedUsers = async (dataSource: DataSource) => {
  const usersRepository = dataSource.getRepository(User);
  const userRolesRepository = dataSource.getRepository(UserRole);

  const users = await usersRepository.find();

  const userRole = await userRolesRepository.findOne({ where: { name: UserRoles.USER } });
  const adminRole = await userRolesRepository.findOne({ where: { name: UserRoles.ADMIN } });

  if (!userRole || !adminRole) {
    throw new Error('User roles are missing in the database. Please seed roles first.');
  }

  usersToCreate[0].roleId = userRole.id;
  usersToCreate[1].roleId = adminRole.id;

  const usersEntities = usersToCreate.map((u) => usersRepository.create(u));

  if (!users.length) {
    await usersRepository.save(usersEntities);
    console.log('✅ Users seeded');
  } else {
    console.log('ℹ️ Users already exist!');
  }
};
