"use strict";

const checkModule = require("../../../lib/util/check-module");
const expect = require("chai").expect;
const xsh = require("xsh");
const sinon = require("sinon");
const Promise = require("bluebird");
const Fs = require("fs");
const Path = require("path");

describe("check-module", function() {
  this.timeout(10000);
  describe("globalInstalled", function() {
    it("should find version of npm", () => {
      return checkModule.globalInstalled("npm").then(version => {
        expect(version).to.be.not.empty;
        expect(version).to.not.equal("0.0.0");
      });
    });

    it("should handle error with {} output", () => {
      const exec = sinon.stub(xsh, "exec").callsFake(() => {
        const error = new Error("blah");
        error.output = { stdout: "{}\n" };
        return Promise.reject(error);
      });
      return checkModule
        .globalInstalled("npm")
        .then(version => {
          expect(version).to.equal("0.0.0");
        })
        .finally(() => {
          exec.restore();
        });
    });

    it("should rethrow error that's not {} output", () => {
      const exec = sinon.stub(xsh, "exec").callsFake(() => {
        const error = new Error("blah");
        error.output = { stdout: "blah\n" };
        return Promise.reject(error);
      });
      let error;
      return checkModule
        .globalInstalled("npm")
        .catch(err => (error = err))
        .then(() => {
          expect(error).to.exist;
        })
        .finally(() => {
          exec.restore();
        });
    });
  });

  describe("latest", function() {
    it("should find version of npm", () => {
      return checkModule.latest("npm").then(version => {
        expect(version).to.be.not.empty;
        expect(version).to.not.equal("0.0.0");
      });
    });
  });

  describe("isNewDate", function() {
    it("should return true if year is newer", () => {
      expect(checkModule.isNewDate(new Date(2000, 5, 5), new Date(2001, 5, 5))).to.equal(true);
    });

    it("should return true if month is newer", () => {
      expect(checkModule.isNewDate(new Date(2000, 5, 5), new Date(2000, 6, 5))).to.equal(true);
    });

    it("should return true if date is newer", () => {
      expect(checkModule.isNewDate(new Date(2000, 5, 5), new Date(2000, 5, 6))).to.equal(true);
    });

    it("should return false if date is not newer", () => {
      expect(checkModule.isNewDate(new Date(2000, 5, 5), new Date(2000, 5, 5))).to.equal(false);
    });

    it("should return false if year is older", () => {
      expect(checkModule.isNewDate(new Date(2000, 5, 5), new Date(1999, 6, 6))).to.equal(false);
    });

    it("should return false if month is older", () => {
      expect(checkModule.isNewDate(new Date(2000, 5, 5), new Date(2000, 4, 6))).to.equal(false);
    });
  });

  describe("latestOnceDaily", function() {
    let mockVersion;
    let latestStub;
    const mockFile = Path.join(__dirname, "../../../latest_check_foo.json");

    const cleanFile = () => {
      try {
        return Fs.unlinkSync(mockFile);
      } catch (e) {
        return e;
      }
    };

    const saveMockFile = data => {
      Fs.writeFileSync(mockFile, typeof data === "string" ? data : JSON.stringify(data, null, 2));
    };

    before(() => {
      latestStub = sinon.stub(checkModule, "latest").callsFake(() => {
        return Promise.resolve(mockVersion);
      });
    });

    after(() => {
      latestStub.restore();
      cleanFile();
    });

    it("should return latest version if save file doesn't exist yet", () => {
      cleanFile();
      mockVersion = "hello";
      return checkModule.latestOnceDaily("foo").then(version => {
        expect(version).to.equal(mockVersion);
      });
    });

    it("should return latest version if save file is invalid", () => {
      saveMockFile("blah blah");
      mockVersion = "hello";
      return checkModule.latestOnceDaily("foo").then(version => {
        expect(version).to.equal(mockVersion);
      });
    });

    it("should save version if date is not newer", () => {
      saveMockFile({
        timestamp: Date.now(),
        version: "foo-bar"
      });
      mockVersion = "hello";
      return checkModule.latestOnceDaily("foo").then(version => {
        expect(version).to.equal("foo-bar");
      });
    });
  });

  describe("isNewVersion", function() {
    it("should return true if version is newer", () => {
      expect(checkModule.isNewVersion("1.0.0", "1.0.1")).to.equal(true);
    });

    it("should return false if version is the same", () => {
      expect(checkModule.isNewVersion("1.0.0", "1.0.0")).to.equal(false);
    });

    it("should return false if version is the older", () => {
      expect(checkModule.isNewVersion("1.0.0", "0.9.9")).to.equal(false);
    });
  });
});
