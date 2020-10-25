<!-- markdownlint-disable no-inline-html no-bare-urls line-length no-trailing-punctuation -->

# Hyperscript-Adapter-Modules

This library is a utility for having components and modules in JavaScript with less boilerplate and support for CSS Modules / JSS.

## Install

Simpily run:

```bash
npm install --save hyperscript-adapter-modules
```

[`hyperscript-adapter`](https://www.npmjs.com/package/hyperscript-adapter) will have to be installed for this to work.

## Loading

Once this library is installed, load the file using a script or requirejs.

Script loading:

```html
<script src="path/to/hyperscript-adapter-modules/index.min.js"></script>
```

Requirejs loading:

```js
requirejs(['path/to/hyperscript-adapter-modules/index.min.js'], HTMLModuleCreator => {
    /* Do stuff with HTML */
});
```

If requirejs is loaded before the script, then HTML is exported:

```js
requirejs(['hyperscript-adapter-modules'], HTMLModuleCreator => {
    /* Do stuff with HTML */
});
```

## Settings

Settings can be applied as the second argument to `HTMLModuleCreator`. For example:

```js
HTMLModuleCreator(HTML, {
    fallbackClasses: true,
});
```

The `HTML` instance can also have settings applied to it. `HTMLModuleCreator` will override the `classResolver` and `tagResolver` though.

### `fallbackClasses: false`

This setting controls whether to make `$.foo` go to the global class foo if it is not within one of the modules loaded. While this may be useful if there are important globals, this is disabled by default as it can be the cause of bugs.

### `partialApply: false`

This setting controls whether the function input should be partially applied. If this setting is activated, the component function is partially applied. For example:

```js
modWithPartialApplyTrue('name', (css, mod, $, argOne, argTwo) => doStuff());
// Would be equivalent to
mod('name', (css, mod, $) => (argOne, argTwo) => doStuff());
```

### `hyphenatedComponents: false`

This setting controls whether component creation is hyphenated. If this is activated, `$.fooBar` would reference the component with name `foo-bar` instead of the component with name `fooBar`.

### `hyphenatedClasses: true`

This setting controls whether to hyphenate classes loaded with `css`. If `true`, it will query based on the hyphenated version of the input class. For example, `fooBar` would become `foo-bar`.

### `useDefault: false`

This setting controls whether to use the `default` property of the css stylesheets passed in. Activate this if you are using commonjs in a webpack project.

## Initialization

The exported `HTMLModuleCreator` is a function that takes in the current `HTML` instance and an object of settings and outputs the actual module creator function.

The simplest way to initialize it is:

```js
const mod = HTMLModuleCreator(HTML);
```

## Usage

```js
const stylesheet = {
    foo: 'foo-hash',
    bar: 'bar-hash',
};
const SomeComponent = mod('SomeComponent', (css, use, $) => {
    css(stylesheet);
    return $.div.foo($.div.bar());
});
const OtherComponent = mod('OtherComponent', (css, use, $) => {
    use(SomeComponent);
    return $.SomeComponent();
});
```

The `css` function allows the importing of stylesheets. The `use` function allows the importing of other components.

Each call to `mod` returns an object, with two keys: the `name` of the component (the first argument), and the `component` (the return value of the function). The component is paired up in this way as to allow `use` to pick up the name as well.

The `mod` function also has an `addGlobal` method which adds a global component, which can be seen by all component declarations.

The full usage can be seen in `tests.js`.
