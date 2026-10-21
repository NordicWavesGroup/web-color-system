"use strict";

const foundationColors = [
  { name: "Ocean Depth", hex: "#1A3E5D", group: "Core", role: "Lead brand color for headings, navigation, and key sections." },
  { name: "Forest Green", hex: "#0F5B56", group: "Core", role: "Action color for buttons and selected supporting sections." },
  { name: "Sky Mist", hex: "#A7C3D6", group: "Core", role: "Light blue section backgrounds, supporting the Ocean Depth identity." },
  { name: "Sage", hex: "#3F8A86", group: "Core", role: "Decorative emphasis and supporting surfaces, not a default text-button background." },
  { name: "Stone", hex: "#2E3236", group: "Core", role: "Everyday body text and neutral dark surfaces." },
  { name: "Pebble", hex: "#F4F6F7", group: "Core", outline: true, role: "Default page and reading background." },
];

function tintOverWhite(hex, percentage) {
  return "#" + hex.slice(1).match(/.{2}/g).map(channel =>
    Math.round((parseInt(channel, 16) * percentage + 255 * (100 - percentage)) / 100)
      .toString(16).padStart(2, "0")).join("").toUpperCase();
}

const statusColors = [
  { name: "Success", description: "Muted evergreen", hex: "#4F7564", group: "Status colors" },
  { name: "Warning", description: "Ochre", hex: "#9A763F", group: "Status colors" },
  { name: "Error", description: "Clay red", hex: "#A65F59", group: "Status colors" },
  { name: "Info", description: "Ocean blue", hex: "#52758F", group: "Status colors" },
];

const colors = [
  ...foundationColors,
  ...foundationColors.filter(color => color.name !== "Pebble").flatMap(source =>
    [80, 60, 40].map(percentage => ({
      name: `${source.name} ${percentage}%`,
      hex: tintOverWhite(source.hex, percentage),
      group: "Tints over white",
      family: source.name,
      percentage,
    }))),
  { name: "Deep Pine", hex: "#0B4F49", group: "Supporting greens" },
  { name: "Muted Teal", hex: "#2F6E6B", group: "Supporting greens" },
  ...statusColors,
  { name: "Success background", hex: "#EDF1EF", group: "Status backgrounds", outline: true },
  { name: "Warning background", hex: "#F3F0E9", group: "Status backgrounds", outline: true },
  { name: "Error background", hex: "#F3EDEE", group: "Status backgrounds", outline: true },
  { name: "Info background", hex: "#EDF0F3", group: "Status backgrounds", outline: true },
  { name: "Sea Glass", description: "Pale green-gray", hex: "#E8EFEA", group: "Additional accents" },
  { name: "Coral", description: "Terracotta-pink", hex: "#C98F7A", group: "Additional accents" },
  { name: "Soft Blue", description: "Dusty blue", hex: "#849FB8", group: "Additional accents" },
  { name: "Lavender", description: "Gray-lilac", hex: "#A5A0B8", group: "Additional accents" },
];

function colorRows(group) {
  const members = colors.filter(color => color.group === group);
  return group === "Tints over white"
    ? foundationColors.filter(source => members.some(color => color.family === source.name))
      .map(source => ({ name: source.name, colors: members.filter(color => color.family === source.name) }))
    : [{ name: "", colors: members }];
}
