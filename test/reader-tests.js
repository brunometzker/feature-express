let expect = require('chai').expect;
let reader = require('../lib/reader.js');

let validPath = "./test/features-example";
let invalidPath = "invalid-path";

describe ("Reader Tests", () => {
    it("Should raise error when provided path is not a valid system path", function() {
        expect(() => reader.getFiles(invalidPath)).to.throw('[' + invalidPath + '] is not a valid file system path.');
    });

    it("Should return an object when recursively looking for feature files", function() {
        expect(reader.getFiles(validPath)).to.not.be.undefined;
    });
});

            
     