import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid';

import { 
  Hintergrundkarten, 
  Fachdaten_3D, 
  Fachdaten,
  ConfigObject, 
  ToolChildren,
  Tool,
  PortalConfig,
  DatenObject,
  Ordner,
  Layer
} from '../../types/config'
import Io from '../io/index'
import Cache from '../cache/index'
import Log from '../../service/log'

/**
 * @class ProcessConfigObject
 * @author Omar Abdo, Andreas Linneweber
 *  
 * @description 
 * this class is supposed to go through the tree-like structure of the config file 
 * until it reaches the leaves of the tree. If the Id of the leaf doesn't exist in the list of ID 
 * provided to the constructor (which is a list of IDs coming from the new service-internet file)
 * then the leaf should be deleted, if all leaves are deleted, then the parent node should be deleted as well.
 * 
 * However, the structure provided has is not a tree, under the root node there are 3 objects, that should be 
 * all considered children, under each one of them the structure vary from the other one. as demonstrated below
 * 
 * Themenconfig is the root node, under which we have Hintergrundkarten, Fachdaten_3D, and Fachdaten
 * Hintergrundkarten structure has the following cases 
 * #1 Hintergrundkarten.Ordner[].layer[]
 * #2 Hintergrundkarten.Ordner[].layer[].children[]
 * 
 * As of Fachdaten_3D, it is 
 * #1 Fachdaten_3D.layer[]
 * 
 * Finally Fachdaten structure has 3 cases
 * #1 Fachdaten.Ordner[].layer[]
 * #2 Fachdaten.Ordner[].Ordner[].layer[]
 * #3 Fachdaten.Ordner[].Ordner[].layer[].children
 *  
 * The class below manually reaches out to each end of the tree and deletes the leaves based on 
 * the mentioned logic.
 */

export default class ProcessConfigFile {
  private newIds : string[] = []
  private request: Request
  private response: Response
  private tokenAllowedPermissions: string[]

  constructor(newIds: string[], req: Request, res: Response, tokenAllowedPermissions: string[]) {
    this.newIds = newIds
    this.request = req
    this.response = res
    this.tokenAllowedPermissions = tokenAllowedPermissions
  }

  async process(configObject: ConfigObject, inputFileName: string, permissionsString?: string) : Promise<string> {
    const themenConfig = configObject.Themenconfig
    var portalConfig = configObject.Portalconfig
    const fileIoService = new Io()
    const outputFileUniqueId = uuidv4()
    const outputFileName = inputFileName + '-' + outputFileUniqueId
    const allowedPermissionsString = this.tokenAllowedPermissions.toString() + inputFileName
    const cacheLayer = new Cache(this.request)
    let newConfigFile = ''
    try {
      if (!cacheLayer.get(allowedPermissionsString)) {
        if(themenConfig?.Hintergrundkarten) {
          themenConfig.Hintergrundkarten = this.filterHinterGrundKarten(themenConfig.Hintergrundkarten)
        }
        if(themenConfig?.Fachdaten_3D) {
          themenConfig.Fachdaten_3D = this.filterFachDaten3d(themenConfig.Fachdaten_3D)
        }
        if(themenConfig?.Fachdaten) {
          themenConfig.Fachdaten = this.filterFachDaten(themenConfig.Fachdaten)
        }
        if(portalConfig) {
          portalConfig = this.filterPortalConfig(portalConfig)
        }
        newConfigFile = await fileIoService.writeFile(outputFileName, configObject)
        cacheLayer.set(allowedPermissionsString, newConfigFile) 
      } else {
        newConfigFile = cacheLayer.get(allowedPermissionsString).fileLocation
      }
    } catch (error) {
      Log.error('An error ocurred while generating the new configurations')
      Log.debug(error)
    }
    return newConfigFile
  }

  private filterHinterGrundKarten(hintergrundkarten: DatenObject) : DatenObject {
    return this.filterDatenObject(hintergrundkarten)
    // var newHintergrundkarten = {} as Hintergrundkarten
    // newHintergrundkarten = { Ordner: [] }
    // for (const singleOrdner of hintergrundkarten.Ordner) {
    //   if(!singleOrdner.Layer) {
    //     continue
    //   }
    //   const newLayers = []
    //   for (const singleLayer of singleOrdner.Layer) {
    //     if(singleLayer.children) {
    //       singleLayer.children =  singleLayer.children.filter(item => this.newIds.includes(item.id)) // case two
    //       singleLayer.children.length === 0 ? delete singleLayer.children : null
    //       newLayers.push(singleLayer)
    //     }
    //   }
    //   newLayers.push(...singleOrdner.Layer.filter(item => !item.children && this.newIds.includes(item.id)))
    //   singleOrdner.Layer = newLayers // case one
    //   singleOrdner.Layer.length === 0 ? delete singleOrdner.Layer : newHintergrundkarten.Ordner.push(singleOrdner)
    // }
    // return newHintergrundkarten
  }

