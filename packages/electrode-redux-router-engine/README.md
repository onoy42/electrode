# Electrode Redux Router Engine

[![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![devDependency Status][daviddm-dev-image]][daviddm-dev-url] [![npm downloads][npm-downloads-image]][npm-downloads-url]

Handle async data for React Server Side Rendering using [react-router], Redux, and the [Redux Server Rendering] pattern.

## Install

```bash
$ npm install -save electrode-redux-router-engine
```

## Usage

You need to specify your routes according to [react-router]'s specs.

For example, a file routes.jsx:

```js
import { Route, IndexRoute, Redirect } from "react-router";

export default (
  <Route path="/test" component={Page}>
    <IndexRoute component={Home}/>
    <Redirect from="source" to="target" />
    <Route methods="get" path="/subroute" init="subroute-init" component={SubRoute} />
  </Route>
);
```

For each route, you can add the following optional attributes:

-   `init` to specify custom redux store initializer for the route
-   `methods` to specify the HTTP methods you want the route to allow.

### `init` attribute

If `true`, then uses route's path to load JS file that provides the store initializer.

i.e. `<Route path="/subroute" init={true} />`, will require file `CWD/${options.routesHandlerPath}/subroute`.

i.e. `<Route path="/subroute" init="custom-init" />`, will require file `CWD/${options.routesHandlerPath}/custom-init`

If `undefined` then will use the default `createReduxStore` passed through options.

### `methods` attribute

i.e. `<Route methods="get,post" path="/form" component={Form}>`

If the attribute is not specified then it's defaulted to `"get"`.

And an example using the [Redux Async Actions] pattern:

```js
const ReduxRouterEngine = require("electrode-redux-router-engine");

function createReduxStore(req, match) {
    // this refs to engine

    const store = configureStore();

    return Promise.all([
      store.dispatch(boostrapApp())
      // dispatch any other asynchronous actions here
    ]).then( () => {
      return store;
    });
}

const routes = require("./routes");

const engine = new ReduxRouterEngine({routes, createReduxStore});

// express or Hapi route handler:

function handler(req, res) {
  engine.render(req)
    .then( (result) => {
      // send full HTML with result back using res
    });
}
```

## API

### [constructor(options)](<>)

Where options could contain the following fields:

-   `routes` - **required** The react-router routes
-   `createReduxStore` - **required** async callback that returns a promise resolving to the Redux store
    -   It should take `(req, match)` arguments where match is react-router's match result.
    -   If it's a `function` then its `this` references the engine instance.
-   `withIds` - **optional** boolean to indicate whether to render with react-dataids.
-   `stringifyPreloadedState` **optional** callback to return string for the preloaded state
-   `logError` - **optional** callback to log any error
    -   It should take `(req, err)` arguments
    -   If it's a `function` then its `this` references the engine instance
    -   Defaulted to `console.log`
-   `renderToString` - **optional** callback to provide custom renderToString
    -   It should take `(req, store, match, withIds)` arguments
    -   If desired, it can return a `Promise` that resolves the HTML string.
-   `routesHandlerPath` - **optional** Path to directory to lookup individual route's `createReduxStore` handlers.
    -   This is defaulted to `${process.env.APP_SRC_DIR}/server/routes` (for Electrode apps)

### [engine.render(req, options)](<>)

Method to render a route.

-   `req` - express/Hapi request object
-   `options` - override options passed to constructor
    -   `withIds`
    -   `stringifyPreloadedState`
    -   `createReduxStore`

If everything worked out, then it returns a promise resolving to:

```js
{
  status: 200,
  html: // string from React renderToString,
  prefetch: // string from stringifyPreloadedState
}
```

If error occured, then it returns a promise resolving to:

```js
{
  status: react-router status or 500,
  message: err.message,
  path: // request path,
  _err: // original error object
}
```

If no route matched, then it returns a promise resolving to:

```js
{
  status: 404,
  message: `router-resolver: Path <path> not found`
}
```

If react-router found a redirect route, then it returns a promise resolving to:

```js
{
  status: 302,
  path: // redirect location
}
```

Built with :heart: by [Team Electrode](https://github.com/orgs/electrode-io/people) @WalmartLabs.

[redux async actions]: http://redux.js.org/docs/advanced/AsyncActions.html

[redux server rendering]: http://redux.js.org/docs/recipes/ServerRendering.html

[react-router]: https://github.com/reactjs/react-router

[npm-image]: https://badge.fury.io/js/electrode-redux-router-engine.svg

[npm-url]: https://npmjs.org/package/electrode-redux-router-engine

[daviddm-image]: https://david-dm.org/electrode-io/electrode/status.svg?path=packages/electrode-redux-router-engine

[daviddm-url]: https://david-dm.org/electrode-io/electrode?path=packages/electrode-redux-router-engine

[daviddm-dev-image]: https://david-dm.org/electrode-io/electrode/dev-status.svg?path=packages/electrode-redux-router-engine

[daviddm-dev-url]: https://david-dm.org/electrode-io/electrode?path=packages/electrode-redux-router-engine?type-dev

[npm-downloads-image]: https://img.shields.io/npm/dm/electrode-redux-router-engine.svg

[npm-downloads-url]: https://www.npmjs.com/package/electrode-redux-router-engine
