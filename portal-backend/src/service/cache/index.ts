import { Request, Response } from 'express'

/**
 * @class Cache
 * @author Omar Abdo
 * 
 * @description
 * A small class uses node-cache library (injected into the this.cacheLayer property) to caches decoded key cloak
 * tokens and their generated files to avoid re-generating the permissions and configurations every time the same
 * user consumes the APIs 
 */
export default class Cache {
  private cacheLayer

  constructor(req: Request) {
    this.cacheLayer = req.app.get('cacheLayer')
  }

  get(cacheKey: string) {
    const cachedFile = this.cacheLayer.get(cacheKey)
    return cachedFile? cachedFile : undefined
  }

  set(cacheKey: string, fileLocation: string) : void {
    this.cacheLayer.set(cacheKey, { fileLocation: fileLocation }, 0)
  }
}