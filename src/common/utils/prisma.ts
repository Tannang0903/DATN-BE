import { Prisma } from '@prisma/client'

export const searchByMode = (
  search?: string,
  mode: Prisma.QueryMode = Prisma.QueryMode.insensitive
): Prisma.StringFilter | undefined => {
  return search ? { contains: search, mode } : undefined
}
