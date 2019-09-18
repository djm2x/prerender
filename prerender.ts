// Load zone.js for the server.
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { readFileSync, writeFileSync, existsSync, mkdirSync, mkdir } from 'fs';
import { join } from 'path';

import { enableProdMode } from '@angular/core';
// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { renderModuleFactory } from '@angular/platform-server';

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

// Our index.html we'll use as our template
const distFolder = join(process.cwd(), 'dist', 'browser');
const indexHtml = readFileSync(join(distFolder, 'index.html')).toString();

const ROUTES = [
  '/home',
  '/about',
  '/services'
];
// Iterate each route path
ROUTES.forEach(async route => {
  const html = await renderModuleFactory(AppServerModuleNgFactory, {
    document: indexHtml,
    url: route,
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  });

  const folder = join(distFolder, route);
  mkdirSync(folder);
  writeFileSync(join(folder, 'index.html'), html);
});
