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
