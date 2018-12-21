let fs = require('fs');
let path = require('path');

class File {
  constructor(absolutePath, isDirectory = false, content = []) {
    this._absolutePath = absolutePath;
    this._isDirectory = isDirectory;
    this._content = content;
    this._name = path.parse(this._absolutePath).name;
  }

  get absolutePath() {
    return this._absolutePath;
  }

  get name() {
    return this._name;
  }

  get content() {
    return this._content;
  }

  get isDirectory() {
    return this._isDirectory;
  }

  set isDirectory(isDirectory) {
    this._isDirectory = isDirectory;
  }
}

readDirContents = (dirPath) => {
  if(!dirPath.match(/\/$/)) dirPath += '/';

  let files = fs.readdirSync(dirPath);
  
  files.forEach((file, index, arr) => {
    arr[index] = dirPath + file;
  });
  
  return files;
}

readFileContents = (filePath) => {
  return fs.readFileSync(filePath, { encoding: "utf-8"});
}

getAbsolutePath = (file) => {
  return path.parse(file).dir + path.sep + path.parse(file).base;
}

isDirectory = (file) => {
  return fs.statSync(file).isDirectory();
}

isFeature = (file) => {
  return path.parse(file).ext === '.feature';
}

isValidPath = (inputPath) => {
  try {
    fs.statSync(inputPath);
    
    return true;
  } catch(error) {
    return false;
  }
}

scanFilesRecursively = (current) => {
  if(isDirectory(current.absolutePath)) {
    current.isDirectory = true;

    readDirContents(current.absolutePath).forEach((item) => {
      let file = new File(getAbsolutePath(item));
      
      if(isDirectory(file.absolutePath) || isFeature(file.absolutePath)) 
        current.content.push(file);
      
      scanFilesRecursively(file);
    });
  } else {
    readFileContents(current.absolutePath).split('\n').forEach((line) => {
        if (!line.includes("language:")) {
          current.content.push(line);
        }
    });
  }
}

let getFiles = (fromPath) => {
  if(!isValidPath(fromPath))
    throw new Error('[' + fromPath + '] is not a valid file system path.');

  let rootFolder = new File(getAbsolutePath(fromPath));
  scanFilesRecursively(rootFolder);
  return rootFolder;
}

module.exports = {
  getFiles: getFiles
};