# What is Electrode?

> Electrode is a platform for building large scale universal React web applications with a standardized structure that follows best practices and has modern technologies baked in. Electrode focuses on performance, component reusability, and simple deployment to multiple cloud providers—so you can focus on what makes your app unique.

## Core: Quick, Easy, and Scale

Electrode Core allows you to start building a large scale universal React/Node.js application in minutes, with support for server side rendering, easy deployment, and sacling up to teams with hundred of developers.

The heart of the platform is the [Electrode Archetype System](/chapter1/quick-start/what-are-archetypes.md), which allows for a standardized configuration, structure and workflow throughout the entire application. By enforcing a sensible structure and consistency for components, modules and the entire app, Electrode’s Archetype system helps you build scalable applications you can trust while ensuring streamlined development and deployment.

Electrode comes with two major archetypes to support large scale React web application development.

-   **[Electrode Application Archetype]** comes with everything to help you build an universal React application and support for production deployments.

-   **[Electrode Component Archetype]** comes with everything to support building and sharing reusable React components across teams with hundreds of developers.

**It only takes a few minutes to get your new Electrode application running and deployed to the cloud. See our **[**Quick Guide**](/chapter1/quick-start/get-started.md)** to get started now.**

## Features

### Electrode Core

You get the following features when building your React application with the Electrode Platform:

-   Everything you need to build an Universal React application with ES6 and JSX.
-   Prime support for building and sharing reusable React components.
-   Styling with CSS Module using [PostCSS].
-   Writing and running Unit Test with [Mocha], [Karma], and [PhantomJS] or [Chrome Headless]
-   Highly optimized Server Side Rendering for your React App
-   Using images as module in your React code.
-   Manage application config base on `NODE_ENV` and customizable ENV you choose.
-   Stateless Cross Site Request Forgery (CSRF) protection.
-   NodeJS web servers using Hapi, Express, or Koa.
-   A HTML base visual reporter for webpack compile results.

### Supporting Modules

In order to provide the features for an Electrode Application, we provide the following modules.

-   [Webpack Isomorphic Loader] - Makes NodeJS `require` understand files such as images for SSR. 

-   [Electrode-Redux-Router-Engine] - A server side [React] routing and rendering engine using react-router and redux.

-   [Component Caching] - An caching optimizer to improve React Server Side Rendering performance.

-   [Electrode Confippet] - Helps compose NodeJS application configuration base on `NODE_ENV`

-   [Electrode-Server] - A configurable web server using Hapi.js on top of Node.js.

-   [Electrify] - a tool for analyzing the module tree of webpack projects.

-   [Electrode-Docgen] - a custom metadata extractor for the Electrode framework, automates component documentation. 

* * *

### Standalone Modules: Optimize Where You Want

As part of the Electrode Platform, we have a number of modules to help with common tasks and features, from [server-side render caching](/chapter1/advanced/stand-alone-modules/server-side-render-caching-+-profiling.md) to [flexible configuration management](/chapter1/advanced/stand-alone-modules/confippet.md). These modules can be used independently of Electrode Core, which means you can [integrate them into your existing apps](/chapter1/advanced/stand-alone-modules.md).

**Start using these modules in your existing application with our **[**standalone modules guide**](/chapter1/advanced/stand-alone-modules.md)**.**

* * *

### Tools: Power Up Your Existing Applications

The Electrode Platform also has tools that can be consumed by existing applications built with other platforms (though with Electrode core, these tools are either bundled directly or require far less configuration). There are currently two powerful tools:

-   one which enables [discovery of reusable components](/chapter1/advanced/powerful-electrode-tools/electrode-explorer.md)

-   another to help optimize your [JavaScript bundles](/chapter1/advanced/powerful-electrode-tools/electrify.md)

**Start using **[**Electrode Explorer** ](/chapter1/advanced/powerful-electrode-tools/electrode-explorer.md)**and **[**Electrify**](/chapter1/advanced/powerful-electrode-tools/electrify.md) **in your existing applications.**

## Technologies Used and Supported

-   [React]
-   [Redux]
-   [React Router]
-   [PostCSS]
-   [Webpack]
-   [Babel]
-   [ESLint]
-   [Mocha]
-   [Enzyme]
-   [Yeoman]

[electrode-docgen]: https://github.com/electrode-io/electrode-docgen

[electrify]: https://github.com/electrode-io/electrify

[electrode-server]: https://github.com/electrode-io/electrode-server

[electrode confippet]: https://github.com/electrode-io/electrode-confippet

[component caching]: https://github.com/electrode-io/electrode-react-ssr-caching

[electrode-redux-router-engine]: https://github.com/electrode-io/electrode-redux-router-engine

[webpack isomorphic loader]: https://github.com/jchip/isomorphic-loader

[react]: https://facebook.github.io/react/index.html

[redux]: http://redux.js.org/docs/basics/UsageWithReact.html

[react router]: https://reacttraining.com/react-router/

[webpack]: https://webpack.github.io/docs/motivation.html

[babel]: https://babeljs.io/

[eslint]: http://eslint.org/

[mocha]: https://mochajs.org/

[enzyme]: https://github.com/airbnb/enzyme

[yeoman]: http://yeoman.io/

[karma]: https://karma-runner.github.io/1.0/index.html

[chrome headless]: https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md

[phantomjs]: http://phantomjs.org/

[postcss]: https://github.com/postcss/postcss

[electrode archetype system]: /chapter1/quick-start/what-are-archetypes.md

[electrode component archetype]: https://github.com/electrode-io/electrode/tree/master/packages/electrode-archetype-react-component

[electrode application archetype]: https://github.com/electrode-io/electrode/tree/master/packages/electrode-archetype-react-app
