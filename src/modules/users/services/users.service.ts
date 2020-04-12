import { CreateUserRequest } from '../../../ifaces/http/requests/create-user.request';
import { Injectable } from '@nestjs/common';
import { OrganizationsRepository } from '../repositories/origanizations.repository';
import { RolesRepository } from '../repositories/roles.repository';
import { UpdateResult, DeleteResult } from 'typeorm';
import { UpdateUserRequest } from '../../../ifaces/http/requests/update-user.request';
import { User } from '../entities/user.entity';
import { UsersRepository } from '../repositories/users.repository';
import { getOrderValue, getSkipValue } from '../../../utils/paginationUtils';

type FindAllAndCountOptions = {
  readonly sortBy?: string;
  readonly page?: number;
  readonly pageSize?: number;
};

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly organizationsRepository: OrganizationsRepository,
    private readonly rolesRepository: RolesRepository,
  ) {}

  // prettier-ignore
  async findAllAndCount(
    { sortBy = 'name', page = 1, pageSize = 10 }: FindAllAndCountOptions = {}
  ): Promise<[User[], number]> {
    return this.usersRepository.findAndCount({
      relations: ['organization'],
      order: getOrderValue(sortBy),
      skip: getSkipValue(page, pageSize),
      take: pageSize,
    });
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({
      relations: ['organization', 'roles'],
      where: { id },
    });
  }

  async findOneOrFail(id: number): Promise<User> {
    return this.usersRepository.findOneOrFail({
      relations: ['organization', 'roles'],
      where: { id },
    });
  }

  async create(createRequest: CreateUserRequest): Promise<User> {
    const { organization: organizationName, roles: roleNames, ...rest } = createRequest;
    const organization = await this.organizationsRepository.findOneByNameOrCreate(organizationName);
    const roles = await this.rolesRepository.findByNames(roleNames);

    return this.usersRepository.save({ ...rest, organization, roles });
  }

  async updateById(id: number, updateRequest: UpdateUserRequest): Promise<UpdateResult> {
    console.info('upda');
    const { organization: organizationName, roles: roleNames, ...rest } = updateRequest;
    const updateData: any = { ...rest };

    if (organizationName) {
      updateData.organization = this.organizationsRepository.findOneByNameOrCreate(organizationName);
    }

    if (roleNames) {
      updateData.roles = this.rolesRepository.findByNames(roleNames);
    }

    return this.usersRepository.update(id, updateData);
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }
}
