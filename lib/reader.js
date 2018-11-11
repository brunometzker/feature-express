let fs = require('fs');
let path = require('path');
let _ = require('lodash');

var model = {};

let readDirContents = (dirPath) => {
  if(!dirPath.match(/\/$/)) dirPath += '/';
  
  let files = fs.readdirSync(dirPath);
  
  files.forEach((file, index, arr) => {
    arr[index] = dirPath + file;
  });
  
  return files;
}

let readFileContents = (filePath) => {
  return fs.readFileSync(filePath, { encoding: "utf-8"});
}

getRelativePath = (fromPath, filePath) => {
  return (filePath === fromPath) ? path.parse(filePath).name : path.parse(fromPath).name + path.sep + filePath.replace(fromPath, '');
}

getAbsolutePath = (file) => {
  return path.parse(file).dir + path.sep + path.parse(file).base;
}

toDotNotationPath = (filePath) => {
  let dotNotationPath = filePath.replace(/\.\w+/, '').replace(/\\\\|\//g, '.');
  return (dotNotationPath.match(/^[\.|\/]/)) ? dotNotationPath.substr(1) : dotNotationPath;
}

isDirectory = (file) => {
  return fs.statSync(file).isDirectory();
}


let scanFilesRecursively = (filePath) => {
  let objPath = toDotNotationPath(getRelativePath(process.argv[2], filePath));
  
  console.log(model);

  if(isDirectory(filePath)) {
    _.set(model, objPath, {});

    readDirContents(filePath).forEach((file) => {
        scanFilesRecursively(getAbsolutePath(file));
    });
  } else {
    _.set(model, objPath, []);
  
    console.log(filePath);
    readFileContents(filePath).split('\n').forEach((line) => {
        if (!line.includes("language:")) {
          _.get(model, objPath).push(line);
        }
    });
  }
}

let generateHashOfFilesByPath = (filePath) => {
  scanFilesRecursively(filePath);
  console.log(model);
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