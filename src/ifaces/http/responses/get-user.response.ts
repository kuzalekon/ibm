import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../modules/users/entities/user.entity';
import { RoleType } from '../../../modules/users/entities/role.entity';

export class GetUserResponse {
  @ApiProperty()
  public readonly id: number;

  @ApiProperty()
  public readonly name: string;

  @ApiProperty()
  public readonly login: string;

  @ApiProperty()
  public readonly organizaton: string;

  constructor({ id, name, login, organization }: User) {
    this.id = id;
    this.name = name;
    this.login = login;
    this.organizaton = organization.name;
  }
}

export class GetUserWithRolesResponse extends GetUserResponse {
  @ApiProperty({ enum: RoleType })
  public readonly roles: RoleType[];

  constructor(user: User) {
    super(user);

    this.roles = user.roles.map(role => role.name as RoleType);
  }
}
