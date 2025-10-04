import { DataSource } from 'typeorm';
import { UserRole } from 'src/userRoles/userRole.entity';
import { UserRoles } from 'src/userRoles/userRoles.enum';

const userRolesToCreate = [{ name: UserRoles.ADMIN }, { name: UserRoles.USER }];

export const seedUserRoles = async (dataSource: DataSource) => {
  const userRolesRepository = dataSource.getRepository(UserRole);
  const userRoles = await userRolesRepository.find();

  if (!userRoles.length) {
    await userRolesRepository.save(userRolesToCreate);
    console.log('✅ User roles seeded');
  } else {
    console.log('ℹ️ User roles already exist!');
  }
};
