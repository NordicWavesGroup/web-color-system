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

function partners(background) {
  return colors.filter(color => contrast(background.hex, color.hex) >= 4.5);
}

function colorCard(color) {
  return `<article class="color-card" data-group="${color.group}">
    <div class="color-swatch" style="background-color:${color.hex}" aria-hidden="true"></div>
    <h3>${color.name}</h3>
    <button type="button" class="hex-copy" data-hex="${color.hex}" aria-label="Copy ${color.name} hex code ${color.hex}"><span class="hex-value">${color.hex}</span><span class="copy-icon" aria-hidden="true">⧉</span></button>
    ${color.role ? `<p>${color.role}</p>` : ""}
  </article>`;
}

document.querySelector("#core-colors").innerHTML = colors.filter(color => color.group === "Core").map(colorCard).join("");
document.querySelector("#support-colors").innerHTML = [...new Set(colors.filter(color => color.group !== "Core").map(color => color.group))]
  .map(group => `<section class="support-group"><h3>${group}</h3><div class="swatch-grid">${colors.filter(color => color.group === group).map(colorCard).join("")}</div></section>`).join("")
  + '<p class="footnote">Interactive aliases in the original: Primary = Forest Green; Secondary = Sage; Focus ring = Sky Mist. Tints are the supplied solid hex colors, not opacity settings. Status colors need text labels or icons as well as color.</p>';

const examples = [
  { background: "Ocean Depth", foreground: "Pebble", label: "OUR OCEAN FOUNDATION", title: "Ideas worth<br>diving into.", text: "Our signature deep blue with a soft, light foreground. A confident foundation for Nordic Waves Group introductions and feature sections." },
  { background: "Sky Mist", foreground: "Ocean Depth", label: "ROOM TO BREATHE", title: "A little clarity<br>goes a long way.", text: "Ocean Depth text on an open, airy blue surface. Give longer stories and useful information space to shine." },
  { background: "Ocean Depth 80%", foreground: "Pebble", label: "A SOFTER KIND OF DEPTH", title: "New horizons.<br>Same clear purpose.", text: "A lighter ocean tone that keeps the blue identity front and center. Pair with Pebble for readable supporting panels." },
  { background: "Sky Mist 40%", foreground: "Ocean Depth", label: "LIGHT ON THE HORIZON", title: "Clear skies.<br>Fresh perspectives.", text: "A barely-there blue with Ocean Depth lettering. A quiet alternative to a neutral background for everyday reading." },
  { background: "Forest Green", foreground: "Pebble", label: "ROOTED IN NATURE", title: "Small steps.<br>Lasting change.", text: "Rich forest green with a soft, light foreground. A grounded companion to the ocean blues for important messages and sustainability stories." },
  { background: "Sand", foreground: "Forest Green", label: "A NATURAL COMPLEMENT", title: "Space to grow.<br>Room to connect.", text: "Forest Green lettering on a gentle, nature-inspired neutral. A welcoming combination for supporting content and quieter moments." },
  { background: "Stone", foreground: "Sky Mist", label: "BLUE AFTER DARK", title: "Less noise.<br>More meaning.", text: "Light Sky Mist lettering on a deep Stone background. A cool, readable blue accent for focused statements and understated panels." },
  { background: "Pebble", foreground: "Ocean Depth", label: "THE EVERYDAY FOUNDATION", title: "Simple. Clear.<br>Easy to read.", text: "Ocean Depth lettering on a soft Pebble background. A dependable dark-blue pairing for longer articles and practical information." },
  { background: "Stone", foreground: "Sage 40%", label: "GREEN AFTER DARK", title: "A softer light.<br>A natural voice.", text: "A pale sage foreground brings a gentle green accent to Stone. Use for readable messages on a dark, neutral surface." },
  { background: "Pebble", foreground: "Forest Green", label: "A GROUNDED EVERYDAY", title: "Fresh thinking.<br>Solid foundations.", text: "Dark Forest Green text brings a natural tone to Pebble. A calm alternative to blue for everyday reading and supporting information." },
];

const findColor = name => colors.find(color => color.name === name);
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
  { name: "Deep current", start: "Ocean Depth", end: "Ocean Depth 60%", foreground: "Pebble", text: "A visible lift from deep ocean to an open, softer blue. Use for hero sections and brand introductions with a stronger sense of depth." },
  { name: "Forest light", start: "Primary hover", end: "Forest Green 80%", foreground: "Pebble", text: "Deep evergreen opens into a brighter forest tone. A distinct green companion to the ocean blues for nature-led features and supporting panels." },
  { name: "Coastal calm", start: "Sage 40%", end: "Sand", foreground: "Ocean Depth", text: "Pale sea green fades into a warm, quiet neutral. Pair with Ocean Depth text for welcoming introductions and nature-led stories." },
  { name: "Quiet horizon", start: "Sky Mist 40%", end: "Pebble", foreground: "Ocean Depth", text: "An almost-neutral blue fade for long-form content and calm, spacious page sections." },
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
      <p class="eyebrow">${start.name} TO ${end.name}</p><h3>${gradient.name}</h3><p>${gradient.text}</p>
    </div>
    <div class="example-meta"><span>Text: ${foreground.name}<small>${foreground.hex}</small></span><span class="badge">Min ${ratio.toFixed(2)}:1 · ${ratio >= 7 ? "AAA" : "AA"}</span></div>
    <p class="gradient-recipe"><code>background: ${background};</code></p>
  </article>`;
}).join("");

const backgroundSelect = document.querySelector("#background");
const foregroundSelect = document.querySelector("#foreground");
const preview = document.querySelector("#live-preview");
const availableBackgrounds = colors.filter(color => partners(color).length > 0);
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
