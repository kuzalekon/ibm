import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiQuery,
} from '@nestjs/swagger';
import {
  Controller,
  Response,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
  HttpCode,
  Query,
  UseFilters,
} from '@nestjs/common';
import { CreateUserRequest } from '../requests/create-user.request';
import { CreateUserResponse } from '../responses/create-user.response';
import { GetUserResponse, GetUserWithRolesResponse } from '../responses/get-user.response';
import { OrmExceptionFilter } from '../filters/orm-exception.filter';
import { Response as ExpressResponse } from 'express';
import { ToPositiveInteger } from '../../../utils/pipes/toPositiveInteger.pipe';
import { UpdateUserRequest } from '../requests/update-user.request';
import { UsersService } from '../../../modules/users/services/users.service';

const NOT_FOUND_ERROR_MESAGE = 'Not Found';
const VALIDATION_ERROR_MESSAGE = 'Validation Error';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user list' })
  @ApiQuery({ name: 'sort_by', description: 'Which field the list will be sorted', type: String, required: false })
  @ApiQuery({ name: 'page', description: 'Page number', type: Number, required: false })
  @ApiQuery({ name: 'page_size', description: 'Elements per page', type: Number, required: false })
  @ApiOkResponse({ description: 'User entity list', type: [GetUserResponse] })
  @Get()
  async findAll(
    @Response() res: ExpressResponse,
    @Query('sort_by') sortBy?: string,
    @Query('page', ToPositiveInteger) page?: number,
    @Query('page_size', ToPositiveInteger) pageSize?: number,
  ): Promise<void> {
    const [users, count] = await this.usersService.findAllAndCount({ sortBy, page, pageSize });
    res.set('X-Total-Count', String(count)).json(users.map(user => new GetUserResponse(user)));
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiOkResponse({ description: 'User entity', type: GetUserWithRolesResponse })
  @ApiNotFoundResponse({ description: NOT_FOUND_ERROR_MESAGE })
  @Get(':userId')
  @UseFilters(OrmExceptionFilter)
  async findOne(@Param('userId') userId: number): Promise<GetUserResponse> {
    return new GetUserWithRolesResponse(await this.usersService.findOneOrFail(userId));
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({ description: 'Successfully created', type: CreateUserResponse })
  @ApiBadRequestResponse({ description: VALIDATION_ERROR_MESSAGE })
  @Post()
  async createById(@Body() createUserRequest: CreateUserRequest): Promise<CreateUserResponse> {
    return new CreateUserResponse(await this.usersService.create(createUserRequest));
  }

  @ApiOperation({ summary: 'Update user by ID' })
  @ApiOkResponse({ description: 'Successfully updated' })
  @ApiNotFoundResponse({ description: NOT_FOUND_ERROR_MESAGE })
  @ApiBadRequestResponse({ description: VALIDATION_ERROR_MESSAGE })
  @Put(':userId')
  @UseFilters(OrmExceptionFilter)
  async updateById(@Param('userId') userId: number, @Body() updateUserRequest: UpdateUserRequest): Promise<void> {
    await this.usersService.updateById(userId, updateUserRequest);
  }

  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiNoContentResponse({ description: 'Successfully deleted' })
  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('userId') userId: number): Promise<void> {
    await this.usersService.deleteById(userId);
  }
}
