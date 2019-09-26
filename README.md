# Tidy Columns [![Build Status][ci-img]][ci] [![npm version][npmjs-img]][npmjs]

[PostCSS] plugin to manage column alignment.

Tidy Columns sets widths and margins, based on a user-defined configuration, with the goal that any elements along the vertical axis that should be aligned, are. 

**This plugin will not set layout for you. Layout is *your* job**.

See the [demo page][demo] to see it in action, and check out the [Wiki][wiki] for more about configuring the plugin.

## Install

```shell
npm install postcss-tidy-columns
```

## Example

```js
require('postcss-tidy-columns')({
  columns: 12,
  gap: '1.25rem',
  edge: '2rem',
  siteMax: '90rem',
});
```

```css
/* Input example, using the above plugins options */
div {
  tidy-span: 3;
  tidy-offset-left: 2;
}
```

```css
/* Output example */
div {
  width: calc((((100vw - 2rem * 2) / 12 - 1.1458rem) * 3) + 1.25rem * 2);
  max-width: calc((((90rem - 2rem * 2) / 12 - 1.1458rem) * 3) + 1.25rem * 2);
  margin-left: calc((((100vw - 2rem * 2) / 12 - 1.1458rem) * 2) + 1.25rem * 2);
}

@media (min-width: 90rem) {
  div {
    margin-left: calc((((90rem - 2rem * 2) / 12 - 1.1458rem) * 2) + 1.25rem * 2);
  }
}
```

## Usage

```js
postcss([ require('postcss-tidy-columns') ]);
```

See [PostCSS] docs for examples for your environment.

## Contents

