import { Prisma } from '@prisma/client'

export type getUsersPayload = Prisma.IdentityUserGetPayload<{
  select: {
    id: true
    username: true
    email: true
    hashedPassword: true
    roles: {
      select: {
        IdentityRole: {
          select: {
            name: true
          }
        }
      }
    }
  }
}>
