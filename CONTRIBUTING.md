# Contributing

PRs and issues are always welcome!  We appreciate your interest in Electrode and offer to help.

There are [few guidelines](#contributing-guidelines) that we request contributors to follow so that we can keep things well maintained.

## Getting Started

This repo uses [Lerna] as a top level setup.

-   Install `clap` command

```bash
$ npm install -g xclap-cli
```

-   Fork and clone the repo at <https://github.com/electrode-io/electrode.git>

```bash
$ git clone https://github.com/<your-github-id>/electrode.git
$ cd electrode
```

-   Quick Test

Run:

```bash
$ npm install
$ npm run bootstrap
$ clap samples-local
```

-   Now you can go to the `samples` folder, pick or create any samples, develop and test your changes over there.

For example, run the `universal-react-node` samples in `dev` mode:

```bash
$ cd samples/universal-react-node
$ npm install
$ clap dev
```

After running above, you should see a similar text as `Hapi.js server running at http://m-C02SL0GSG8WM.local:3000` in command line.

And when you open the browser at `http://localhost:3000`, you should see a large Electrode icon with a few demonstration components below.

You can also run in `hot` mode.  However, `hot` mode is still experimental and there are issues.

```bash
$ clap hot
```

## Contributing Guidelines

### Submitting Pull Request

We love PRs and appreciate any help you can offer.  Please follow the guidelines on styling and commit messages here.

#### Styling

We've now switched to use [prettier] to format all our code.  

Our [prettier] settings are: `--print-width 100`

> If you are making changes to a file that has not been updated yet, please commit the format first before making your changes.

#### PR and Commit messages

Since we use independent lerna mode, to help keep the changelog clear, please format all your commit message with the following guideline:

`package: [major|minor|patch|docs][feat|bug|chore] <message>`

-   `package` should be one of the packge under `packages` or `samples` directory without the `electrode-` prefix.
-   Please do everything you can to keep a commit and PR to a single package only, except `docs`.
-   If the commit is generic and not specific to a package, then don't include the `package:` part.
-   Only include `[feat|bug|chore]` if it's applicable.
-   Please format your PR's title with the same format.

A sample commit and PR message should look like:

    archetype-react-app: [minor][feat] implement SSR support for Inferno

> Note: Branching is recommended on Publish commits only so it's possible to rely on lerna to publish from that branch.

### Filing Issues

We love to hear about your experience using Electrode and bug reports.  Electrode has many features and it's hard for us to test everything under all scenarios and setup, so your help is very important to us.

When you submit a bug report, please include the following information:

-   NodeJS/npm versions by doing `nodev -v` and `npm -v`
-   Your OS and version
-   Electrode package versions
-   Any errors output
-   If possible, sample code and steps on how to reproduce the bug

## Updating Docs

This repo has a [gitbook] documentation under `docs`.  To review the docs as a gitbook locally:

-   Install [gitbook-cli] and the plugins for our docs

```bash
$ npm install gitbook-cli -g
$ gitbook install
```

-   Serve the book locally

```bash
$ gitbook serve --no-watch --no-live
```

And open your browser to `http://localhost:4000` to view the docs.

Here is the documentation on a [gitbook] structure: <https://toolchain.gitbook.com/structure.html>

> Without the `--no-watch --no-live` options it becomes unusably slow on my machine.

[gitbook-cli]: https://www.npmjs.com/package/gitbook-cli

[prettier]: https://www.npmjs.com/package/prettier

[lerna]: https://lernajs.io/

[gitbook]: https://www.gitbook.com
