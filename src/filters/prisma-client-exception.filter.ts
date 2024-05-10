import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { Prisma } from '@prisma/client'
import { Response } from 'express'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const message = exception.message.replace(/\n/g, '')

    switch (exception.code) {
      case 'P2025': {
        return response.status(404).json({
          success: false,
          code: 404,
          errorId: HttpStatus[404],
          message: 'Not found',
          error: message,
          timestamp: new Date().getTime(),
          path: request.url
        })
      }
      case 'P2002': {
        return response.status(400).json({
          success: false,
          code: 400,
          errorId: HttpStatus[400],
          message: `The ${exception.meta.target[0]} is unique`,
          error: message,
          timestamp: new Date().getTime(),
          path: request.url
        })
      }
      default:
        super.catch(exception, host)
        break
    }
  }
}
