# How To Become A Contributor And Submit Your Own Code
There are few guidelines that we need contributors to follow so that we can have a chance of keeping on top of things.

## Getting Started
This repo uses Lerna (https://lernajs.io/) as a top level setup, which is a tool that optimizes the workflow around managing multi-package repositories with git and npm.

* Make sure you have installed gulp-cli

````
$ npm install -g gulp-cli
````

* Make sure you have forked the desired repo (https://github.com/electrode-io/electrode.git) for developing and testing your code changes.

````
$ git clone https://github.com/electrode-io/electrode.git
$ cd electrode
````

* Run `npm install` for installing all the dependencies repo needed.

* Run `npm run bootstrap` for bootstrapping the packages in the current repo. It will install all their dependencies and linking any cross-dependencies.

* Run `gulp samples-local` for pulling electrode packages from local under `packages` folder.

* Now you can go to the `samples` folder, pick or create any samples, develop and test your changes over there.

Run samples in dev mode (ex.`samples/universal-react-node`):

```
$ cd samples/universal-react-node
$ npm install
$ gulp dev|hot
```

After running above, you should see a similar text as `Hapi.js server running at http://m-C02SL0GSG8WM.local:3000` in command line.

And when you open the browser at `http://localhost:3000`, you should see a large Electrode icon with a few demonstration components below.

## Create Your Own Gitbook

### Requirements

1. NodeJS (v4.0.0 and above is recommended)
1. Windows, Linux, Unix, or Mac OS X

### Installation

Make sure you have installed gitbook-cli
```
$ npm install gitbook-cli -g
```

### Create a book

GitBook can setup a boilerplate book:
```
$ gitbook init
```

> If you wish to create the book into a new directory, you can do so by running gitbook init ./directory

### Preview and serve a book

```
$ gitbook serve
```

After running above, you should see a similar text as `Serving book on http://localhost:4000` in command line.
And when you open the browser at `http://localhost:4000`, you should see a gitbook demo.

### Build the static website

```
$ gitbook build
```

### Integrate with repo under subdirectory
You can use a subdirectory (like docs/) to store the book for the project's documentation. You can configure the root option to indicate the folder where GitBook can find the book's files.

book.json:
```
{
    "root": "./docs"
}
```

## Contributing Guidelines
1. Push your changes to a topic branch in your fork of the repository.
1. Ensure that your code adheres to the existing style in the sample to which
   you are contributing.
1. Ensure that your code has an appropriate set of unit tests which all pass by running `npm run test` on the project root.
1. Submit a pull request with a proper title and detailed description.
1. Specify if the pull request will cause `[major]`, `[minor]` or `[patch]` version.
1. Specify which package the pull request affects.
1. Each pull request must affect a single package only.
1. The pull request title message should indicate if it's `[feat]`, `[bug]`, `[chore]` or `[docs]`.

A sample pull request message will look like:
```
archetype-react-app: [feat] [minor] implement SSR support for Inferno
```
>Note: Branching is recommended on Publish commits only so it's possible to rely on lerna to publish from that branch.
