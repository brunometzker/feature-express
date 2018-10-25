let fs = require('fs');
let path = require('path');
let glob = require('glob');

let files = (featuresPath) => {
  return new Promise((resolve, reject) => {
    try {
      glob(featuresPath + '**/*.feature', (err, files) => {
        console.log(files);
        resolve(files);
      });
    } catch (error) {
      reject(error)
    }
  });
}

isFeature = (fileName) => {
  return path.extname(fileName) === '.feature'
}

let filterFeatureFiles = (arrayOfFiles) => {
  return new Promise((resolve, reject) => resolve(arrayOfFiles.filter(isFeature)));
};

let formatedFeatures = (arrayOfFeaturesFiles) => {
  var contentFeature = {};
  arrayOfFeaturesFiles.forEach(fileFeature => {
    contentFeature[fileFeature] = [];
    fs.readFileSync(fileFeature, 'utf8').toString().split('\n').forEach((line, index, arr) => {
      if (!line.includes("language:")) {
        contentFeature[fileFeature].push(line);
      }
    });
  })

  console.log(contentFeature);
  return new Promise((resolve, reject) => resolve(contentFeature));
}

let generateHashOfFilesByPath = (path) => {
  return files(path).then(arrayOfFiles => filterFeatureFiles(arrayOfFiles))
    .then(arrayOfFeatureFiles => formatedFeatures(arrayOfFeatureFiles))
    .then(contentFeature => {
      return contentFeature
    })
    .catch(err => console.log(err));
}

module.exports = {
  files: files,
  filterFeatureFiles: filterFeatureFiles,
  formatedFeatures: formatedFeatures,
  generateHashOfFilesByPath: generateHashOfFilesByPath,
  isFeature: isFeature
};