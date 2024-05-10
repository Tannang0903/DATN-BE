import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { UserService } from './users.service'
import { CreateUserDto, GetUsersDto, UpdateUserDto } from './dto'
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger'
import { UUIDParam } from 'src/common/types/uuid-param'
import { AccessTokenGuard } from 'src/guard'
import { ReqUser, RequestUser, Roles, UserRole } from 'src/common'

@Controller()
@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users/:id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  getUserById(@Param() { id }: UUIDParam) {
    return this.userService.getById(id)
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@ReqUser() user: RequestUser) {
    return this.userService.getProfile(user)
  }

  @Get('users')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'search', required: false })
  getAllUsers(@Query() params: GetUsersDto) {
    return this.userService.getAll(params)
  }

  @Post('users')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    description: 'Example request body for creating an user',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        rolesId: { type: 'string[]' }
      },
      example: {
        username: 'Tan Nang',
        email: 'tannang09032002@gmail.com',
        password: '12345678',
        rolesId: ['88205f2c-45b6-4b06-a7be-0aa272046c0c']
      }
    }
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Put('users/:id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({
    description: 'Example request body for updating an user',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        password: { type: 'string' }
      },
      example: {
        name: 'User Name',
        password: '12345678'
      }
    }
  })
  updateUser(@Param() { id }: UUIDParam, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto)
  }

  @Delete('users/:id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  removeUser(@Param() { id }: UUIDParam) {
    return this.userService.delete(id)
  }
}
