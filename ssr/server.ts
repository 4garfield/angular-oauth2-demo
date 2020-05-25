// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import * as qs from 'qs';
import * as NodeCache from 'node-cache';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import isEmpty from 'lodash-es/isEmpty';
import { join } from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 3000;
const DIST_FOLDER = join(process.cwd(), 'dist');
const ACCESS_TOKEN_RESPONSE = 'accessTokenResponse';
const TOKEN_EXPIRES_RESPONSE = 'tokenExpiresResponse';

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../dist/server/main.bundle');

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

function cacheControl(req, res, next) {
  res.header('Cache-Control', 'max-age=60');
  next();
}

// Server static files
app.get('*.*', cacheControl, express.static(join(DIST_FOLDER, 'browser'), { index: false }));

const appCache = new NodeCache();

const checkAccessToken = (req, res, next) => {

  const accessToken = appCache.get(ACCESS_TOKEN_RESPONSE);
  const tokenExpires = appCache.get(TOKEN_EXPIRES_RESPONSE);
  const currentTimeInSecond = Math.floor(Date.now() / 1000);
  if (!isEmpty(accessToken) && tokenExpires && (currentTimeInSecond < tokenExpires)) {
    next();
  } else {
    axios({
      method: 'POST',
      url: process.env.TOKEN_ISSUER,
      data: qs.stringify({
        grant_type: process.env.GRANT_TYPE,
        scope: process.env.SCOPE
      }),
      auth: {
        username: process.env.CLIENT_ID,
        password: process.env.CLIENT_SECRET,
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((response) => {
      if (response.status === 200) {
        const data = response.data;
        appCache.set(ACCESS_TOKEN_RESPONSE, data);
        const decoded = jwt.decode(data['access_token']);
        appCache.set(TOKEN_EXPIRES_RESPONSE, decoded['exp']);

      } else {
        console.log('status: ' + response.status);
      }
      // get token fail or not won't break the route
      next();
    }).catch(function (error) {
      console.error(error);
      next();
    });
  }
};

app.get('/token', checkAccessToken, (req, res) => {
  const accessToken = appCache.get(ACCESS_TOKEN_RESPONSE);
  if (!isEmpty(accessToken)) {
    res.json(accessToken);
  } else {
    res.status(500).send({ msg: 'server error' });
  }
});

app.get('*', cacheControl, checkAccessToken, (req, res) => {
  console.time(`GET: ${req.originalUrl}`);

  let accessToken = appCache.get(ACCESS_TOKEN_RESPONSE);
  if (!isEmpty(accessToken)) {
    accessToken = accessToken['access_token'];
  }
  res.render('index', {
    req: req,
    res: res,
    time: true,    // use this to determine what part of your app is slow, only in development
    providers: [{
      provide: 'accessTokenInSSr', useValue: accessToken
    }]
  });

  console.timeEnd(`GET: ${req.originalUrl}`);
});

// catch 404
app.use(function (req, res, next) {
  res.status(404);
  res.json({ msg: 'Request Resource Not Found' });
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ msg: err.message });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('closing server...');
  appCache.close();
  process.exit();
});
