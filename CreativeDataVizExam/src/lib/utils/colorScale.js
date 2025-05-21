import * as d3 from "d3";

export const brancherDomain = [
  "Agriculture, forestry, and fishing",
  "Industry",
  "Utility services",
  "Trade and transport, etc.",
  "Households",
  "Other"
];

// Custom color palette chosen to fit each brancher type
const brancherPalette = [
  "#7BB661", // Agriculture, forestry, and fishing (green)
  "#4B6C8C", // Industry (steel blue)
  "#f9a24e", // Utility services (yellow/orange)
  "#E57373", // Trade and transport, etc. (red)
  "#FFD54F", // Households (warm yellow)
  "#B0BEC5"  // Other (neutral gray)
];

// Shared color scale for all charts
export const brancherColor = d3.scaleOrdinal()
  .domain(brancherDomain)
  .range(brancherPalette);