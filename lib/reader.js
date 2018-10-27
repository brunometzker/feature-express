let fs = require('fs');
let path = require('path');
let glob = require('glob');

let files = (featuresPath) => {
  return new Promise((resolve, reject) => {
    glob(featuresPath + '**/*.feature', { absolute: true }, (err, files) => { 
      if(files == null) reject(err);
      resolve(files);
    });    
  });
}

extractPath = (file) => {
  return path.parse(file).dir;
}

extractName = (file) => {
  return path.parse(file).name;
}

let formatedFeatures = (arrayOfFeaturesFiles) => {
  var model = {};

  arrayOfFeaturesFiles.forEach(featureFile => {
    let featureFilePath = extractPath(featureFile);
    let featureFileName = extractName(featureFile);

    if(model.hasOwnProperty(featureFilePath)) {
      model[featureFilePath][featureFileName] = []; 
    } else {
      model[featureFilePath] = [];
      model[featureFilePath][featureFileName] = [];
    }

    fs.readFileSync(featureFile, 'utf8').toString().split('\n').forEach((line, index, arr) => {
      if (!line.includes("language:")) {
        model[featureFilePath][featureFileName].push(line);
      }
    });
  })

  return new Promise((resolve, reject) => resolve(model));
}

let generateHashOfFilesByPath = (path) => {
  return files(path)
        .then(arrayOfFeatureFiles => formatedFeatures(arrayOfFeatureFiles))
        .then(contentFeature => {
          return contentFeature
        })
        .catch(err => console.log(err));
}

module.exports = {
  files: files,
  formatedFeatures: formatedFeatures,
  generateHashOfFilesByPath: generateHashOfFilesByPath
};