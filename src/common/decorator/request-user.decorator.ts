import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const ReqUser = createParamDecorator((propKey: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return propKey ? request.user[propKey] : request.user
})
