# Electrode Archetype Option Jest

Allow [Electrode](https://github.com/electrode-io/electrode) apps to optionally choose to skip installing dependencies for jest.

The app can skip installing jest dependencies by adding a file `archetype/config/index.js` or `archetype/config.js` and set:

```js
module.exports = {
  options: {
    jest: false
  }
};
```

If nothing is set, then default is to install.

# Usage

This module generally is included by other Electrode modules. An Electrode app should not need to install this directly.

## Install

In `package.json`:

```js
{
  "optionalDependencies": {
    "electrode-archetype-opt-jest": "^1.0.0"
  }
}
```

And setup archetype config accordingly.

## License

Copyright (c) 2016-present, WalmartLabs

Licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).

---
