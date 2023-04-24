# eslint-plugin-slavio-fsd-plugin

plugin for production project

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-slavio-fsd-plugin`:

```sh
npm install eslint-plugin-slavio-fsd-plugin --save-dev
```

## Usage

Add `slavio-fsd-plugin` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "slavio-fsd-plugin"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "slavio-fsd-plugin/rule-name": 2
    }
}
```

## Rules

This plugin allows you to set rules for Eslint which determines whether the path is relative or absolute within the current slice (according to FSD terminology).

Since the FSD architecture uses the Public API, all paths within one slice must be relative.