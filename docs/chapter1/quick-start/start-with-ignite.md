# Getting Started with Electrode Ignite

Electrode is a platform that involves many pieces and environments.  To ensure you have everything working together, an npm module [electrode-ignite] is available with a CLI command that's the single entry point to help you start development with the Electrode platform.

## Installation

If you have not done so yet, please check [Requirements](/overview/requirements.md) for setting up your development environment.

## Usage

You can use [electrode-ignite] with an interactive menu by running `ignite`, or you can run it with the command name directly.

To see a list of the commands available, run `ignite --help`

#### Ignite Menu

To see the interactive menu, run:

```bash
$ ignite
```

The Ignite Menu will show as below:

![Electrode Ignite Menu](/images/ignite-menu.png)

#### Single Ignite Task

Electrode Ignite can also be invoked with a single command by specifying the name.

For example, to check your NodeJS and npm version for Electrode development:

```bash
$ ignite check-nodejs
```

To generate a new Electrode React App:

```bash
$ ignite generate-app
```

You can check the list of command by:

```bash
$ ignite --help
```

And the help on usage will show as below:

![Electrode Ignite Help](/images/ignite-help.png)

## Available Ignite Tasks

-   `check-nodejs` - Check your NodeJS and npm environment
-   `generate-app` - Generate an Electrode application
-   `generate-component` - Generate an Electrode component
-   `add-component` - Add a component to your existing component repo
-   `docs` - Electrode official documenation
-   `help` - Show help on usage

Let's get start with Electrode App|Component by Electrode Ignite in the next few sections.

[electrode-ignite]: https://www.npmjs.com/package/electrode-ignite
