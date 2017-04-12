'use strict';
var _ = require('lodash');
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.option('name', {
      type: String,
      required: true,
      desc: 'Project name'
    });

    this.option('pwa', {
      type: String,
      required: true,
      desc: 'Progressive Web App'
    });

    this.option('serverType', {
      type: String,
      required: true,
      desc: 'Server Type can be hapijs or express'
    });
    this.option('autoSsr', {
      type: String,
      required: true,
      desc: 'Automatically disable server side rendering'
    });
  },

  writing: function () {
    let routeMatch = (this.options.serverType === 'HapiJS') ? "/{args*}" : "*";
    //do not overwrite if file already exists
    if (!this.fs.exists(this.destinationPath('config/default.js'))) {
      this.fs.copyTpl(
        this.templatePath('default.js'),
        this.destinationPath('config/default.js'),
        {
          projectName: this.options.name,
          routeValue: routeMatch,
          pwa: this.options.pwa,
          serverType: this.options.serverType,
          isAutoSsr: this.options.autoSsr
        }
      );
    }

    if (this.options.pwa) {
      this.fs.copyTpl(
        this.templatePath('sw-config.js'),
        this.destinationPath('config/sw-config.js'),
        { projectName: this.options.name }
      );
    }
  }
});
