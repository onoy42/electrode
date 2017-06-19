"use strict";

var _ = require("lodash");
var chalk = require("chalk");
var yeoman = require("yeoman-generator");
var path = require("path");
var extend = _.merge;
var parseAuthor = require("parse-author");
var optionOrPrompt = require("yeoman-option-or-prompt");

var ReactComponentGenerator = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);
    this.quotes = this.options.quotes;
    this.githubUrl = this.options.githubUrl || "https://github.com";
    this.optionOrPrompt = optionOrPrompt;
  },
  initializing: function () {
    this.isAddon = this.options.isAddon || false;
    this.demoAppName = this.options.demoAppName;
    this.pkg = this.fs.readJSON(this.destinationPath("package.json"), {});

    // Pre set the default props from the information we have at this point
    this.props = {
      packageName: this.pkg.name || this.options.name,
      projectName: this.options.name
    };

    if (_.isObject(this.pkg.author)) {
      this.props.developerName = this.pkg.author.name;
      this.props.createDirectory = true;
    } else if (_.isString(this.pkg.author)) {
      var info = parseAuthor(this.pkg.author);
      this.props.developerName = info.name;
    }
    this.props.quoteType = this.quotes;
  },
  prompting: {
    greeting: function () {
      if (!this.isAddon) {
        this.log(
          "\n" +
          chalk.bold.underline("Welcome to the Electrode Component Generator") +
          "\n" +
          "\nWe're going to set up a new " +
          chalk.bold("Electrode") +
          " component, ready for development with" +
          "\n" +
          chalk.bold("gulp, webpack, demo, electrode component archetype, and live-reload")
        );
      }
    },
    askFor: function () {
      if (this.pkg.name || this.options.name) {
        this.props.name = this.pkg.name || _.kebabCase(this.options.name);
      }
      if (this.options.componentName) {
        this.props.componentName = this.options.componentName;
      }

      var prompts = [
        {
          type: "input",
          name: "projectName",
          message: "What is your Package/GitHub project name? (e.g., 'wysiwyg-component')",
          default: "wysiwyg-component",
          when: !this.props.name
        },
        {
          type: "input",
          name: "packageName",
          message: "What is the ClassName for your component?",
          default: this.props.componentName || this.props.projectName,
          when: !this.props.componentName
        },
        {
          type: "input",
          name: "packageName",
          message: "What will be the npm package name?",
          default: this.props.packageName
        },
        {
          type: "input",
          name: "packageGitHubOrg",
          message: "What will be the GitHub organization username (e.g., 'walmartlabs')?",
          default: this.props.packageGitHubOrg
        },
        {
          type: "input",
          name: "developerName",
          message: "What is your name? (for copyright notice, etc.)",
          default: this.props.developerName
        },
        {
          type: "input",
          name: "ghUser",
          message: "What is your GitHub Username?",
          default: this.props.developerName
        },
        {
          type: "list",
          name: "quoteType",
          message: "Use double quotes or single quotes?",
          choices: ['"', "'"],
          default: '"',
          when: !this.props.quoteType
        },
        {
          type: "input",
          name: "ghRepo",
          message: "What is the name of the GitHub repo where this will be published?",
          default: this.packageName
        },
        {
          type: "confirm",
          name: "createDirectory",
          message: "Would you like to create a new directory for your project?",
          default: true
        }
      ];
      return this.optionOrPrompt(prompts).then(props => {
        this.props = extend(this.props, props);
        this.projectName = this.props.projectName;
        this.packageName = this.props.projectName;
        this.developerName = this.props.developerName.split(" ").map(_.toLower).join("");
        this.quoteType = this.props.quoteType;
        this.ghUser = this.props.ghUser;
        this.ghRepo = this.props.ghRepo;
        this.packageGitHubOrg = this.props.packageGitHubOrg;
        this.createDirectory = this.props.createDirectory;
        this.componentName = _.kebabCase(_.deburr(this.props.projectName))
          .replace(/^\s+|\s+$/g, "")
          .replace(/(^|[-_ ])+(.)/g, function (match, first, second) {
            return second.toUpperCase();
          });
        this.currentYear = new Date().getFullYear();
        if (this.props.createDirectory) {
          var newRoot = this.destinationPath() + "/" + this.packageName;
          this.destinationRoot(newRoot);
        }
        this.rootPath = this.isAddon ? "" : "packages/" + this.projectName + "/";
      });
    }
  },

  writing: {
    lernaStructure: function () {
      // copy lerna and top level templates
      if (!this.isAddon) {
        this.copy("gitignore", ".gitignore");
        this.template("_package.json", "package.json");
        this.template("_readme.md", "README.md");
        this.template("lerna.json", "lerna.json");
      }
    },
    project: function () {
      this.copy("packages/component/babelrc", this.rootPath + ".babelrc");
      this.copy("packages/component/gitignore", this.rootPath + ".gitignore");
      this.copy("packages/component/npmignore", this.rootPath + ".npmignore");
      this.copy("packages/component/editorconfig", this.rootPath + ".editorconfig");
      if (this.quoteType === "'") {
        this.template("packages/component/eslintrc", this.rootPath + ".eslintrc");
      }
      this.template("packages/component/_gulpfile.js", this.rootPath + "gulpfile.js");
      this.template("packages/component/_package.json", this.rootPath + "package.json");
      this.template("packages/component/_readme.md", this.rootPath + "README.md");
    },
    component: function () {
      this.template(
        "packages/component/src/components/_component.jsx",
        this.rootPath + "src/components/" + this.projectName + ".jsx"
      );
      this.template(
        "packages/component/src/styles/_component.css",
        this.rootPath + "src/styles/" + this.projectName + ".css"
      );

      // l10n language templates
      this.template(
        "packages/component/src/lang/_DefaultMessages.js",
        this.rootPath + "src/lang/default-messages.js"
      );
      this.template("packages/component/src/lang/_en.json", this.rootPath + "src/lang/en.json");
      this.template(
        "packages/component/src/lang/tenants/electrodeio/_defaultMessages.js",
        this.rootPath + "src/lang/tenants/electrodeio/default-messages.js"
      );

      this.template("packages/component/src/_Component.js", this.rootPath + "src/index.js");
    },
    test: function () {
      this.template(
        "packages/component/test/client/eslintrc",
        this.rootPath + "test/client/.eslintrc"
      );
      this.template(
        "packages/component/test/client/components/_component.spec.jsx",
        this.rootPath + "test/client/components/" + this.projectName + ".spec.jsx"
      );
      this.copy(
        "packages/component/test/client/components/helpers/_intlEnzymeTestHelper.js",
        this.rootPath + "test/client/components/helpers/intl-enzyme-test-helper.js"
      );
    },

    demoApp: function () {
      //Do not generate the demo app if called from the add on generator
      this.originalDemoAppName = "demo-app";
      if (!this.isAddon) {
        //custom props to pass to the App Generator
        this.props.description = this.description || "The demo App";
        this.props.createDirectory = false;
        this.props.packageName = this.packageName;
        this.props.className = this.componentName;
        this.props.name = this.originalDemoAppName;
        this.props.homepage = this.githubUrl + "/" + this.packageGitHubOrg + "/" + this.ghRepo;
        this.props.serverType = "HapiJS";
        this.props.githubUrl = this.githubUrl;
        this.props.authorName = this.developerName;
        this.props.authorEmail = this.ghUser + "@" + this.packageGitHubOrg + ".com";
        this.props.authorUrl = this.githubUrl + "/" + this.ghUser;
        this.props.pwa = false;
        this.props.autoSsr = false;
        this.props.license = "nolicense";
        this.props.githubAccount = this.ghUser;
        this.props.keywords = "electrode";
        let options = {
          isDemoApp: true,
          props: this.props
        };

        //change the destinationRoot for generating the demo app
        this.oldRoot = this.destinationRoot();
        var newRoot = this.destinationPath() + "/" + this.originalDemoAppName;
        this.destinationRoot(newRoot);
        this.composeWith(
          "electrode:app",
          { options },
          {
            local: require.resolve("../generators/app")
          }
        );
      }
    }
  },

  install: function () {
    //git init and npmi for lerna lernaStructure
    if (!this.isAddon) {
      //reset the path to the actual root
      this.destinationRoot(this.oldRoot);
      this.destinationRoot()

      this.spawnCommandSync("git", ["init"], {
        cwd: this.destinationPath()
      });
      this.spawnCommandSync("npm", ["install"], {
        cwd: this.destinationPath()
      });
    }

    //install the dependencies for the package
    let packageDirectory = this.isAddon
      ? this.destinationPath()
      : this.destinationPath() + "/" + this.rootPath;

    this.destinationRoot(packageDirectory);
    console.log("PACKAGE DIRECTORY:::::", this.destinationPath());

    this.spawnCommandSync("npm", ["install"], {
      cwd: this.destinationPath()
    });

    //install demo-app dependencies
    let demoDirectory = this.isAddon
      ? this.destinationPath("../../" + this.originalDemoAppName)
      : this.oldRoot + "/" + this.originalDemoAppName;
    this.destinationRoot(demoDirectory);
    this.spawnCommandSync("npm", ["install"], {
      cwd: this.destinationPath()
    });
  },

  end: function () {

    if (this.quoteType === "'") {
      this.spawnCommandSync("node_modules/.bin/eslint", [
        "--fix",
        "src",
        "demo",
        "example",
        "test",
        "--ext",
        ".js,.jsx"
      ]);
    }

    if (!this.isAddon) {
      this.appName = _.isEmpty(this.demoAppName) ? this.originalDemoAppName : this.demoAppName;
      this.log(
        "\n" +
        chalk.green.underline("Your new Electrode component is ready!") +
        "\n" +
        "\nYour component is in packages/" +
        this.packageName +
        " and your demo app is " +
        this.appName +
        "\n" +
        "\nType 'cd ../" +
        this.appName +
        "' then 'gulp dev' to run the development build for the demo app." +
        "\n"
      );
    }
  }
});

module.exports = ReactComponentGenerator;
