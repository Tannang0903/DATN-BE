import { BadRequestException, Injectable } from '@nestjs/common'
import { v2 } from 'cloudinary'
import toStream = require('buffer-to-stream')
import { CloudinaryResponse, Document } from '@common/types'

@Injectable()
export class CloudinaryService {
  uploadImages = async (files: Express.Multer.File[]): Promise<Document[]> => {
    const uploadFiles = (await Promise.all([
      ...files.map(async (file) => {
        return new Promise((resolve, reject) => {
          const upload = v2.uploader.upload_stream({ filename_override: file.originalname }, (error, result) => {
            if (error) return reject(error)
            resolve(result)
          })

          toStream(file.buffer).pipe(upload)
        }).catch((error) => {
          console.error(error)
          throw new BadRequestException('Cant upload file', error)
        })
      })
    ])) as CloudinaryResponse[]

    return uploadFiles.map((file) => ({
      fileUrl: file.url,
      fileName: file.original_filename
    }))
  }
}
