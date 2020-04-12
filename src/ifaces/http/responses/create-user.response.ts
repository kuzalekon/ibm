import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponse {
  @ApiProperty()
  public readonly id: number;

  constructor({ id }) {
    this.id = id;
  }
}
