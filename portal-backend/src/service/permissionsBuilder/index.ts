import { Permission } from '../../types/permission'


/**
 * @class KeyCloak
 * @author Omar Abdo
 * 
 * @description
 * A sub class for the serviceFile class that contains the logic for filtering the permissions
 */

export default class PermissionsBuilder {

  buildPermissions(keyCloakPermissions: string[], configFilePermissions: Permission[]) : Permission[] {
    const permissionsSubSet : Permission[] = []
    for (const permission of configFilePermissions) {
      if(!permission.roles) {
        // permissionsSubSet.push(permission)
        continue
      }
      const permissionsIntersects = permission.roles.some(element => {
        return keyCloakPermissions.includes(element);
      });
      if(permissionsIntersects) {
        delete permission.roles
        permissionsSubSet.push(permission)
      }      
    }
    return permissionsSubSet
  }

}