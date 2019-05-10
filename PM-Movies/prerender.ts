import { enableProdMode } from '@angular/core';
import { renderModuleFactory } from '@angular/platform-server';
import * as express from 'express';
import { readFileSync } from 'fs';
import 'reflect-metadata';
import 'zone.js/dist/zone-node';

const { AppServerModuleNgFactory } = require('./dist/PM-Movies-server/main');

enableProdMode();

const app = express();

const indexHtml = readFileSync(__dirname + '/dist/PM-Movies/index.html', 'utf-8').toString();


app.get('*.*', express.static(__dirname + '/dist/PM-Movies', {
  maxAge: '1y'
}));

app.route('*').get((req, res) => {

  renderModuleFactory(AppServerModuleNgFactory, {
    document: indexHtml,
    url: req.url
  })
    .then(html => {
      res.status(200).send(html);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });

});

app.listen(9000, () => {
  console.log(`Angular Universal Node Express server listening on http://localhost:9000`);
});

