import dotenv from 'dotenv'
import express from 'express'
import NodeCache from 'node-cache';
import {router} from './router'
import Log from './service/log'

dotenv.config();

const app = express()

const cacheLayer = new NodeCache({ stdTTL: 0, checkperiod: 0 });
app.set('cacheLayer', cacheLayer)
const port = process.env.PORT

// used to retrieve token from cookie
var cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(router)

app.listen(port, () => {
  Log.info('listening on ' + port);
})