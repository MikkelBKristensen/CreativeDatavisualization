import * as d3 from "d3";
import { groupBranchersAsOther } from "./dataProcessing";
import { brancherColor } from "./colorScale";

/**
 * Renders a pie chart showing the percentage of emissions each "Brancher" is responsible for,
 * and displays a key/legend to the right with brancher names, percentages, and colors.
 * @param {HTMLElement} container - The DOM element to render the chart in.
 * @param {string} csvUrl - The URL to the CSV data.
 * @param {number} width - Width of the SVG.
 * @param {number} height - Height of the SVG.
 * @param {string|number} [year] - Optional: Only show data for this year (if omitted, uses all data).
 */
export async function renderEmissionPieChart(
  container,
  csvUrl,
  width,
  height,
  year
) {
  container.innerHTML = "";

  // Load data
  const data = await d3.csv(csvUrl, d3.autoType);

  const branchersToGroup = [
    "Mining and quarrying",
    "Construction",
    "Information and communication",
    "Financing and insurance",
    "Real estate and rental of commercial properties",
    "Housing",
    "Business services",
    "Public administration, education, and health",
    "Culture, leisure, and other services",
  ];
  const branchersToExclude = ["Total", "Total Industries"];
  const groupedData = groupBranchersAsOther(
    data,
    branchersToGroup,
    branchersToExclude
  );

  // Optionally filter by year
  const filtered = year ? groupedData.filter((d) => d.Year == year) : groupedData;

  // Sum emissions per Brancher
  const emissionByBrancher = d3.rollups(
    filtered,
    (v) => d3.sum(v, (d) => +d.Value),
    (d) => d.Brancher
  );

  // Remove "Total" or similar if present
  const pieData = emissionByBrancher.filter(
    ([brancher]) => brancher !== "Total" && brancher !== "Total Industries"
  );

  // Pie generator
  const pie = d3
    .pie()
    .value((d) => d[1])
    .sort(null);

  const arcs = pie(pieData);

  // Color scale
  const color = d3
    .scaleOrdinal()
    .domain(pieData.map((d) => d[0]))
    .range(d3.schemeCategory10);

  // SVG and key container setup
  const radius = Math.min(width, height) / 2;
  // Create a flex container for chart and key
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center"; // <-- changed from flex-start to center
  wrapper.style.gap = "2rem";
  container.appendChild(wrapper);

  // Chart SVG
  const svg = d3
    .select(wrapper)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const chartGroup = svg
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // Draw slices
  chartGroup
    .selectAll("path")
    .data(arcs)
    .join("path")
    .attr(
      "d",
      d3
        .arc()
        .innerRadius(0)
        .outerRadius(radius - 10)
    )
    .attr("fill", (d) => brancherColor(d.data[0]))
    .attr("stroke", "#fff")
    .attr("stroke-width", 1)
    .on("mousemove", function (event, d) {
      tooltip.style.display = "block";
      tooltip.textContent = d.data[0];
      tooltip.style.left = event.clientX + 10 + "px";
      tooltip.style.top = event.clientY + 10 + "px";
    })
    .on("mouseleave", function () {
      tooltip.style.display = "none";
    });

  // Tooltip setup
  const tooltip = document.createElement("div");
  tooltip.style.position = "fixed";
  tooltip.style.pointerEvents = "none";
  tooltip.style.background = "rgba(0,0,0,0.8)";
  tooltip.style.color = "#fff";
  tooltip.style.padding = "4px 10px";
  tooltip.style.borderRadius = "4px";
  tooltip.style.fontSize = "14px";
  tooltip.style.display = "none";
  tooltip.style.zIndex = "1000";
  document.body.appendChild(tooltip);

  // Add labels on slices (optional, can be removed if only using key)
  chartGroup
    .selectAll("text")
    .data(arcs)
    .join("text")
    .attr(
      "transform",
      (d) =>
        `translate(${d3
          .arc()
          .innerRadius(0)
          .outerRadius(radius * 1.5)
          .centroid(d)})`
    )
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("font-size", "12px")
    .text(
      (d) =>
        `${((d.data[1] / d3.sum(pieData, (d) => d[1])) * 100).toFixed(1)}%`
    );

  // --- KEY/LEGEND ---
  const total = d3.sum(pieData, (d) => d[1]);
  const legend = document.createElement("div");
  legend.style.display = "flex";
  legend.style.flexDirection = "column";
  legend.style.gap = "0.5rem";
  legend.style.fontFamily = "sans-serif";
  legend.style.fontSize = "14px";
  wrapper.appendChild(legend);

  pieData.forEach(([brancher, value]) => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "0.5em";

    // Color box
    const swatch = document.createElement("span");
    swatch.style.display = "inline-block";
    swatch.style.width = "1em";
    swatch.style.height = "1em";
    swatch.style.background = brancherColor(brancher);
    swatch.style.border = "1px solid #ccc";
    swatch.style.marginRight = "0.5em";

    // Text
    const percent = ((value / total) * 100).toFixed(1);
    row.appendChild(swatch);
    row.appendChild(document.createTextNode(`${brancher} (${percent}%)`));

    legend.appendChild(row);
  });
}
