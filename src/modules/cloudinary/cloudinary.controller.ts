import { Controller, HttpCode, HttpStatus, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CloudinaryService } from './cloudinary.service'
import { FilesInterceptor } from '@nestjs/platform-express'
import { AccessTokenGuard } from 'src/guard'

@ApiTags('Image')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller()
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @Post('images')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files', 5))
  async upload(@UploadedFiles() files: Express.Multer.File[]) {
    return this.cloudinaryService.uploadImages(files)
  }
}
