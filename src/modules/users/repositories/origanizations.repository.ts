import { EntityRepository, Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';

@EntityRepository(Organization)
export class OrganizationsRepository extends Repository<Organization> {
  async findOneByNameOrCreate(name: string): Promise<Organization> {
    return (await this.findOne({ name })) || (await this.save({ name }));
  }
}