* [Tidy Properties](#tidy-properties)
* [Tidy Functions](#tidy-functions)
* [!tidy Rule](#tidy-rule)
* [Options](#options)
* [Options Cascade](#options-cascade)
* [Using CSS Custom Properties in setting values](#using-css-custom-properties-in-setting-values)

See the [Wiki][wiki] for additional documentation and tips.

## Tidy Properties

### Span

The `tidy-span` property specifies the number of columns and adjacent column gaps the element should span. Supports positive integer and decimal values.

> #### Syntax
>
> ```
> tidy-span: <number>;
> ```

### Offsets

The `tidy-offset-left` and `tidy-offset-right` properties specify the number of columns and adjacent column gaps the element's margin should span. Supports positive and negative integer and decimal values

Offsets use a [`siteMax`](#sitemax) breakpoint, since there's no `max-margin` CSS property.

> #### Syntax
>
> ```
> tidy-offset-left: <number>;
> tidy-offset-right: <number>;
> ```

### Column Shorthand  

`tidy-column` is a shorthand property for setting `tidy-offset-left`, `tidy-span`, and `tidy-offset-right` in one declaration.

Use `none` to bypass a required value. A single offset value applies to both `left` and `right`.

> #### Syntax
>
> ```
> [ <number> | none ] / span && <number> [ / <number> ]?
> ```
>
> ```
> tidy-column: 3 / span 2 / 4;
> tidy-column: none / span 4 / 1;
> tidy-column: 1 / span 4;
> ```

### Offset Shorthand  

`tidy-offset` is a shorthand property for setting `tidy-offset-left` and `tidy-offset-right` in one declaration.

Use `none` to bypass a required value. A single value applies to both `left` and `right`.

> #### Syntax
>
> ```
>  [ <number> | none ] [ / <number> ]? */
> ```
>
> ```
> tidy-offset: 3 / 4;
> tidy-offset: none / 1;
> tidy-offset: 1;
> ```

## Tidy Functions

These functions are provided for incorporating the `tidy-` properties' output without using the properties themselves. These can be used on their own or nested inside a `calc()` function, and allow for more control over the declarations added by the plugin.

**Unlike the above _properties_, these functions only output one value:**
* `tidy-[offset|span]()` outputs the fluid value
* `tidy-[offset|span]-full()` outputs the static value, based on the `siteMax` in the configuration.

Be sure to use the function most appropriate for your use-case. Typically, this means redeclaring the the `-full` version of the function in the breakpoint at which the site becomes static width. 

**TIP:** For any function declarations that should stay the same across breakpoint configurations, or simply to redclare the `-full` version of a function, append the declaration with `!tidy` to signal to the plugin to handle duplicating the declaration.

### Span Function

`tidy-span()` and `tidy-span-full()` functions return the `span` property's `calc()` declaration for use in assigning widths.

> #### Syntax
>
> ```css
> /* property: tidy-span(number) */
> /* property: calc(tidy-span(number) expression) */
>
> div {
>   width: calc(tidy-span(3) + 4rem);
> }
>
> @media (min-width: 75rem) {
>   div {
>     width: calc(tidy-span-full(3) + 4rem);
>   }
> }
> ```

### Offset Function

`tidy-offset()` and `tidy-offset-full()` functions return the `offset` property's `calc()` declaration for use in positioning.

> #### Syntax
>
> ```css
> /* property: tidy-offset(number) */
> /* property: calc(tidy-offset(number) expression) */
>
> div {
>   left: calc(tidy-offset(1) + 2rem);
> }
>
> @media (min-width: 75rem) {
>   div {
>     left: calc(tidy-offset-full(1) + 2rem);
>   }
> }
> ```

### Var Function

`tidy-var()` function returns the specified option value.

> #### Syntax
>
> ```css
> /* property: tidy-var(string) */
>
> div {
>   margin-left: tidy-var(gap);
>   width: calc(tidy-var(siteMax) + tidy-var(edge) * 2);
> }
> ```

## `!tidy` Rule

`!tidy` signifies that a declaration should cascade through configured 
breakpoint changes.

> #### Example
>
> Assuming one '64rem' breakpoint change configured...
>
> ```css
>
> /* Input: */
> div {
>   tidy-span: 3 !tidy;
> }
>
> /* Output: */
> div {
>   tidy-span: 3;
> }
>
> @media (min-width: 64rem) {
>   div {
>     tidy-span: 3;
>   }
> }
> ```

## Options

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|[`columns`](#columns)|`{Number}`|`undefined`|The number of grid columns.|
|[`gap`](#gap)|`{String}`|`undefined`|The width of grid column gaps.|
|[`siteMax`](#siteMax)|`{String}`|`undefined`|The max-width of the site.|
|[`edge`](#edge)|`{String}`|`undefined`|The value of the site's edge padding.|
|[`debug`](#debug)|`{Boolean}`|`false`|Add debug comments.|
|[`breakpoints`](#breakpoints)|`{Object}`|`{}`|Breakpoint-specific configuration options.|

_As an alternative to the [PostCSS] JavaScript API, some options may also be passed via stylesheet `@tidy` at-rules._

### `columns`

Declares the number of columns in your design. Supports any positive integer.

> #### CSS Syntax
>
> ```
> @tidy columns <number>;
> ```

### `gap`

Declares the width of the gap between each column. Supports any positive integer of unit [`px`|`em`|`rem`].

> #### CSS Syntax
>
> ```
> @tidy gap <length>;
> ```

### `siteMax`

Declares the max-width of the site, at which point the site transitions from fluid width to static width. Setting a `siteMax` value ensures the column and margin widths are correct once the site width is static.

Supports any positive integer of unit [`px`|`em`|`rem`].

> #### CSS Syntax
>
> ```
> @tidy site-max <length>;
> ```
> 
> Alternatively, use the camelCased JavaScript property.
> ```
> @tidy siteMax <length>;
> ```

### `edge`

Set `edge` to the non-cumulative value of the space between the content and the edge of the page.

Supports any positive integer of unit [`px`|`em`|`rem`].

> #### CSS Syntax
>
> ```
> @tidy edge <length>;
> ```

### `debug`

Set `debug` to `true` to maintain the pre-processed CSS declaration as a comment.

```css
div {
  /* tidy-span: 3 */
  width: calc((((100vw - 2rem * 2) / 12 - 1.1458rem) * 3) + 1.25rem * 2);
  max-width: calc((((90rem - 2rem * 2) / 12 - 1.1458rem) * 3) + 1.25rem * 2);
}
```

> #### CSS Syntax
>
> ```
> @tidy debug <boolean>;
> ```

### `breakpoints`

Use the `breakpoints` object to define a grid configuration that will change based on screen size.

1. Define the small-screen grid in the root object.
2. Define one or more `min-width` breakpoints at which the grid spec will change, and any configuration options that will change.
4. The configuration settings cascade up from the root to the largest `breakpoint`.

```js
require('postcss-tidy-columns')({
  columns: 9,
  edge: '1rem',
  gap: '0.625rem',
  breakpoints: {
    '48rem': {
      columns: 12,
      gap: '1rem'
    },
    '64rem': {
      edge: '1.25rem',
      siteMax: '90rem'
    }
  },
});
```

See the [Scoped Settings](https://github.com/goodguyry/postcss-tidy-columns/wiki/Scoped-Settings) Wiki page for more.

## Options Cascade

### Plugin options

Options passed directly to the plugin via the PostCSS JavaScript API.

### Global at-rules

Global options are defined via `@tidy` at-rules _outside_ of any selector blocks. Values declared here take precedence over those passed via the plugin options.

### Local at-rules

Local options are defined via `@tidy` at-rules _inside_ a selector block and are scoped to that rule block. Values declared here take precedence over the global at-rules.

## Using CSS Custom Properties

[CSS Custom Proprties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) are 
supported in `@tidy` rules, with the following caveat:

1. Due to the nature of CSS Custom Properties, particularly the inability to use them in media query parmeters, a CSS Custom Property used as the `@tidy site-max` value will throw an error.

See the [Tips and Tricks](https://github.com/goodguyry/postcss-tidy-columns/wiki/Tips-and-Tricks) Wiki page for more.

<!-- links -->
[wiki]: https://github.com/goodguyry/postcss-tidy-columns/wiki
[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.com/goodguyry/postcss-tidy-columns.svg?branch=master
[ci]:      https://travis-ci.org/goodguyry/postcss-tidy-columns
[npmjs-img]: https://badge.fury.io/js/postcss-tidy-columns.svg
[npmjs]: https://badge.fury.io/js/postcss-tidy-columns
[demo]: https://goodguyry.github.io/postcss-tidy-columns/
