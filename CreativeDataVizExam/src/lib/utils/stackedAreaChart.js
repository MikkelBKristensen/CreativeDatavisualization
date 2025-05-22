import * as d3 from "d3";
import { groupBranchersAsOther } from "./dataProcessing";
import { brancherColor } from "./colorScale";

/**
 * Renders a stacked area chart of emissions by Brancher over time.
 * @param {HTMLElement} container - The DOM element to render the chart in.
 * @param {string} csvUrl - The URL to the CSV data.
 * @param {number} width - Width of the SVG.
 * @param {number} height - Height of the SVG.
 */
export async function renderStackedAreaChart(container, csvUrl, width, height) {
  container.innerHTML = "";

  // Load data
  const data = await d3.csv(csvUrl, d3.autoType);

  // Group/Exclude branchers as needed
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

  // Get all years and branchers
  const years = Array.from(new Set(groupedData.map(d => d.Year))).sort();
  const branchers = Array.from(
    new Set(groupedData.map(d => d.Brancher))
  ).sort();

  // Pivot data: [{Year, Brancher1, Brancher2, ...}]
  const yearMap = new Map();
  years.forEach(year => {
    yearMap.set(year, { Year: year });
  });
  groupedData.forEach(d => {
    yearMap.get(d.Year)[d.Brancher] = +d.Value;
  });
  const stackedData = Array.from(yearMap.values());

  // Stack generator
  const stack = d3.stack()
    .keys(branchers)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

  const series = stack(stackedData);

  // Scales
  const margin = { top: 40, right: 240, bottom: 40, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const x = d3.scalePoint()
    .domain(years)
    .range([0, innerWidth]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(stackedData, d =>
      d3.sum(branchers, k => d[k] || 0)
    )])
    .nice()
    .range([innerHeight, 0]);

  const color = d3.scaleOrdinal()
    .domain(branchers)
    .range(d3.schemeCategory10);

  // SVG setup
  const svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Area generator
  const area = d3.area()
    .x(d => x(d.data.Year))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]))
    .curve(d3.curveMonotoneX);

  // Draw areas with tooltip and highlight effect
  const paths = g.selectAll("path")
    .data(series)
    .join("path")
    .attr("fill", d => brancherColor(d.key))
    .attr("d", area)
    .style("transition", "filter 0.2s, opacity 0.2s");

  // Add a vertical line for hovered year
  const hoverLine = g.append("line")
    .attr("class", "hover-year-line")
    .attr("y1", 0)
    .attr("y2", innerHeight)
    .attr("stroke", "#222")
    .attr("stroke-width", 1)
    .attr("opacity", 0.5)
    .attr("stroke-dasharray", "5")
    .style("opacity", 0);

  // Tooltip and highlight logic
  paths
    .on("mousemove", function (event, d) {
      const [mx] = d3.pointer(event, this);
      // Find the closest year by pixel distance
      let minDist = Infinity;
      let closestYear = years[0];
      for (const year of years) {
        const px = x(year);
        const dist = Math.abs(mx - px);
        if (dist < minDist) {
          minDist = dist;
          closestYear = year;
        }
      }
      const yearData = d.find(s => s.data.Year == closestYear);
      if (!yearData) return;

      const value = yearData.data[d.key] || 0;
      const total = d3.sum(branchers, k => yearData.data[k] || 0);
      const percent = total ? ((value / total) * 100).toFixed(1) : "0.0";

      tooltip.style.display = "block";
      tooltip.innerHTML = `
        <b>${d.key}</b><br>
        Year: ${yearData.data.Year}<br>
        Value: ${value}<br>
        Percent: ${percent}%<br>
        <span style="color:#bbb;">Total for year: ${total}</span>
      `;
      tooltip.style.left = event.clientX + 15 + "px";
      tooltip.style.top = event.clientY + 15 + "px";

      // Highlight hovered area, fade and desaturate others
      paths
        .transition()
        .duration(100)
        .style("filter", p => (p === d ? "brightness(1.1)" : "grayscale(0.7)"));

      // Show and move the hover line
      hoverLine
        .style("opacity", 1)
        .attr("x1", x(closestYear))
        .attr("x2", x(closestYear));
    })
    .on("mouseleave", function () {
      tooltip.style.display = "none";
      // Reset all areas
      paths
        .transition()
        .duration(200)
        .style("filter", "none")
        .style("opacity", 1);

      // Hide the hover line
      hoverLine.style("opacity", 0);
    });

  // Tooltip setup
  const tooltip = document.createElement("div");
  tooltip.style.position = "fixed";
  tooltip.style.pointerEvents = "none";
  tooltip.style.background = "rgba(0,0,0,0.85)";
  tooltip.style.color = "#fff";
  tooltip.style.padding = "12px 12px";
  tooltip.style.borderRadius = "4px";
  tooltip.style.fontSize = "14px";
  tooltip.style.display = "none";
  tooltip.style.zIndex = "1000";
  document.body.appendChild(tooltip);

  // Axes
  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).tickValues(years.filter((d, i) => i % 2 === 0)));

  g.append("g")
    .call(d3.axisLeft(y));

  // Y-axis label
  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 35)
    .attr("x", -innerHeight / 2)
    .attr("text-anchor", "middle")
    .attr("fill", "#fff")
    .attr("font-size", "15px")
    .attr("opacity", 0.8)
    .text("Thousand tonnes CO2e");

  // Add horizontal grid lines for easier value reading
  g.append("g")
    .attr("class", "y-grid")
    .selectAll("line")
    .data(y.ticks())
    .join("line")
    .attr("x1", 0)
    .attr("x2", innerWidth)
    .attr("y1", d => y(d))
    .attr("y2", d => y(d))
    .attr("stroke", "#ccc")
    .attr("stroke-opacity", 0.3)
    .attr("stroke-dasharray", "5")
    .attr("stroke-width", 1);

  // Legend
  const legendHeight = branchers.length * 22;
  const legendY = margin.top + (innerHeight - legendHeight) / 2;

  const legend = svg.append("g")
    .attr("transform", `translate(${width - margin.right + 20},${legendY})`);

  // Reverse the branchers array for the legend
  [...branchers].reverse().forEach((brancher, i) => {
    const yPos = i * 22;
    legend.append("rect")
      .attr("x", 0)
      .attr("y", yPos)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", brancherColor(brancher));
    legend.append("text")
      .attr("x", 24)
      .attr("y", yPos + 13)
      .text(brancher)
      .style("font-size", "13px")
      .attr("fill", "#fff");
  });
}