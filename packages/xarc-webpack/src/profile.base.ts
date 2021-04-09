// https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files

const profile = {
  partials: {
    "_base-options": { order: 100 },
    _entry: { order: 200 },
    _output: { order: 300 },
    _resolve: { order: 400 },
    "_resolve-loader": { order: 500 },
    _subapp2: { order: 600 },
    //
    _babel: { order: 2000 },
    "_extract-style": { order: 2100 },
    _fonts: { order: 2200 },
    _images: { order: 2300 },
    _stats: { order: 2400 },
    _isomorphic: { order: 2500 },
    _pwa: { order: 2600 },
    // ensure this is after _dev (development profile) and _output
    // because it needs to modify output.publicPath to "auto"
    // for remote entry to work
    "_subapp-chunks": { order: 19000 },
    "_dll-load": { order: 20000 },
    _node: { order: 30000 }
  }
};

export = profile;
