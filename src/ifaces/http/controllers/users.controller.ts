import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiQuery,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Response,
  UseFilters,
  UseInterceptors,
  SerializeOptions,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateUserRequest } from '../requests/create-user.request';
import { OrmExceptionFilter } from '../filters/orm-exception.filter';
import { Response as ExpressResponse } from 'express';
import { ToPositiveInteger } from '../../../utils/pipes/toPositiveInteger.pipe';
import { UpdateUserRequest } from '../requests/update-user.request';
import { UsersService } from '../../../modules/users/services/users.service';
import { User } from 'src/modules/users/entities/user.entity';

const NOT_FOUND_ERROR_MESAGE = 'Not Found';
const VALIDATION_ERROR_MESSAGE = 'Validation Error';

// Swagger definitions
class UserWithoutRoles extends PartialType(OmitType(User, ['roles'])) {}
class UserWithIdOnly extends PartialType(PickType(User, ['id'])) {}

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user list' })
  @ApiQuery({ name: 'sort_by', description: 'Which field the list will be sorted', type: String, required: false })
  @ApiQuery({ name: 'page', description: 'Page number', type: Number, required: false })
  @ApiQuery({ name: 'page_size', description: 'Elements per page', type: Number, required: false })
  @ApiOkResponse({ description: 'User entity list', type: [UserWithoutRoles] })
  @Get()
  @SerializeOptions({ excludePrefixes: ['roles'] })
  async findAll(
    @Response() res: ExpressResponse,
    @Query('sort_by') sortBy: string = 'name',
    @Query('page', ToPositiveInteger) page: number = 1,
    @Query('page_size', ToPositiveInteger) pageSize: number = 10,
  ): Promise<void> {
    const [users, count] = await this.usersService.findAllAndCount({ sortBy, page, pageSize });
    res.set('X-Total-Count', String(count)).json(users);
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiOkResponse({ description: 'User entity', type: User })
  @ApiNotFoundResponse({ description: NOT_FOUND_ERROR_MESAGE })
  @Get(':userId')
  @UseFilters(OrmExceptionFilter)
  async findOne(@Param('userId', ParseIntPipe) userId: number): Promise<User> {
    return this.usersService.findOneOrFail(userId);
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({ description: 'Successfully created', type: UserWithIdOnly })
  @ApiBadRequestResponse({ description: VALIDATION_ERROR_MESSAGE })
  @Post()
  async createById(@Body() createUserRequest: CreateUserRequest): Promise<UserWithIdOnly> {
    const { id } = await this.usersService.create(createUserRequest);
    return { id };
  }

  @ApiOperation({ summary: 'Update user by ID' })
  @ApiOkResponse({ description: 'Successfully updated' })
  @ApiNotFoundResponse({ description: NOT_FOUND_ERROR_MESAGE })
  @ApiBadRequestResponse({ description: VALIDATION_ERROR_MESSAGE })
  @Put(':userId')
  @UseFilters(OrmExceptionFilter)
  async updateById(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserRequest: UpdateUserRequest,
  ): Promise<void> {
    await this.usersService.updateById(userId, updateUserRequest);
  }

  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiNoContentResponse({ description: 'Successfully deleted' })
  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('userId', ParseIntPipe) userId: number): Promise<void> {
    await this.usersService.deleteById(userId);
  }
}
