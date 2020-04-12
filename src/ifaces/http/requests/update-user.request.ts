import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, Length, IsEnum, ArrayNotEmpty } from 'class-validator';
import { RoleType } from '../../../modules/users/entities/role.entity';

export class UpdateUserRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 64)
  readonly name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(6, 64)
  readonly password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 64)
  readonly organization?: string;

  @ApiPropertyOptional({ enum: RoleType })
  @IsOptional()
  @ArrayNotEmpty()
  @IsEnum(RoleType, { each: true })
  readonly roles?: RoleType[];
}
