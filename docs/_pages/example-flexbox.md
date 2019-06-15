---
layout: page
title: Tidy Columns Flexbox Example
description: This page demonstrates incorporating Tidy Columns into your flexbox layout.
hero-caption: On desktop, this image caption is nestled alongside the absolutely-positioned title wrapper.
permalink: /
display: flexbox
---

{% include intro.md %}

On desktop, the title holder in the article header above is absolutely-positioned, which means it's out of document flow, so the image caption can't naturally sit next to it. We can, however, use Tidy Columns to add a left offset to the image caption that makes it appear to be nestled alongside the title holder.

---

{% include figure-small.html %}

The width of the elements within this content area are set using Tidy Columns. The content area itself is six columns wide and one column left of center. This creates a scenario where the floated image should align with the edge of the title holder in the article header. Tidy Columns makes it dead simple to keep elements aligned down the page.

The design calls for floated images to be three-columns wide and be pulled exactly one column outside of the content parent. Using a negative right offset we can ensure disconnect elements are vertically aligned.

{% include figure-wide.html caption="This image caption is absolutely-positioned and right-aligned with a column outside the content area." %}

The full-width image above should max out at the site’s max-width. Using Tidy Columns to pull the image in-line with the edge of the site means no more magic numbers, or fudging with the developer tools. This demonstrates the following features:

- Using a negative value for with `tidy-offset`
- Using Tidy Columns functions within a css `calc()` function
- Using `tidy-var()` to retrieve a configuration value

Just for kicks, the content in the site footer should align halfway through the second column. This demonstrates the ability to span and offset by a fraction of a column.
