---
layout: page
title: Tidy Columns Grid Example
description: This page demonstrates use-cases for PostCSS Tidy Columns within a Grid layout.
permalink: /grid-layout/
display: grid
---

{% include intro.md %}

Grid Layout offers so many benefits to traditional layout methods that one might assume a tool like Tidy Columns isn't necessary. And while I'd agree it's not _necessary_, Tidy Columns can fill in the gaps on some missing features of Grid Layout, as demonstrated below.

Along with Grid Layout, this page demonstrates using CSS Custom Properties to configure Tidy Columns. Using `@tidy` rules we can configure the plugin to automatically respond to grid configuration changes across breakpoints.

We're using the same Grid declarations for the `article` and `article-header__figure` as a means of keeping things aligned. This also exposes a limitation of Tidy Columns: it can only be configured for even-width, evenly-spaced columns.

---

{% include figure-small.html %}

The content area itself is six columns wide and one column left of center. This creates a scenario where the floated image should align with the edge of the title holder in the article header. Tidy Columns makes it dead simple to keep elements aligned down the page.

The design calls for floated images to be three-columns wide and be pulled exactly one column outside of the content parent. This is currently impossible with Grid Layout alone. Though there are workarounds, some of them can cause a whole host of additional issues and complications. Using Tidy Columns to add a negative right offset we can move an element out of the Grid parent while maintaining vertical alignment of the page elements.

{% include figure-wide.html caption="This image caption is absolutely-positioned and right-aligned with a column outside the content area." %}

The full-width image above should max out at the site’s max-width. Using Tidy Columns to pull the image in-line with the edge of the site means no more magic numbers, fudging with the developer tools, or worrying about composing unnatural markup to work within Grid Layout's limitations. This demonstrates the following features:

- Using a negative value for with `tidy-offset`
- Using Tidy Columns functions within a CSS `calc()` function
- Using `tidy-var()` to retrieve a configuration value

Just for kicks, the content in the site footer should align halfway through the second column. This demonstrates the ability to span and offset by a fraction of a column, which is impossible with Grid Layout alone.
