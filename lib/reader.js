let fs = require('fs');
let path = require('path');
let _ = require('lodash');

var model = {};
var fromPath = "";

let readDirContents = (dirPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (error, files) => {
      if(files !== undefined) {
        files.forEach((file, index, arr) => {
          arr[index] = dirPath + file;
        });

        resolve(files);
      }
      else reject(error);
    });  
  });
}

let readFileContents = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (error, data) => {
      if(data !== undefined) resolve(data);
      else reject(error);
    });
  });
}

getRelativePath = (file) => {
  return path.parse(file).dir.replace(fromPath, '') + path.sep + path.parse(file).name;
}

getAbsolutePath = (file) => {
  return path.parse(file).dir + path.sep + path.parse(file).base;
}

toDotNotationPath = (filePath) => {
  let dotNotationPath = filePath.replace(/\\\\|\//g, '.');
  return (dotNotationPath.match(/^[\.|\/]/)) ? dotNotationPath.substr(1) : dotNotationPath;
}

isDirectory = (file) => {
  return fs.statSync(file).isDirectory();
}

isFeature = (file) => {
  return path.parse(file).ext === 'feature'
}

let scanFilesRecursively = (filePath) => {
  let objPath = toDotNotationPath(getRelativePath(filePath));
  
  console.log(model);

  if(isDirectory(filePath)) {
    _.set(model, objPath, []);

    readDirContents(filePath).then((files) => {
      files.forEach((file) => {
        scanFilesRecursively(getAbsolutePath(file));
      });
    }).catch((error) => { console.log(error) });
  } else {
    _.set(model, objPath, []);
  
    console.log(filePath);
    readFileContents(filePath).then((content) => {
      content.toString().split('\n').forEach((line) => {
        if (!line.includes("language:")) {
          _.get(model, objPath).push(line);
        }
      });
    }).catch((error) => { console.log(error) })
  }
}

let generateHashOfFilesByPath = (filePath) => {
  fromPath = filePath;
  scanFilesRecursively(fromPath);
  return model;
}

module.exports = {
  generateHashOfFilesByPath: generateHashOfFilesByPath
};

/**
 * /feature-examples/feature.feature
 * /feature-examples/folder1/feature.feature
 * /feature-examples/folder1/folder1-1/feature.feature
 * /feature-examples/folder2/feature.feature
 *  
 * feature-examples: [
 *     feature: [],
 *     folder1: [
 *         feature: [],
 *         folder1-1: [
 *             feature: []
 *         ]
 *     ],
 *     folder2: [
 *         feature: []
 *     ]
 * ]
 * 
 */