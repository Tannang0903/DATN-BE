import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard } from 'src/guard'
import { ProofService } from './proof.service'
import { ReqUser, Roles } from '@common/decorator'
import { RequestUser, UserRole, UUIDParam } from '@common/types'
import { ProofExternalDto, ProofInternalDto, ProofSpecialDto, RejectProofDto } from './dto'
import { GetProofsDto } from './dto/get-proof.dto'

@Controller()
@ApiTags('Proof')
export class ProofController {
  constructor(private readonly proofService: ProofService) {}

  @Get('proofs/:id')
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async getProofById(@Param() { id }: UUIDParam) {
    return await this.proofService.getById(id)
  }

  @Get('proofs')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async getAllProofs(@Query() params: GetProofsDto) {
    return await this.proofService.getAll(params)
  }

  @Get('proofs/:id/student')
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async getAllProofsByStudent(@Param() { id }: UUIDParam) {
    return await this.proofService.getAllByStudentId(id)
  }

  @Post('proofs/internal')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.STUDENT)
  @HttpCode(HttpStatus.CREATED)
  async makeProofInternal(@ReqUser() user: RequestUser, @Body() data: ProofInternalDto) {
    return await this.proofService.makeProofInternal(user, data)
  }

  @Post('proofs/external')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.STUDENT)
  @HttpCode(HttpStatus.CREATED)
  async makeProofExternal(@ReqUser() user: RequestUser, @Body() data: ProofExternalDto) {
    return await this.proofService.makeProofExternal(user, data)
  }

  @Post('proofs/special')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.STUDENT)
  @HttpCode(HttpStatus.CREATED)
  async makeProofSpecial(@ReqUser() user: RequestUser, @Body() data: ProofSpecialDto) {
    return await this.proofService.makeProofSpecial(user, data)
  }

  @Put('proofs/:id/internal')
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateProofInternal(@Param() { id }: UUIDParam, @ReqUser() user: RequestUser, @Body() data: ProofInternalDto) {
    return await this.proofService.editProofInternal(id, user, data)
  }

  @Put('proofs/:id/external')
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateProofExternal(@Param() { id }: UUIDParam, @ReqUser() user: RequestUser, @Body() data: ProofExternalDto) {
    return await this.proofService.editProofExternal(id, user, data)
  }

  @Put('proofs/:id/special')
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateProofSpecial(@Param() { id }: UUIDParam, @ReqUser() user: RequestUser, @Body() data: ProofSpecialDto) {
    return await this.proofService.editProofSpecial(id, user, data)
  }

  @Delete('proofs/:id')
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeStudent(@Param() { id }: UUIDParam) {
    return await this.proofService.delete(id)
  }

  @Put('proofs/:id/approve')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async approveProof(@Param() { id }: UUIDParam) {
    return await this.proofService.approve(id)
  }

  @Put('proofs/:id/reject')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async rejectProof(@Param() { id }: UUIDParam, @Body() data: RejectProofDto) {
    return await this.proofService.reject(id, data)
  }
}
