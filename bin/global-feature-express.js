#!/usr/bin/env node

let express = require('express');
let reader = require('../lib/reader.js');
let app = express();
let featurebookEndPoint = '/';
let envPath = process.argv[2];
let language = process.argv[3] == null ? 'en' : process.argv[3];
let port = process.argv[4] == null ? 3000 :  process.argv[4];

let path = require('path');

app.use(express.static(path.join(__dirname, '..', 'assets')));
app.set('views', path.join(__dirname, '..', 'views'));
app.engine('html', require('ejs').renderFile);

app.get(featurebookEndPoint , (req, res) => {
  try {
    let rootFolder = reader.getFiles(envPath);
    res.render('index.html', { rootFolder, language });
  } catch(error) {
    console.error(error);
    res.render('error-page.html', {err: 'Unable to find feature files directory!'});
  }
});

app.listen(port);

console.log("Feature-Express is running at "+"http://localhost:"+port+featurebookEndPoint);

module.exports = app;