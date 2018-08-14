# PostCSS Tidy Columns [![Build Status][ci-img]][ci]

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

> #### Values
>
> `<number>`  
> The number of columns the element should span.

### Offset Left

The `tidy-offset-left` property specifies the number of columns and adjacent 
column gaps the element's left margin should span.

Offsets use a [`siteMax`](#siteMax) breakpoint, since there's no `max-margin` CSS property.

> #### Syntax
>
> ```css
> tidy-offset-left: 2;
> ```

> #### Values
>
> `<number>`  
> The number of columns the element should be offset from the left edge of the parent element.

### Offset Right

The `tidy-offset-right` property specifies the number of columns and adjacent 
column gaps the element's right margin should span.

Offsets use a [`siteMax`](#siteMax) breakpoint, since there's no `max-margin` CSS property.

> #### Syntax
>
> ```css
> tidy-offset-right: 1;
> ````

> #### Values
>
> `<number>`  
> The number of columns the element should be offset from the right edge of the parent element.

### Column Shorthand  

`tidy-column` is a shorthand property for setting `tidy-offset-left`, 
`tidy-span`, and `tidy-offset-right` in one declaration.

> #### Syntax
>
> ```css
> tidy-column: 3 / span 2 / 4;
> tidy-column: 0 / span 4 / 1; /* could also use `inherit` in place of `0` */
> tidy-column: 1 / span 4;
> ````

> #### Values
>
> `[ <number> | 'inherit' ]`  
> The left offset value.
> 
> `span <number>`  
> The column span value.
> 
> `[ <number> | 'inherit' ]` (optional)  
> The right offset value.

> #### Formal syntax
>
> `[ <number> | 'inherit' ] / span && <number> [ / <number> ]?`

### Offset Shorthand  

`tidy-offset` is a shorthand property for setting `tidy-offset-left` and 
`tidy-offset-right` in one declaration.

> #### Syntax
>
> ```css
> tidy-offset: 3 / 4;
> tidy-offset: 0 / 1; /* could also use `inherit` in place of `0` */
> tidy-offset: 1;
> ````

> #### Values
>
> `[ <number> | 'inherit' ]`  
> The left offset value.
> 
> `/ <number>` (optional)  
> The right offset value.

> #### Formal syntax
>
> `[ <number> | 'inherit' ] [ / <number> ]?`

#### A note about the 'inherit' value

The `inherit` value simply acts as a way to bypass the need to enter a required
value in the shorthand properties. Nothing is actually _inherited_, but I found
using a `0` value, which does the same thing, could potentially be confusing.

## Functions

These functions are provided for incorporating the `tidy-span` and 
`tidy-offset` output without using those properties. These can be used on their
own or nested inside a `calc()` function.

When using these functions, the `siteMax` media query will not be added. Use 
the `tidy-span-full()` and `tidy-offset-full()` functions to set the static 
column and offset widths, respectively.

Use cases include:
* Use the `offset` value on properties other than `margin`; for example, on an 
absolutely-positioned element.
* Use the `span` value properties other than `width` and `max-width`, such as in 
a `translate` function.
* Increase the `span` or `offset` of an element by an arbitrary amount, because 
sometimes designers just do what they want...
* Have more control over the declarations added by Tidy Columns.

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

> #### Formal syntax
>
> `tidy-span( <number> )`  
> `tidy-span-full( <number> )`  
> `calc( tidy-span( <number> ) <calc-sum>)`  
> `calc( tidy-span-full( <number> ) <calc-sum>)`  
> 
> See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/calc#Formal_syntax) 
> for more about the CSS calc() function.  

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

> #### Formal syntax
>
> `tidy-offset( <number> )`  
> `tidy-offset-full( <number> )`  
> `calc( tidy-offset( <number> ) <calc-sum>)`  
> `calc( tidy-offset-full( <number> ) <calc-sum>)`  
> 
> See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/calc#Formal_syntax) 
> for more about the CSS calc() function.  

## Options

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|[`columns`](#columns)|`{Number}`|`12`|The number of columns in your grid.|
|[`gap`](#gap)|`{String}`|`undefined`|The width of column gaps.|
|[`siteMax`](#siteMax)|`{String}`|`undefined`|The max-width of the site.|
|[`edge`](#edge)|`{String}`|`undefined`|The value of the site's edge padding.|
|[`addGap`](#addGap)|`{Boolean}`|`false`|Add a right `gap` margin to column declarations.|

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
> @tidy gap <length>;
> ````

> #### Formal syntax
>
> `<length> [ / <boolean> ]?`
>
> See [`addGap`](#addGap) for more about this syntax.

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

Set `edge` to the value of the space between the content and the edge of the page.

Supports any positive integer of unit [`px`|`em`|`rem`].

> #### CSS Syntax
>
> ```css
> @tidy edge <length>;
> ````

### `addGap`

Declares whether or not to add a right gap margin to the column.

When this is set to `true`, a `:last-of-type` rule will be added to reset the 
`margin-right` to `0` for the last item.

> #### CSS Syntax
>
> ```css
> /* Declared as a boolean value after `gap`; must be preceeded by a slash */
> @tidy gap <length> / <boolean>;
> ````

> #### Formal syntax
>
> `<length> [ / <boolean> ]?`

## Passing options via CSS

As an alternative to the [PostCSS] JavaScript API, options may also be passed 
via stylesheet at-rules. See the above options for the CSS syntax.

### Global options

Global options are defined via `@tidy` rules outside of any selector 
blocks. Values declared here take precedence over the [options](#options) passed 
to Tidy Columns via JavaScript.

### Local options

Local options are defined via `@tidy` rules inside a selector block 
and are scoped to the parent selector. Values declared here take precedence over 
the global options.

<!-- links -->
[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.com/goodguyry/postcss-tidy-columns.svg?branch=master
[ci]:      https://travis-ci.org/goodguyry/postcss-tidy-columns