  private filterFachDaten3d(fachdaten_3D: DatenObject) : DatenObject {
    return this.filterDatenObject(fachdaten_3D)

    // const emptyFachDaten_3D = {} as Fachdaten_3D
    // fachdaten_3D.Layer = fachdaten_3D.Layer.filter(item => this.newIds.includes(item.id))
    // return fachdaten_3D.Layer.length > 0 ? fachdaten_3D : emptyFachDaten_3D
  }

  private filterFachDaten(fachdaten : DatenObject) : DatenObject {
    return this.filterDatenObject(fachdaten)

    // if (fachdaten.Ordner) {
    //   const localFachdaten = JSON.parse(JSON.stringify(fachdaten))
    //   for (const localOrdner of localFachdaten.Ordner) {
    //     var ordner = fachdaten.Ordner[fachdaten.Ordner.findIndex(item => item.Titel === localOrdner.Titel)]
    //     if(ordner.Ordner) {
    //       for (const subOrdner of ordner.Ordner) {
    //         if(!subOrdner.Layer) {
    //           continue
    //         }
    //         for (const layer of subOrdner.Layer) {
    //           if(layer.children) {  
    //             const newChildren = layer.children.filter(item => this.newIds.includes(item.id)) // case three                  
    //             newChildren.length > 0 ? layer.children = newChildren : delete layer.children
    //           }
    //         }        
    //         const newLayers = subOrdner.Layer.filter(item => item.children || !item.children && this.newIds.includes(item.id)) // case two
    //         //newLayers.length > 0 ? subOrdner.Layer = newLayers : delete subOrdner.Layer
    //         newLayers.length === 0 ? ordner.Ordner.splice(ordner.Ordner.findIndex(item => item.Titel === subOrdner.Titel),1) : subOrdner.Layer = newLayers
    //       }
    //       if (ordner.Ordner.length === 0) {
    //         delete ordner.Ordner
    //       }
    //     }
    //     if(ordner.Layer) {
    //       // case one
    //       for (const layer of ordner.Layer) {
    //         if(layer.children) {  
    //           const newChildren = layer.children.filter(item => this.newIds.includes(item.id)) // case three                  
    //           newChildren.length > 0 ? layer.children = newChildren : delete layer.children
    //         }
    //       } 
    //       const newLayers = ordner.Layer.filter(item => item.children || !item.children && this.newIds.includes(item.id)) 
    //       //newLayers.length > 0 ? ordner.Layer = newLayers : delete ordner.Layer
    //       newLayers.length === 0 ? fachdaten.Ordner.splice(fachdaten.Ordner.findIndex(item => item.Titel === ordner.Titel),1) : fachdaten.Ordner[fachdaten.Ordner.findIndex(item => item.Titel === ordner.Titel)].Layer = newLayers
    //     }      
    //   }
    //   return fachdaten
    // } else {
    //   return fachdaten
    // }

  }



  private filterDatenObject(datenObject : DatenObject) : DatenObject {
    const copyOfDatenObject = JSON.parse(JSON.stringify(datenObject))
    // Loop over deep copy of object to identify objects
    if (copyOfDatenObject.Ordner && datenObject.Ordner){
      for (const myOrdner of copyOfDatenObject.Ordner) {
        // get a reference to the original object to be deleted, if needed
        var ordnerObject = datenObject.Ordner[datenObject.Ordner.findIndex(item => item.Titel === myOrdner.Titel)]
        var ordnerLength: number = 0
        var layerLength: number = 0
        // Check for subfolders
        if (ordnerObject.Ordner) {
          // Proceed recursive
          ordnerObject = this.filterFolder(ordnerObject)
          if (ordnerObject.Ordner) {
            ordnerLength = ordnerObject.Ordner.length
          }
        }
        if (ordnerObject.Layer) {
          // Proceed recursive
          ordnerObject.Layer = this.filterLayer(ordnerObject.Layer)
          if (ordnerObject.Layer) {
            layerLength = ordnerObject.Layer.length
          }
        }
        if (ordnerLength === 0 && layerLength === 0) {
          datenObject.Ordner.splice(datenObject.Ordner.findIndex(item => item.Titel === myOrdner.Titel),1)
        }
      }
    }
    if (copyOfDatenObject.Layer && datenObject.Layer){  
      // for (const myLayer of copyOfDatenObject.Layer) {
      //   // get a reference to the original object to be deleted, if needed
      //   var layerObject = datenObject.Layer[datenObject.Layer.findIndex(item => item.id === myLayer.id)]
      //   // Check for subfolders
      //   if (layerObject.Layer) {
      //     // Proceed recursive
      //     layerObject.Layer = this.filterLayer(layerObject.Layer)
      //     if (layerObject.Layer && layerObject.Layer.length === 0) {
      //       // delete layerObject.Layer
      //       datenObject.Layer.splice(datenObject.Layer.findIndex(item => item.id === myLayer.id),1)
      //     }
      //   }     
      // }
      datenObject.Layer = this.filterLayer(datenObject.Layer)
      if (datenObject.Layer && datenObject.Layer.length === 0) {
        delete datenObject.Layer
        
      }

    }
    return datenObject
  }

