import { Request, Response } from 'express'

import Io from '../io/index'
import KeyCloak from '../keyCloak/index'
import ProcessConfigFile from './configFile'
import { ConfigObject } from '../../types/config'
import ProcessServiceFile from './serviceFile';
import { Permission } from '../../types/permission'
import { Dataspace } from '../../types/dataspace'
import Log from '../log'

/**
 * @class FileGenerator
 * @author Omar Abdo
 * 
 * @description
 * the higher-level class for the file generator service. this class provides to the sub classes (configFile & serviceFile)
 * whatever is necessary to build the new json objects and then returns the result as a response to each respective end point
 */

export default class FileGenerator {

  private request: Request
  private response: Response
  private tokenPermissions: string[]|undefined

  constructor(req: Request, res: Response) {
    this.request = req
    this.response = res

    Log.trace("FileGenerator - Constructor")
    Log.trace(this.request.headers);

  }

  async generateConfigFile(internetServiceInputFileName: string, configInputFileName: string) {

    this.tokenPermissions = await this.readRequestTokenPermissions()
    if (this.tokenPermissions === undefined) {
      return { "Error": ["No token provided"] } as ConfigObject;
    }

    const newPermissions = await this.generateServiceFile(internetServiceInputFileName)
    if (newPermissions === undefined) {
      return { "Error": ["Service file could not be generated"] } as ConfigObject;
    }

    // everything is fine :)
    else {
      const newIds = newPermissions.map(newPermission => newPermission.id)
      const fileIoService = new Io()
      const configInputFileContent = await fileIoService.readFileName<ConfigObject>(configInputFileName)
      const filePath = await this.processConfigObject(configInputFileContent, newIds, configInputFileName, this.tokenPermissions)
      const newConfig = await fileIoService.readFileFromLocation<ConfigObject>(filePath);
      return newConfig
    }

  }

  /**
   * Filters the services with the roles  provided by token.
   *
   * @param inputFileName service file
   * @returns service file filtered with permissions
   */
  async generateServiceFile(inputFileName: string) {

    Log.trace("FileGenerator - generateServiceFile")

    // if not defined yet, try to get permissions from token
    if(this.tokenPermissions === undefined) {
      this.tokenPermissions = await this.readRequestTokenPermissions()
    }

    if (this.tokenPermissions) {

      const filePath = await this.processServiceFile(inputFileName, this.tokenPermissions)
      return await new Io().readFileFromLocation<Permission[]>(filePath);

    } else {
      return undefined
    }

  }

  /**
   * Returns a list of roles for the user provided by token in cookie or header.
   *
   * @returns list of roles for user logged in
   */
  private async readRequestTokenPermissions() {
    let token: string | undefined

    Log.trace("FileGenerator - readRequestTokenPermissions")

    const keyCloakService = new KeyCloak()

    // Test mode creates own token by logging in into keycloak
    const testMode = process.env.TEST_MODE?.toUpperCase() === "TRUE" || parseInt(process.env.TEST_MODE || '') === 1
    Log.trace("testMode", testMode)

    // we are logging in to get our own cookie
    if (testMode) {
      Log.debug("DEV MODE, logging in manually")
      Log.debug("Please login manually using /login")
      Log.debug("before you are working in anonymous mode")
      // const mimicRequest = await keyCloakService.login(); // this is temporary
      // token = mimicRequest?.data.access_token
    }

    // we are using the token from header or cookie
    else {
      Log.trace(this.request.headers);

      token = this.extractTokenFromRequest(this.request)
    }

    // token existing?
    if (token) {
      Log.debug("Token retrieved, length:", token?.length)
      Log.trace("Token", token)

      const decodedToken = await keyCloakService.decodeToken(token)
      //return decodedToken.resource_access?.masterportal ? decodedToken.resource_access.masterportal.roles : undefined
      let dataspaces:string[] = []
      for (const dataspace in decodedToken["fiware-services"]) {
        dataspaces.push(dataspace)
      }
      return decodedToken["fiware-services"] ? dataspaces: []
    }

    else {
      Log.trace('Token is not provided');
      return [process.env.PUBLIC_ROLE||"ds_open_data"]
    }


  }

  private async processConfigObject(configObject: ConfigObject, newIds: string[], inputFileName: string, tokenPermissions: string[]): Promise<string> {
    return await new ProcessConfigFile(newIds, this.request, this.response, tokenPermissions).process(configObject, inputFileName)
  }

  private async processServiceFile(inputFileName: string, tokenPermissions: string[]): Promise<string> {
    return await new ProcessServiceFile(this.request, this.response, tokenPermissions).process(inputFileName)
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    const cookieName = process.env.COOKIE_TOKEN_NAME || 'token'
    let cookie = request.cookies[cookieName]
    let header = request.headers['x-auth-request-access-token']

    return cookie || (header as string)?.replace("Bearer ", "") || undefined
  }

}