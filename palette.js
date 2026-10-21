"use strict";

function luminance(hex) {
  const channels = hex.slice(1).match(/.{2}/g).map(value => {
    const channel = parseInt(value, 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const explorerColors = colors.filter(color =>
  color.group !== "Status backgrounds" && color.name !== "Success" && color.name !== "Info");

function partners(background) {
  return explorerColors.filter(color => contrast(background.hex, color.hex) >= 4.5);
}

const findColor = name => colors.find(color => color.name === name);
function pairRatio(foreground, background, minimum = 4.5) {
  const ratio = contrast(findColor(foreground).hex, findColor(background).hex);
  if (ratio < minimum) throw new Error(`Recipe fails ${minimum}:1 contrast: ${foreground} on ${background}`);
  return ratio.toFixed(2) + ":1";
}

function colorCard(color) {
  return `<article class="color-card" data-group="${color.group}">
    <div class="color-swatch${color.outline ? " color-swatch-outlined" : ""}" style="background-color:${color.hex}" aria-hidden="true"></div>
    ${color.family ? `<h5>${color.name}</h5>` : `<h3>${color.name}</h3>`}
    ${color.description ? `<p class="color-description">${color.description}</p>` : ""}
    <button type="button" class="hex-copy" data-hex="${color.hex}" aria-label="Copy ${color.name} hex code ${color.hex}"><span class="hex-value">${color.hex}</span><span class="copy-icon" aria-hidden="true">⧉</span></button>
  </article>`;
}

document.querySelector("#core-colors").innerHTML = colors.filter(color => color.group === "Core").map(colorCard).join("");
document.querySelector("#support-colors").innerHTML = [...new Set(colors.filter(color => color.group !== "Core").map(color => color.group))]
  .map(group => `<section class="support-group"><h3>${group}</h3>${colorRows(group).map(row =>
    `<div class="color-family">${row.name ? `<h4>${row.name}</h4>` : ""}<div class="swatch-grid${row.name ? " tint-grid" : ""}">${row.colors.map(colorCard).join("")}</div></div>`).join("")}</section>`).join("")
  + `<section class="support-guidance" aria-labelledby="usage-title">
    <h3 id="usage-title">Usage & accessibility</h3>
    <section><h4>Foundation roles</h4>
      <p>Lead with Ocean Depth, use Forest Green for actions, and let neutrals carry everyday content. Other colors support this hierarchy.</p>
      <dl>${foundationColors.map(color => `<div><dt>${color.name}</dt><dd>${color.role}</dd></div>`).join("")}</dl>
    </section>
    <section><h4>Reading tint percentages</h4>
      <p>80% means 80% source color mixed with 20% white (#FFFFFF). Lower percentages are lighter. Use the hex codes at full opacity. Tints are not automatically safe text colors; use the pairings below or check the explorer.</p>
    </section>
    <section><h4>Preferred text & surfaces</h4>
      <dl>
        <div><dt>Body text</dt><dd>Stone on Pebble (${pairRatio("Stone", "Pebble")}).</dd></div>
        <div><dt>Headings</dt><dd>Ocean Depth on Pebble (${pairRatio("Ocean Depth", "Pebble")}) or Sky Mist (${pairRatio("Ocean Depth", "Sky Mist")}).</dd></div>
        <div><dt>Dark sections</dt><dd>Pebble on Ocean Depth (${pairRatio("Pebble", "Ocean Depth")}).</dd></div>
        <div><dt>Secondary text</dt><dd>Stone 80% on Pebble (${pairRatio("Stone 80%", "Pebble")}).</dd></div>
        <div><dt>Input borders</dt><dd>Stone 60% against Pebble (${pairRatio("Stone 60%", "Pebble", 3)}). This meets the 3:1 non-text target, not the 4.5:1 body-text target.</dd></div>
        <div><dt>Subtle dividers</dt><dd>Stone 40% on Pebble for decoration only, not essential input boundaries or text.</dd></div>
        <div><dt>Disabled controls</dt><dd>Keep labels legible with Stone 80% on Pebble. Use the control's disabled semantics and remove hover styling; do not fade the entire control with opacity.</dd></div>
      </dl>
    </section>
    <section><h4>Buttons & links</h4>
      <dl>
        <div><dt>Primary button</dt><dd>Forest Green with Pebble text (${pairRatio("Pebble", "Forest Green")}). On hover, use Deep Pine with the same text (${pairRatio("Pebble", "Deep Pine")}).</dd></div>
        <div><dt>Secondary button</dt><dd>Muted Teal outline and text on Pebble. On hover, fill with Muted Teal and switch the text to Pebble. Both states give ${pairRatio("Muted Teal", "Pebble")} contrast.</dd></div>
        <div><dt>Sage limitation</dt><dd>Pebble text (3.73:1) and Stone text (3.19:1) on Sage fail AA for normal text. Use Sage for decorative surfaces, not these button-label pairings.</dd></div>
        <div><dt>Inline links</dt><dd>On Pebble, use underlined Ocean Depth or Forest Green.</dd></div>
      </dl>
      <p>Deep Pine and Muted Teal name colors; hover is their recommended role here. Selected and focus states still need distinct indicators.</p>
    </section>
    <section><h4>Keyboard focus</h4>
      <p>Use an offset Ocean Depth focus ring on light surfaces and Sky Mist on Ocean Depth or Stone. Avoid Sky Mist on Pebble: its 1.70:1 contrast is below the 3:1 target.</p>
    </section>
    <section><h4>Why muted supporting colors?</h4>
      <p>Muted greens and blues echo the forest and ocean foundation, while ochre, clay, and gray-lilac add contrast without competing with it. Brighter colors would pull attention away from the content and primary actions. Near-neutral status backgrounds keep messages recognizable without introducing vivid pastel panels; labels and readable text provide clarity, not saturation alone.</p>
    </section>
    <section><h4>Status messages</h4>
      <p>Muted evergreen, ochre, clay red, and ocean blue signal status. Their pale backgrounds are individually balanced near Pebble, not percentage tints. Use Stone text, an explicit label, and a matching border; do not rely on color alone.</p>
      <div id="status-examples" class="status-grid"></div>
    </section>
    <section><h4>Optional accents</h4>
      <dl>
        <div><dt>Sea Glass</dt><dd>Pale green-gray supporting backgrounds.</dd></div>
        <div><dt>Coral</dt><dd>Muted terracotta-pink for occasional editorial highlights or illustrations.</dd></div>
        <div><dt>Soft Blue</dt><dd>Dusty blue for supporting illustrations and decorative details.</dd></div>
        <div><dt>Lavender</dt><dd>Gray-lilac for occasional illustration details, not routine UI.</dd></div>
      </dl>
      <p>Use accents sparingly, not as additional brand pillars. Check contrast before adding text.</p>
    </section>
  </section>`;
document.querySelector("#support-color-count").textContent = `${colors.filter(color => color.group !== "Core").length} additional colors`;

const statusExamples = [
  { status: "Success", background: "Success background", message: "Your changes have been saved." },
  { status: "Warning", background: "Warning background", message: "Review your details before continuing." },
  { status: "Error", background: "Error background", message: "We could not save your changes. Try again." },
  { status: "Info", background: "Info background", message: "Your progress is saved automatically." },
];
document.querySelector("#status-examples").innerHTML = statusExamples.map(example =>
  `<article class="status-example" style="background-color:${findColor(example.background).hex};border-left-color:${findColor(example.status).hex};color:${findColor("Stone").hex}">
    <h5>${example.status}</h5><p>${example.message}</p>
    <p class="status-recipe">Stone on ${example.background} · ${pairRatio("Stone", example.background)}<br>${example.status} border</p>
  </article>`).join("");

const examples = [
  { background: "Ocean Depth", foreground: "Pebble", label: "OUR OCEAN FOUNDATION", title: "Ideas worth<br>diving into.", text: "Our signature deep blue with a soft, light foreground. A confident foundation for Nordic Waves Group introductions and feature sections." },
  { background: "Sky Mist", foreground: "Ocean Depth", label: "ROOM TO BREATHE", title: "A little clarity<br>goes a long way.", text: "Ocean Depth text on an open, airy blue surface. Give longer stories and useful information space to shine." },
  { background: "Ocean Depth 80%", foreground: "Pebble", label: "A SOFTER KIND OF DEPTH", title: "New horizons.<br>Same clear purpose.", text: "A lighter ocean tone that keeps the blue identity front and center. Pair with Pebble for readable supporting panels." },
  { background: "Sky Mist 40%", foreground: "Ocean Depth", label: "LIGHT ON THE HORIZON", title: "Clear skies.<br>Fresh perspectives.", text: "A barely-there blue with Ocean Depth lettering. A quiet alternative to a neutral background for everyday reading." },
  { background: "Forest Green", foreground: "Pebble", label: "ROOTED IN NATURE", title: "Small steps.<br>Lasting change.", text: "Rich forest green with a soft, light foreground. A grounded companion to the ocean blues for important messages and sustainability stories." },
  { background: "Sea Glass", foreground: "Forest Green", label: "A NATURAL COMPLEMENT", title: "Space to grow.<br>Room to connect.", text: "Forest Green lettering on a gentle, green-gray neutral. A welcoming combination for supporting content and quieter moments." },
  { background: "Stone", foreground: "Sky Mist", label: "BLUE AFTER DARK", title: "Less noise.<br>More meaning.", text: "Light Sky Mist lettering on a deep Stone background. A cool, readable blue accent for focused statements and understated panels." },
  { background: "Pebble", foreground: "Ocean Depth", label: "THE EVERYDAY FOUNDATION", title: "Simple. Clear.<br>Easy to read.", text: "Ocean Depth lettering on a soft Pebble background. A dependable dark-blue pairing for longer articles and practical information." },
  { background: "Stone", foreground: "Sage 40%", label: "GREEN AFTER DARK", title: "A softer light.<br>A natural voice.", text: "A pale sage foreground brings a gentle green accent to Stone. Use for readable messages on a dark, neutral surface." },
  { background: "Pebble", foreground: "Forest Green", label: "A GROUNDED EVERYDAY", title: "Fresh thinking.<br>Solid foundations.", text: "Dark Forest Green text brings a natural tone to Pebble. A calm alternative to blue for everyday reading and supporting information." },
];

document.querySelector("#example-grid").innerHTML = examples.map(example => {
  const background = findColor(example.background);
  const foreground = findColor(example.foreground);
  const ratio = contrast(background.hex, foreground.hex);
  if (ratio < 4.5) throw new Error(`Example fails AA: ${foreground.name} on ${background.name}`);
  return `<article class="example-card">
    <div class="example-content" style="background-color:${background.hex};color:${foreground.hex}">
      <p class="eyebrow">${example.label}</p><h3>${example.title}</h3><p>${example.text}</p>
    </div>
    <div class="example-meta"><span>${foreground.name} on ${background.name}<small>${foreground.hex} / ${background.hex}</small></span><span class="badge">${ratio.toFixed(2)}:1 · ${ratio >= 7 ? "AAA" : "AA"}</span></div>
  </article>`;
}).join("");

const gradients = [
  { name: "Deep current", use: "SIGNATURE / HERO & BRAND SECTIONS", start: "Ocean Depth", end: "Ocean Depth 80%", foreground: "Pebble", text: "The preferred brand gradient. Use for a key introduction or feature, not every section." },
  { name: "Quiet horizon", use: "DEFAULT LIGHT / CONTENT SECTIONS", start: "Sky Mist 40%", end: "Pebble", foreground: "Ocean Depth", text: "The preferred light gradient. Use for quiet content backgrounds and spacious reading sections." },
  { name: "Forest light", use: "ALTERNATIVE / NATURE-LED FEATURES", start: "Deep Pine", end: "Muted Teal", foreground: "Pebble", text: "An occasional green alternative for nature-led features. Keep Ocean Depth as the website's lead color." },
  { name: "Coastal calm", use: "ALTERNATIVE / SUPPORTING SECTIONS", start: "Sage 40%", end: "Sea Glass", foreground: "Ocean Depth", text: "An occasional pale-green alternative. Avoid mixing several gradient styles on the same page." },
];

document.querySelector("#gradient-grid").innerHTML = gradients.map(gradient => {
  const start = findColor(gradient.start);
  const end = findColor(gradient.end);
  const foreground = findColor(gradient.foreground);
  const differences = start.hex.slice(1).match(/.{2}/g).map((channel, index) =>
    parseInt(end.hex.slice(1 + index * 2, 3 + index * 2), 16) - parseInt(channel, 16));
  const monotonic = differences.every(value => value >= 0) || differences.every(value => value <= 0);
  const textLuminance = luminance(foreground.hex);
  const outsideRange = textLuminance < Math.min(luminance(start.hex), luminance(end.hex))
    || textLuminance > Math.max(luminance(start.hex), luminance(end.hex));
  const ratio = Math.min(contrast(start.hex, foreground.hex), contrast(end.hex, foreground.hex));
  if (!monotonic || !outsideRange || ratio < 4.5) throw new Error(`Gradient fails full-range AA validation: ${gradient.name}`);
  const background = `linear-gradient(135deg in srgb, ${start.hex} 0%, ${end.hex} 100%)`;
  return `<article class="example-card">
    <div class="example-content" style="background-color:${start.hex};background-image:${background};color:${foreground.hex}">
      <p class="eyebrow">${gradient.use}</p><h3>${gradient.name}</h3><p>${gradient.text}</p>
    </div>
    <div class="example-meta"><span>${start.name} to ${end.name}<small>Text: ${foreground.name} ${foreground.hex}</small></span><span class="badge">Min ${ratio.toFixed(2)}:1 · ${ratio >= 7 ? "AAA" : "AA"}</span></div>
    <p class="gradient-recipe"><code>background: ${background};</code></p>
  </article>`;
}).join("");

const backgroundSelect = document.querySelector("#background");
const foregroundSelect = document.querySelector("#foreground");
const preview = document.querySelector("#live-preview");
const availableBackgrounds = explorerColors.filter(color => partners(color).length > 0);
function option(color) {
  const element = document.createElement("option");
  element.value = color.hex;
  element.textContent = `${color.name} (${color.hex})`;
  return element;
}
backgroundSelect.replaceChildren(...availableBackgrounds.map(option));
backgroundSelect.value = findColor("Ocean Depth").hex;

function updatePreview() {
  const background = colors.find(color => color.hex === backgroundSelect.value);
  const foreground = colors.find(color => color.hex === foregroundSelect.value);
  const ratio = contrast(background.hex, foreground.hex);
  if (ratio < 4.5) throw new Error("Selected color combination does not meet AA.");
  preview.style.backgroundColor = background.hex;
  preview.style.color = foreground.hex;
  document.querySelector("#ratio").textContent = `${ratio.toFixed(2)}:1`;
  document.querySelector("#rating").textContent = ratio >= 7 ? "AAA · Enhanced contrast" : "AA · Normal text";
  document.querySelector("#pair-label").textContent = `${foreground.name} ${foreground.hex} on ${background.name} ${background.hex}`;
}

function updateForegrounds() {
  const previous = foregroundSelect.value || findColor("Pebble").hex;
  const background = colors.find(color => color.hex === backgroundSelect.value);
  const valid = partners(background);
  foregroundSelect.replaceChildren(...valid.map(option));
  if (valid.some(color => color.hex === previous)) foregroundSelect.value = previous;
  updatePreview();
}
backgroundSelect.addEventListener("change", updateForegrounds);
foregroundSelect.addEventListener("change", updatePreview);
updateForegrounds();

let copyTimer;
document.addEventListener("click", async event => {
  const button = event.target.closest("button[data-hex]");
  if (!button) return;
  const status = document.querySelector("#copy-status");
  clearTimeout(copyTimer);
  try {
    await navigator.clipboard.writeText(button.dataset.hex);
    status.textContent = `Copied ${button.dataset.hex} to clipboard.`;
  } catch (error) {
    console.error("Unable to copy palette color:", error);
    status.textContent = `Clipboard unavailable. Select and copy this code: ${button.dataset.hex}`;
  }
  copyTimer = setTimeout(() => { status.textContent = ""; }, 5000);
});
