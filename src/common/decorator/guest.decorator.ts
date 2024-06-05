import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'Guest'
export const GuestRoute = () => SetMetadata(IS_PUBLIC_KEY, true)
