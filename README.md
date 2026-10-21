# NWG Website Colors

Interactive color reference for the Nordic Waves Group website. This palette is website-specific, not a shared standard for all NWG applications.

## Features

- 35 colors with hex codes, swatches, and copy controls.
- Text/background examples and a contrast explorer offering only WCAG AA combinations for normal text (at least 4.5:1).
- Suggested gradients with readable text and minimum contrast ratios.
- A separate, simplified color definitions page.
- League Spartan headings and Nunito body text, loaded through Google Fonts with system fallbacks.

## Use

Open [index.html](index.html) in a browser for the full guide, or [colors.html](colors.html) for color definitions only. No installation or build step is needed.

Edit [colors.js](colors.js) to update the shared palette. Page styling lives in [styles.css](styles.css), and contrast calculations and examples are in [palette.js](palette.js).

Tints are generated as 80%, 60%, and 40% of each source color over pure white using sRGB channel blending, rounded to the nearest integer. Families follow the foundation order: Ocean Depth, Forest Green, Sky Mist, Sage, and Stone. Foundation colors are unchanged; Pebble has no tint family.

Ocean Depth leads the website identity; Forest Green supports actions. Deep Pine and Muted Teal are the descriptive names for the former Primary hover and Secondary hover colors; their hex values are unchanged.

The full guide includes preferred text and UI pairings, button states, neutral borders, labeled status-message examples, and optional accent roles. Deep current is the signature gradient; Quiet horizon is the default light gradient. The other gradients are alternatives.

Status colors use muted evergreen, ochre, clay red, and ocean blue. Their pale backgrounds are individually balanced near Pebble, not percentage tints, and use Stone text. Coral, Soft Blue, and Lavender are subdued supporting accents. Sea Glass is the pale green-gray accent formerly named Sand; its hex value is unchanged.

## Publish

Upload the two HTML files, two JavaScript files, and stylesheet to the repository root. In GitHub, select **Settings > Pages > Deploy from a branch**, then choose **main** and **/ (root)**.

Both pages include `noindex` directives to discourage search indexing. Do not block crawlers from reading these directives. This is not access control: the published site remains public unless separately protected.
