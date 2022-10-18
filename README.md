# Tidy Columns [![github-ci][gh-badge]][gh-ci] [![npm version][npmjs-img]][npmjs]

[PostCSS] plugin to manage column alignment.

Tidy Columns creates a global grid, allowing authors to set widths and margins while maintaining alignment along the y-axis.

## Get Started

See the [demo page][demo] to see it in action.

### Install

```shell
npm install --save-dev postcss postcss-tidy-columns
```

### Usage

```js
postcss([ require('postcss-tidy-columns') ]);
```

See [PostCSS] docs for examples for your environment.

### Example

```scss
/* Input example */
@tidy columns var(--site-columns);
@tidy gap 1.25rem;
@tidy edge var(--site-edge);
@tidy max 80rem;

:root {
  --site-columns: 6;
  --site-edge: 1.25rem;
}

@media (min-width: 48rem) {
  :root {
    --site-columns: 12;
    --site-edge: 1.875rem;
  }
}

div {
  width: tidy-span(3);
  margin-left: tidy-offset(2);
}
```

```scss
/* Output example */
div {
  width: calc((((min(100vw, 80rem) - var(--site-edge) * 2) / var(--site-columns) - (1.25rem / var(--site-columns) * (var(--site-columns) - 1))) * 3) + 2.5rem);
  margin-left: calc((((min(100vw, 80rem) - var(--site-edge) * 2) / var(--site-columns) - (1.25rem / var(--site-columns) * (var(--site-columns) - 1))) * 2) + 2.5rem);
}
```

## API

These functions output `calc()` and `min()` functions, so can be used anywhere those functions can be used.

### Span Function

The `tidy-span()` function returns a `calc()` declaration for use in assigning widths.

> **Supports**: positive integer and decimal values.
>
> #### Syntax
>
> ```scss
> tidy-span(<number>)
> ```

### Offset Function

The `tidy-offset()` function returns a `calc()` declaration for use in positioning.

> **Supports**: positive and negative integer and decimal values
>
> #### Syntax
>
> ```scss
> tidy-offset(<number>)
> ```

### Var Function

`tidy-var()` functions are replaced by the specified option's value.

> #### Syntax
>
> ```scss
> tidy-var(<string>)
> ```
>
> #### Examples
>
> ```scss
> tidy-var(max)  // => 80rem
> tidy-var(edge) // => var(--site-edge)
> ```

See the [Examples Wiki page](https://github.com/goodguyry/postcss-tidy-columns/wiki/Examples) for more.

## Options

Tidy Columns uses `@tidy` at-rules to configure grid options. These options can be set to either a static value or a `var()` function.

**Static Values** will reduce the size of the output, but should only be used if the option's value **does not** change.

**CSS Custom Properties** offer much more flexibility, as they'll dynamically update during runtime.

Override an option by redeclaring it in a rule; disable it altogether with `@tidy <option> false`.

See the [Wiki][wiki] for more about configuring the plugin.

### `columns`

The number of grid columns in the design.

> #### 🔺 _Required_
>
> #### CSS Syntax
>
> ```
> @tidy columns [<number>|<var-function>];
> ```

### `gap`

The width of the gap between each column.

> **Default**: `undefined`
>
> #### CSS Syntax
>
> ```
> @tidy gap [<length>|<var-function>];
> ```

### `edge`

The minimum width of the flexible space between the edge of the content and the viewport.

> **Default**: `undefined`
>
> #### CSS Syntax
>
> ```
> @tidy edge [<length>|<var-function>];
> ```

### `max`

The max-width of the site, including [`edge`](#edge) spacing; the point at which the site transitions from fluid width to static width. Setting a `max` value ensures the column and margin widths are correct once the site width is static.

> **Default**: `undefined`
>
> #### CSS Syntax
>
> ```
> @tidy max [<length>|<var-function>];
> ```

### `base`

The units – either `vw` or `%` – used in the fluid base for calculations. This value is always appended to `100`.

> **Default**: `vw`
>
> #### CSS Syntax
>
> ```
> @tidy base [vw|%];
> ```
> 
> #### Example Output
>
> Set to vw, fluid grid based on viewport
>
> ```scss
> min(100vw, var(--site-max))
> ```
>
> Set to %, fluid grid based on parent element
> 
> ```scss
> min(100%, var(--site-max))
> ```

### `reduce`

Set `reduce` to `true` to reduce the `calc()` output using [`postcss-calc`](https://www.npmjs.com/package/postcss-calc).

> ```js
> require('postcss-tidy-columns')({ 
>   reduce: true,
> });
> ```
> 
> #### Example Output
>
> ```scss
> div {
>   width: min(25vw - 1.8749rem, 18.1251rem);
> }
> ```

### `debug`

Set `debug` to `true` print the pre-processed CSS declaration as a warning.

> ```js
> require('postcss-tidy-columns')({ 
>   debug: true,
> });
> ```

## Options Cascade

### Global at-rules

Global options are defined via `@tidy` at-rules _outside_ of any rule, in the stylesheet root.

### Local at-rules

Local options are defined via `@tidy` at-rules _inside_ a rule and are scoped to that rule block. Values declared here take precedence over the global at-rules.

<!-- links -->
[wiki]:    https://github.com/goodguyry/postcss-tidy-columns/wiki
[PostCSS]: https://github.com/postcss/postcss
[demo]:    https://goodguyry.github.io/postcss-tidy-columns/

<!-- badges -->
[gh-badge]:  https://github.com/goodguyry/postcss-tidy-columns/actions/workflows/node-tests.yml/badge.svg
[gh-ci]:     https://github.com/goodguyry/postcss-tidy-columns/actions/workflows/node-tests.yml
[npmjs-img]: https://badge.fury.io/js/postcss-tidy-columns.svg
[npmjs]:     https://badge.fury.io/js/postcss-tidy-columns
