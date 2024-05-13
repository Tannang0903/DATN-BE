import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { RoleService } from './role.service'
import { AccessTokenGuard } from 'src/guard'
import { Roles, UUIDParam, UserRole } from 'src/common'
import { CreateRoleDto, UpdateRoleDto } from './dto'

@ApiBearerAuth()
@ApiTags('Role')
@Controller()
@UseGuards(AccessTokenGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('roles/:id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getRoleById(@Param() { id }: UUIDParam) {
    return await this.roleService.getById(id)
  }

  @Get('roles')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getAllRoles() {
    return await this.roleService.getAll()
  }

  @Post('roles')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.create(createRoleDto)
  }

  @Put('roles/:id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateRole(@Param() { id }: UUIDParam, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.roleService.update(id, updateRoleDto)
  }

  @Delete('roles/:id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeRole(@Param() { id }: UUIDParam) {
    return await this.roleService.delete(id)
  }
}
