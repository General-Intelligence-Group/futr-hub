export type Token = string

export type DecodedToken = {
  exp: string,
  iat: string,
  jti: string,
  iss: string,
  aud: string[],
  sub: string,
  typ: string,
  azp: string,
  session_state: string,
  "allowed-origins": string[],
  realm_access: {
    roles: string[]
  },
  resource_access : {
    [key: string] : {
      roles: string[]
    }
  },
  "fiware-services": [{
    [name: string] : [content: string[]]
  }]
  scope: string,
  sid: string,
  email_verified: string,
  name: string,
  groups: string[],
  preferred_username: string,
  given_name: string,
  family_name: string,
  email: string
}