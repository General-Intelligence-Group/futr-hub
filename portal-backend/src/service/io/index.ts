import fs from 'fs/promises'
import fileSystem from 'fs'
import path from 'node:path'
import Log from '../../service/log'

/**
 * @class Io
 * @author Omar Abdo
 * 
 * @description
 * A simple class with generic methods that utilizes nodeJs's built-in file system to read and write json files
 */

export default class Io {

  async readFileName<T>(inputFileName: string): Promise<T> {
    const inputFilePath = process.cwd() + path.sep + process.env.INPUT_FILE_PATH + path.sep
    const fileLocation = inputFilePath + inputFileName + process.env.INPUT_FILES_EXTENTION
    return await this.readFileFromLocation<T>(fileLocation)
  }

  async readFileFromLocation<T>(fileLocation: string): Promise<T> {
    try {
      const fileContent: string = await fs.readFile(fileLocation, { encoding: 'utf8' });
      return JSON.parse(fileContent)
    } catch (error) {
      Log.error('An error ocurred while reading source file')
      Log.debug(error)
      throw new Error('Could not read ' + fileLocation)
    }
  }

  async writeFile(outputFileName: string, payload: any): Promise<string> {
    const payloadString = JSON.stringify(payload)
    const outputFilePath = process.cwd() + path.sep + process.env.OUTPUT_FILE_PATH + path.sep
    const fileLocation = outputFilePath + outputFileName + process.env.OUTPUT_FILES_EXTENTION
    if (!fileSystem.existsSync(outputFilePath)) {
      fs.mkdir(outputFilePath)
    }
    await fs.writeFile(fileLocation, payloadString);
    return fileLocation;
  }
}