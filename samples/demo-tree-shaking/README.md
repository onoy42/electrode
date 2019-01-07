# demo-tree-shaking [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

This is an Electrode sample app that demonstrates webpack tree shaking with Electrode component.

The app is generated using Electrode generator, and then added the Electrode sample demo-component.

To verify that webpack tree shaking is removing unused exports:

- run `clap build` to create JS bundles in `dist/js`
- run `grep DeadCardExampleToBeRemovedByTreeShaking dist/js/*.js`

Note that nothing is found.

## Installation

Since this app depends on components and packages located in the same repo, to install dependencies, use [fyn].

```sh
$ fyn
```

Then to test in dev mode:

```
$ clap dev
```

in prod mode:

```
$ npm run prod-start
```

## License

Apache-2.0 © [John Smith](http://www.test.com)

[npm-image]: https://badge.fury.io/js/demo-tree-shaking.svg
[npm-url]: https://npmjs.org/package/demo-tree-shaking
[travis-image]: https://travis-ci.org/test/demo-tree-shaking.svg?branch=master
[travis-url]: https://travis-ci.org/test/demo-tree-shaking
[daviddm-image]: https://david-dm.org/test/demo-tree-shaking.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/test/demo-tree-shaking
[fyn]: https://www.npmjs.com/package/fyn
