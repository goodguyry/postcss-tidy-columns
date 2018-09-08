# PostCSS Tidy Columns [![Build Status][ci-img]][ci] [![npm version][npmjs-img]][npmjs]

[PostCSS] plugin to manage column alignment.

PostCSS Tidy Columns sets an element's width and margins independent of the 
width of its parent, allowing for easy vertical alignment of elements. It does 
this by calculating the width based on `vw` units and sets the `max-width` using 
static values based on the site's maximum width.

**PostCSS Tidy Columns does not set layout. Positioning elements is *your* job**.

## Install

```shell
npm install postcss-tidy-columns
```

## Example

```css
/* Input example */
@tidy columns 12;
@tidy gap 1.25rem;
@tidy edge 2rem;
@tidy site-max 90rem;

div {
	tidy-span: 3;
	tidy-offset: 2;
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
postcss([ require('postcss-tidy-columns') ])
```

See [PostCSS] docs for examples for your environment.

## Properties

### Span

The `tidy-span` property specifies the number of columns and adjacent column 
gaps (if any) the element should span.

> #### Syntax
>
> ```css
> tidy-span: 4;
> ```

### Offset Left

The `tidy-offset-left` property specifies the number of columns and adjacent 
column gaps the element's left margin should span.

Offsets use a [`siteMax`](#siteMax) breakpoint, since there's no `max-margin` CSS property.

> #### Syntax
>
> ```css
> tidy-offset-left: 2;
> ```

### Offset Right

The `tidy-offset-right` property specifies the number of columns and adjacent 
column gaps the element's right margin should span.

Offsets use a [`siteMax`](#siteMax) breakpoint, since there's no `max-margin` CSS property.

> #### Syntax
>
> ```css
> tidy-offset-right: 1;
> ````

### Column Shorthand  

`tidy-column` is a shorthand property for setting `tidy-offset-left`, 
`tidy-span`, and `tidy-offset-right` in one declaration.

Use `none` to bypass a required value.

> #### Syntax
>
> ```css
> /* [ <number> | none ] / span && <number> [ / <number> ]? */
>
> tidy-column: 3 / span 2 / 4;
> tidy-column: none / span 4 / 1;
> tidy-column: 1 / span 4;
> ````

### Offset Shorthand  

`tidy-offset` is a shorthand property for setting `tidy-offset-left` and 
`tidy-offset-right` in one declaration.

Use `none` to bypass a required value.

> #### Syntax
>
> ```css
> /* [ <number> | none ] [ / <number> ]? */
>
> tidy-offset: 3 / 4;
> tidy-offset: none / 1;
> tidy-offset: 1;
> ````

## Functions

These functions are provided for incorporating the `tidy-` properties' output 
without using the properties. These can be used on their own or nested inside 
a `calc()` function, and allow more control over the declarations added by the
plugin.

When using these functions, **the `siteMax` media query will not be added**. Use 
the `tidy-span-full()` and `tidy-offset-full()` functions to set the static `span` 
and `offset` widths, respectively.

### Span Function

`tidy-span()` and `tidy-span-full()` functions return the `span` property's 
`calc()` declaration for use in assigning widths.

> #### Syntax
>
> ```css
> /* property: tidy-span(number) */
> /* property: calc(tidy-span(number) expression) */
>
> div {
> 	width: calc(tidy-span(3) + 4rem);
> }
>
> @media (min-width: 75rem) {
> 	div {
> 		width: calc(tidy-span-full(3) + 4rem);
> 	}
> }
> ````

### Offset Function

`tidy-offset()` and `tidy-offset-full()` functions return the `offset` 
property's `calc()` declaration for use in positioning.

> #### Syntax
>
> ```css
> /* property: tidy-offset(number) */
> /* property: calc(tidy-offset(number) expression) */
>
> div {
> 	left: calc(tidy-offset(1) + 2rem);
> }
>
> @media (min-width: 75rem) {
> 	div {
> 		left: calc(tidy-offset-full(1) + 2rem);
> 	}
> }
> ````

## Options

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|[`columns`](#columns)|`{Number}`|`12`|The number of columns in your grid.|
|[`gap`](#gap)|`{String}`|`undefined`|The width of column gaps.|
|[`siteMax`](#siteMax)|`{String}`|`undefined`|The max-width of the site.|
|[`edge`](#edge)|`{String}`|`undefined`|The value of the site's edge padding.|
|[`addGap`](#addGap)|`{Boolean}`|`false`|Add a right `gap` margin to column declarations.|

_As an alternative to the [PostCSS] JavaScript API, options may also be passed 
via stylesheet `@tidy` at-rules._

### `columns`

Declares the number of columns in your design. Supports any positive integer.

> #### CSS Syntax
>
> ```css
> @tidy columns <number>;
> ````

### `gap`

Declares the width of the gap between each column. Supports any positive integer 
of unit [`px`|`em`|`rem`].

> #### CSS Syntax
>
> ```css
> @tidy gap <length> [ / <boolean> ]?;
> ````

See [`addGap`](#addGap) for more about the CSS syntax.

### `siteMax`

Declares the max-width of the site, at which point the site transitions from 
fluid width to static width. Setting a `siteMax` value ensures the column and 
margin widths are correct once the site no longer spans the full viewport width.

Supports any positive integer of unit [`px`|`em`|`rem`].

> #### CSS Syntax
>
> ```css
> @tidy site-max <length>;
>
> /* Alternatively use the camelCased JavaScript property */
> @tidy siteMax <length>;
> ````

### `edge`

Set `edge` to the non-cumulative value of the space between the content and the 
edge of the page.

Supports any positive integer of unit [`px`|`em`|`rem`].

> #### CSS Syntax
>
> ```css
> @tidy edge <length>;
> ````

### `addGap`

Declares whether or not to add a gap-wide `margin-right` to the columns.

When this is set to `true`, a `:last-of-type` rule will be added to reset the 
`margin-right` to `0` for the last item.

> #### CSS Syntax
>
> ```css
> /**
>  * Declared as a boolean value after the `gap` value.
>  * Must be preceeded by a slash.
>  */
> @tidy gap <length> / <boolean>;
> ````

## Options Cascade

### Plugin options

Options passed directly to the plugin via the PostCSS JavaScript API.

### Global at-rules

Global options are defined via `@tidy` at-rules outside of any selector 
blocks. Values declared here take precedence over the passed via the plugin 
options.

### Local at-rules

Local options are defined via `@tidy` at-rules inside a selector block and are 
scoped to that rule block. Values declared here take precedence over the global 
at-rules.

## Using CSS Custom Properties in setting values

[CSS Custom Proprties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) are 
supported in `@tidy` rules, with the following caveats:

1. Due to the nature of CSS Custom Properties, particularly the inability to use
them in media query parmeters, a CSS Custom Property used as the `@tidy site-max`
value will throw an error.
2. The `@tidy gap` custom property value must only contain its length, and not its
boolean `addGap` portion of the [gap shorthand](#addgap).

Example:

```css
:root {
	--columns: 16;
	--gap: 0.625rem;
	--edge: 1.25;
}

@media (min-width: 75rem) {
	:root {
		--gap: 1rem;
		--edge: 2rem;
	}
}

@tidy columns var(--columns);
@tidy gap var(--gap) / true;
@tidy edge var(--edge);
@tidy site-max 75rem;
```

<!-- links -->
[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.com/goodguyry/postcss-tidy-columns.svg?branch=master
[ci]:      https://travis-ci.org/goodguyry/postcss-tidy-columns
[npmjs-img]: https://badge.fury.io/js/postcss-tidy-columns.svg
[npmjs]: https://badge.fury.io/js/postcss-tidy-columns
