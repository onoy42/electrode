# Electrode Archetype Option Mocha

Allows [Electrode](https://github.com/electrode-io/electrode) apps to optionally choose to skip installing dependencies for mocha.

The app can skip installing mocha dependencies by adding a file `archetype/config/index.js` or `archetype/config.js` and set:

```js
module.exports = {
  options: {
    mocha: false
  }
};
```

If nothing is set, then default is to install.

# Usage

This module generally is included by other Electrode modules. An Electrode app doesn't need to install this directly.

## Install

In `package.json`:

```js
{
  "optionalDependencies": {
    "electrode-archetype-opt-mocha": "^1.0.0"
  }
}
```

And setup archetype config accordingly.

## License

Copyright (c) 2016-present, WalmartLabs

Licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).

---
