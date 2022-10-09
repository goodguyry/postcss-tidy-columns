---
layout: page
title: Example Page
permalink: /
---

{% include intro.html %}

{% include figure-small.html %}

The width of the elements within this content area are set using Tidy Columns. The content area itself is six columns wide and one column left of center.

The design calls for floated images to be three-columns wide and be pulled exactly one column outside of the content parent to align with the article header. Using a negative right offset we can ensure disconnected elements remain vertically aligned. 

Tidy Columns makes it dead simple to maintain alignment and spacing of elements down the page.

{% include figure-wide.html caption="This image caption is absolutely-positioned and right-aligned with a column outside the content area." %}

The full-width image above should max out at the site’s max-width. Using Tidy Columns to pull the image in-line with the edge of the site means no more magic numbers, or fudging with the developer tools. This demonstrates the following features:

- Using a negative value for with `tidy-offset`
- Using Tidy Columns functions within a css `calc()` function
- Using `tidy-var()` to retrieve a configuration value

Just for kicks, the content in the site footer should align halfway through the second column. This demonstrates the ability to span and offset by a fraction of a column.
