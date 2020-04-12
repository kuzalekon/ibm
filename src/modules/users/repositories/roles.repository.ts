import { EntityRepository, Repository, In } from 'typeorm';
import { Role } from '../entities/role.entity';

@EntityRepository(Role)
export class RolesRepository extends Repository<Role> {
  async findByNames(names: string[]): Promise<Role[]> {
    const roles = await this.find({
      where: { name: In(names) },
      order: { name: 'ASC' },
    });

    if (roles.length !== names.length) {
      throw new Error('Some of roles not found!');
    }

    return roles;
  }
}
