let fs = require('fs');
let path = require('path');
let _ = require('lodash');

const MODEL = {};

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

isFeature = (file) => {
  return path.parse(file).ext === '.feature';
}

let scanFilesRecursively = (fromPath) => {
  let objPath = toDotNotationPath(getRelativePath(process.argv[2], fromPath));

  if(isDirectory(fromPath)) {
    _.set(MODEL, objPath, {});

    readDirContents(fromPath).forEach((file) => {  
      scanFilesRecursively(getAbsolutePath(file));
    });
  } else {
    if(isFeature(fromPath)) {
      _.set(MODEL, objPath, []);
  
      readFileContents(fromPath).split('\n').forEach((line) => {
          if (!line.includes("language:")) {
            _.get(MODEL, objPath).push(line);
          }
      });
    }
  }
}

let buildModel = (fromPath) => {
  scanFilesRecursively(fromPath);
  console.log(MODEL);
}

module.exports = {
  MODEL: MODEL,
  buildModel: buildModel
};