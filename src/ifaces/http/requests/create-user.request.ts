import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsEnum, IsString, Length } from 'class-validator';
import { RoleType } from '../../../modules/users/entities/role.entity';

export class CreateUserRequest {
  @ApiProperty()
  @IsString()
  @Length(1, 64)
  readonly name: string;

  @ApiProperty()
  @IsString()
  @Length(1, 32)
  readonly login: string;

  @ApiProperty()
  @IsString()
  @Length(6, 64)
  readonly password: string;

  @ApiProperty()
  @IsString()
  @Length(1, 64)
  readonly organization: string;

  @ApiProperty({ type: [String], enum: RoleType })
  @ArrayNotEmpty()
  @IsEnum(RoleType, { each: true })
  readonly roles: RoleType[];
}