  private filterFolder(ordnerObject: Ordner): Ordner {
    const copyOfOrdnerObject = JSON.parse(JSON.stringify(ordnerObject))
    
    if (copyOfOrdnerObject.Ordner && ordnerObject.Ordner){
      for (const myOrdner of copyOfOrdnerObject.Ordner) {
        // get a reference to the original object to be deleted, if needed
        if (ordnerObject.Ordner) {
          // Subfolders
          var myOrdnerObject = ordnerObject.Ordner[ordnerObject.Ordner.findIndex(item => item.Titel === myOrdner.Titel)]
          // Check for subfolders
          if (myOrdnerObject.Ordner) {
            // Proceed recursive
            myOrdnerObject = this.filterFolder(myOrdnerObject)
            // Check if Content is existing
            if (myOrdnerObject.Ordner && myOrdnerObject.Ordner.length === 0) {
              // If all were delete, delete Object in return Object
              delete ordnerObject.Ordner
            }
          }
        }          
        if (myOrdner.Layer) {
          if (!myOrdner.id){
            // Layers in Folder
            if (ordnerObject.Ordner) {
              var myOrdnerObject = ordnerObject.Ordner[ordnerObject.Ordner.findIndex(item => item.Titel === myOrdner.Titel)]
              // Proceed recursive
              myOrdner.Layer = this.filterLayer(myOrdner.Layer)
              if (myOrdner.Layer && myOrdner.Layer.length === 0) {
                // No Layers to publish, remove full object
                ordnerObject.Ordner.splice(ordnerObject.Ordner.findIndex(item => item.Titel === myOrdner.Titel),1)
              } else if (myOrdner.Layer && !(myOrdner.Layer.length === 0)) {
                // Layers remaining, update object
                ordnerObject.Ordner[ordnerObject.Ordner.findIndex(item => item.Titel === myOrdner.Titel)] = myOrdner
              }
            }
          }
        }
      }
    }
    return ordnerObject
  }

  private filterLayer(layerObject: Layer[]): Layer[] {
    for (const myLayer of layerObject) {
      if(myLayer.children) {  
        // Keep all Layers with IDs in Items to keep
        const myChildren = myLayer.children.filter(item => this.newIds.includes(item.id))        
        myChildren.length > 0 ? myLayer.children = myChildren : delete myLayer.children
      }
    }
    // Keep all Layers with already checked childen or IDs in Items to keep
    const myLayers = layerObject.filter(item => item.children || !item.children && this.newIds.includes(item.id)) 
    return myLayers
  }


  private filterPortalConfig(portalConfig: PortalConfig) : PortalConfig {
    // First Filter Filter
    // Check if roles match
    if (portalConfig.menu?.filter) {
      if (!portalConfig.menu?.filter.roles?.some(element => { return this.tokenAllowedPermissions.includes(element)}) ) {
        // No matching, delete filter from config
        delete portalConfig.menu.filter
      } else {
        if (portalConfig.menu.filter.roles) {
          delete portalConfig.menu.filter.roles
        }
      }
    }

    // Check and filter Tools
    if (portalConfig.menu?.tools?.children) {
      for (const toolKey of Object.keys(portalConfig.menu.tools.children)){
        const tool: Tool = portalConfig.menu.tools.children[toolKey]
        if (!tool.roles?.some(element => { return this.tokenAllowedPermissions.includes(element)}) ) {
          delete portalConfig.menu.tools.children[toolKey]
        } else {
          if (tool.roles?.length >= 0) {
            delete tool.roles
          }
        }
      }
    }
    return portalConfig 
  }
}