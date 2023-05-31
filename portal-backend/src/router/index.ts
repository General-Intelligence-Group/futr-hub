import { Router, Request, Response } from 'express'
import KeyCloak from '../service/keyCloak/index'
import FileGenerator from '../service/fileGenerator/index'
import Log from '../service/log'

const router = Router();
router.get('/', (req: Request, res: Response) => {
  Log.trace(req.headers);
  res.send("Up and running.");
});

// Temporary/Testing
router.get('/login', async (req: Request, res: Response) => {
  const testMode = process.env.TEST_MODE?.toUpperCase() === "TRUE" || parseInt(process.env.TEST_MODE || '') === 1
  if(testMode) {
    const result = await new KeyCloak().login()
    Log.trace(req.headers);
    res.send(result?.data);
  } else {
    res.send("Login only allowed in test mode.");
  }
});

router.get('/services-internet.json', async (req: Request, res: Response) => {
  const inputFileName = process.env.SERVICE_INTERNET_INPUT_FILE || ''
  Log.trace(req.headers);
  const response = await new FileGenerator(req, res).generateServiceFile(inputFileName)
  res.json(response)
});

router.get('/rest-services-internet.json', async (req: Request, res: Response) => {
  const inputFileName = process.env.REST_SERVICES_INTERNET_INPUT_FILE || ''
  Log.trace(req.headers);
  const response = await new FileGenerator(req, res).generateServiceFile(inputFileName)
  res.json(response)
});

router.get('/config.json', async (req: Request, res: Response) => {
  const internetServiceInputFileName = process.env.SERVICE_INTERNET_INPUT_FILE || ''
  const configInputFileName = process.env.CONFIG_INPUT_FILE || ''
  Log.trace(req.headers);
  const response = await new FileGenerator(req, res).generateConfigFile(internetServiceInputFileName, configInputFileName)
  res.json(response)
});

export { router }