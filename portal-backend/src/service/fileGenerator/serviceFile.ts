import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid';

import Io from '../io/index'
import PermissionsBuilder from '../permissionsBuilder/index'
import { Permission } from '../../types/permission'
import Cache from '../cache/index'
import Log from '../../service/log';

/**
 * @class ProcessServiceFile
 * @author Omar Abdo
 * 
 * @description
 * This class is used to build both the rest-services-internet and the services-internet files.
 * since both files have the same filtration logic this code below works perfectly fine
 * without adding generics
 */

export default class ProcessServiceFile {
  private request: Request
  private response: Response
  private tokenAllowedPermissions: string[]

  constructor(req: Request, res: Response, tokenAllowedPermissions: string[]) {
    this.request = req
    this.response = res
    this.tokenAllowedPermissions = tokenAllowedPermissions
  }

  async process(inputFileName: string) : Promise<string> {
    const fileIoService = new Io()
    const outputFileUniqueId = uuidv4()
    const outputFileName = inputFileName + '-' + outputFileUniqueId

    let newPermissionsFile = ''

    const allowedPermissionsString = this.tokenAllowedPermissions.toString() + inputFileName
    const cacheLayer = new Cache(this.request)

    // not in cache?
    if (!cacheLayer.get(allowedPermissionsString)) {
      const fullPermissionsList = await fileIoService.readFileName<Permission[]>(inputFileName);
      const permissionsSubset = new PermissionsBuilder().buildPermissions(this.tokenAllowedPermissions, fullPermissionsList);
      newPermissionsFile = await fileIoService.writeFile(outputFileName, permissionsSubset);
      cacheLayer.set(allowedPermissionsString, newPermissionsFile)
    }

    // already in cache
    else {
      newPermissionsFile = cacheLayer.get(allowedPermissionsString).fileLocation
    }

    return newPermissionsFile
  }
}