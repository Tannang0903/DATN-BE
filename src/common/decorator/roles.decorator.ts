import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common'
import { UserRole } from '../types/enum'
import { AccessTokenGuard, RolesGuard } from 'src/guard'
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger'

export function Roles(...roles: UserRole[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AccessTokenGuard, RolesGuard),
    ApiBearerAuth(),
    ApiForbiddenResponse({ description: 'Forbidden' })
  )
}
