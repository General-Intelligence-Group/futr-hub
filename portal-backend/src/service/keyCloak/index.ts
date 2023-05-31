import axios from "axios";
import qs from "qs"
import jwt_decode from "jwt-decode";
import { DecodedToken } from '../../types/token'
import Log from '../log'

/**
 * @class KeyCloak
 * @author Omar Abdo
 * 
 * @description
 * This class reaches out to Key cloak to check if the provided JTW is still valid, and if so decodes it and 
 * returns the decoded version
 * 
 * The login function is being used currently only for testing 
 */

export default class KeyCloak {
  constructor() {

  }

  // NOTE no need to type the response of this function since it's a temporary one
  async login() {
    const URL = process.env.KEYCLOAK_HOST+'/auth/realms/'+ process.env.KEYCLOAK_REALM +'/protocol/openid-connect/token'
    const configurations = qs.stringify({
      grant_type: process.env.KEYCLOAK_GRANT_TYPE,
      client_id: process.env.KEYCLOAK_CLIENT_ID,
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
      username: process.env.KEYCLOAK_USERNAME,
      password: process.env.KEYCLOAK_PASSWORD
    })

    Log.trace(configurations)
    
    const result = await axios({
      method: 'POST',
      url: URL,
      data: configurations,
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      withCredentials: true,
    }).catch(reason => {
      Log.error("Code:", reason.response.status, reason.response.statusText,
              "| Error:", reason.response.data.error, "-", reason.response.data.error_description);
    });

    if(result) Log.trace(result)

    return result
  }

  async decodeToken(token: string) : Promise<DecodedToken> {
    const URL = process.env.KEYCLOAK_HOST+'/auth/realms/'+ process.env.KEYCLOAK_REALM +'/protocol/openid-connect/userinfo'

    try {
      await axios({
        method: 'GET',
        url: URL,
        headers: { Authorization: 'Bearer ' + token }
      })  
    } catch (error) {
      Log.error('An error ocurred while decoding the authentication token')
      Log.debug(error)
    }

    const decodedToken : DecodedToken = jwt_decode(token)

    Log.trace(decodedToken)

    return decodedToken
  }
}

