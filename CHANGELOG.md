# Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

## Next

**Added**

- `reduce` option for conditionally reducing the `calc()` output using [postcss-calc](https://github.com/postcss/postcss-calc/) (#70, #79)
- `base` option for updating the fluid base value's units – `vw` or `%` (#79)
- Disable an option by setting it to `false` (#80)
- Validates options with `schema-utils` (#87)

**Changed**

- Drops support for PostCSS < 8 (#73)
- Updates dependencies (#72)
- Updates option name: `site-max` and `siteMax` are now `max` (#79)
- Initial support for outputting a single value using a `min()` function, rather than a media query (#79)
- The `max` option can now be set to a `var()` function (#79)
- Properties are deprecated and will be removed in a future version: `tidy-column`, `tidy-offset`, `tidy-span`, `tidy-offset-left`, `tidy-offset-right` (#81)
- `debug` will now print a warning, rather than preserve the declaration as a comment (#83)
- Updates to the `postcss-calc^8.2.4` (#86)

**Removed**

- The `breakpoints` option is no longer suppoerted (#79)
- `tidy-span-full()` and `tidy-offset-full()` are no longer supported (#80)
- The plugin will no longer create a full-width media query, since it now outputs a single value (#80)

## 0.4.0

**Added**

- Support for configuring different grid specs across multiple breakpoints (#20)
- Use the `tidy-var()` function to retrieve option values in declarations (#27, #32)
- Use the `debug` option to maintain the input declaration as a comment (#45, #48)

**Changed**

- Single offset values in `tidy-column` and `tidy-offset` shorthand properties will now apply to all missing values (#25, #36)

**Fixed**

- Updates dependencies to fix known vulnerabilities (#26, #42)
- `tidy-*` functions nested within a `calc()` function are properly detected and escaped (#34)
- Shorthand properties now accept documented values (#36)
- Corrects an issue with unitless non-zero config values not being ignored (#39)

**Removed**

- The `addGap` option for automatically adding the grid gap margin to column elements (#24)
- Support for Node 6 (#41)

## 0.3.4

**Fixed**

- Fixes an issue where only the first of multiple `tidy-` functions in the same declaration value was being processed (#22)

## 0.3.3

**Changed**

- Source map fixtures.

**Fixed**

- Fixes a JavaScript error when `tidy-` functions were used with no `siteMax` option value (#18)
- Improves handling of missing, zero, or invalid option values (#16)

## 0.3.2

**Fixed**

- Fixes an issue in the way Tidy Columns cloned nodes (#12)

## 0.3.1

**Changed**

- Updates tests and documentation (#10, #11)

## 0.3.0

**Changed**

- `inherit` no longer supported in shorthand properties; use `none` instead (#9)

## 0.2.3

**Fixed**

- Fixes issues with source mapping (#7)
- Corrects `tidy-column` shorthand replacement for third `offset-right` property (#6)

## 0.2.2

**Fixed**

- Corrects `tidy-column` shorthand matching and replacement (#5)

## 0.2.1

**Removed**

- Removes unused dependency (`object-assign`) (#4)

## 0.2.0

**Added**

- Adds support for CSS Custom Properties in `@tidy` rule values (#3)

## 0.1.1

**Fixed**

- Locally-scoped options not longer pollute global options (#2)

## 0.1

- Initial release
