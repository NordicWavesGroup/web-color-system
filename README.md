# NWG Website Colors

Interactive color reference for the Nordic Waves Group website. This palette is website-specific, not a shared standard for all NWG applications.

## Features

- 28 colors with hex codes, swatches, and copy controls.
- Text/background examples and a contrast explorer offering only WCAG AA combinations for normal text (at least 4.5:1).
- Suggested gradients with readable text and minimum contrast ratios.
- A separate, simplified color definitions page.
- League Spartan headings and Nunito body text, loaded through Google Fonts with system fallbacks.

## Use

Open [index.html](index.html) in a browser for the full guide, or [colors.html](colors.html) for color definitions only. No installation or build step is needed.

Edit [colors.js](colors.js) to update the shared palette. Page styling lives in [styles.css](styles.css), and contrast calculations and examples are in [palette.js](palette.js).

## Publish

Upload the two HTML files, two JavaScript files, and stylesheet to the repository root. In GitHub, select **Settings > Pages > Deploy from a branch**, then choose **main** and **/ (root)**.

Both pages include `noindex` directives to discourage search indexing. Do not block crawlers from reading these directives. This is not access control: the published site remains public unless separately protected.
