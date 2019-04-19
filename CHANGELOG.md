# Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

## 0.4.0

**Added**

- Adds support for configuring different grid specs across multiple breakpoints (#20)
- Adds a `tidy-var()` function for retrieving option values in property values (#27, #32)

**Changed**

- Single offset values in `tidy-column` and `tidy-offset` shorthand properties will now apply to all missing values (#25, #36)

**Fixed**

- Updates dependencies to fix known vulnerabilities (#26)
- `tidy-*` functions nested within a `calc()` function are properly detected and escaped (#34)
- Shorthand properties now accept documented values (#36)

**Removed**

- Removes the `addGap` option for automatically adding the grid gap margin to column elements (#24)

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
