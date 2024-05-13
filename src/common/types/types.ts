import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'

export type JwtPayload = {
  sub: string
  username: string
}

export type RequestUser = {
  id: string
  name: string
  session: string
  roles: string[]
}

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse

export type Document = {
  fileUrl: string
  fileName: string
}
