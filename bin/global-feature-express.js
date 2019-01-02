#!/usr/bin/env node
const express = require('express');
const reader = require('../lib/reader.js');
const localeHandler = require("../lib/locale-handler");
const path = require('path');

const app = express();
const featurebookEndPoint = '/';
const envPath = process.argv[2] || path.join(__dirname, '..', '/test/features-example');
const language = localeHandler.getValidLanguage(process.argv[3] || process.env.LANG);
const port = process.argv[4] == null ? 3000 :  process.argv[4];
const jiraUrlBase = process.argv[5] || null;
const boardAcronym = process.argv[6] || null;

app.use(express.static(path.join(__dirname, '..', 'assets')));
app.set('views', path.join(__dirname, '..', 'views'));
app.engine('html', require('ejs').renderFile);

app.get(featurebookEndPoint , (req, res) => {
  try {
    let rootFolder = reader.getFiles(envPath);
    let featureFiles = [];
    res.render('index.html', { rootFolder, language, jiraUrlBase, boardAcronym, featureFiles });
  } catch(error) {
    console.error(error);
    res.render('error-page.html', {err: 'Unable to find feature files directory!'});
  }
});

app.listen(port);

console.log("Feature-Express is running at "+"http://localhost:"+port+featurebookEndPoint);

module.exports = app;