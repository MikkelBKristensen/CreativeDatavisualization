import * as d3 from "d3";
import { brancherColor } from "./colorScale";
import { groupBranchersAsOther } from "./dataProcessing";

/**
 * Renders a sortable bar chart of all branchers for 1990.
 * @param {HTMLElement} container - The DOM element to render the chart in.
 * @param {string} csvUrl - The URL to the CSV data.
 * @param {number} width - Width of the SVG.
 * @param {number} height - Height of the SVG.
 */
export async function renderSortableBarChart(container, csvUrl, width, height) {
  container.innerHTML = "";

  // Load and process data
  const data = await d3.csv(csvUrl, d3.autoType);

  // Group branchers as "Other" if needed (adjust as in your other charts)
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

  // Filter for 1990 only
  const filtered = data.filter(d => d.Year === 1990);

  // Sum values per brancher
  let values = d3.rollups(
    filtered,
    v => d3.sum(v, d => +d.Value),
    d => d.Brancher
  ).filter(([brancher]) => brancher !== "Total" && brancher !== "Total Industries");

  // Initial sort: descending by value
  values.sort((a, b) => d3.descending(a[1], b[1]));

  // SVG setup
  const margin = { top: 60, right: 40, bottom: 40, left: 220 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Replace sort buttons with a combobox (select)
  const controls = document.createElement("div");
  controls.style.display = "flex";
  controls.style.alignItems = "center";
  controls.style.gap = "0.5rem";
  controls.style.marginBottom = "1rem";
  controls.innerHTML = `
    <label for="sort-select" style="
      font-weight:500;
      margin-right: 0.5rem;
      color: #333;
      font-size: 1rem;
      letter-spacing: 0.02em;
    ">Order by:</label>
    <select id="sort-select" style="
      padding: 0.4em 1.5em 0.4em 0.8em;
      border-radius: 6px;
      border: 1px solid #b0b0b0;
      background: #f8fafc;
      font-size: 1rem;
      color: #222;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      transition: border 0.2s;
      outline: none;
    ">
      <option value="desc">CO₂ emission ↓</option>
      <option value="asc">CO₂ emission ↑</option>
      <option value="alpha">A-Z</option>
    </select>
  `;
  container.prepend(controls);

  // Scales
  const y = d3.scaleBand()
    .domain(values.map(d => d[0]))
    .range([0, innerHeight])
    .padding(0.2);

  const x = d3.scaleLinear()
    .domain([0, d3.max(values, d => d[1])])
    .nice()
    .range([0, innerWidth]);

  // Chart group
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Bars
  let bars = g.selectAll("rect")
    .data(values, d => d[0])
    .join("rect")
    .attr("y", d => y(d[0]))
    .attr("height", y.bandwidth())
    .attr("x", 0)
    .attr("width", d => x(d[1]))
    .attr("fill", d => brancherColor(d[0]));

  // Labels
  let labels = g.selectAll("text.label")
    .data(values, d => d[0])
    .join("text")
    .attr("class", "label")
    .attr("x", d => x(d[1]) + 5)
    .attr("y", d => y(d[0]) + y.bandwidth() / 2)
    .attr("dy", "0.35em")
    .style("font-size", "13px")
    .text(d => d[1]);

  // Y Axis (brancher names)
  const yAxis = g.append("g")
    .call(d3.axisLeft(y));

  // X Axis (values)
  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x));

  // Sorting logic
  function update(sortType) {
    if (sortType === "desc") {
      values.sort((a, b) => d3.descending(a[1], b[1]));
    } else if (sortType === "asc") {
      values.sort((a, b) => d3.ascending(a[1], b[1]));
    } else if (sortType === "alpha") {
      values.sort((a, b) => d3.ascending(a[0], b[0]));
    }
    y.domain(values.map(d => d[0]));

    bars.data(values, d => d[0])
      .transition()
      .duration(600)
      .attr("y", d => y(d[0]));

    labels.data(values, d => d[0])
      .transition()
      .duration(600)
      .attr("y", d => y(d[0]) + y.bandwidth() / 2);

    yAxis.transition()
      .duration(600)
      .call(d3.axisLeft(y));
  }

  // ComboBox event listener
  controls.querySelector("#sort-select").addEventListener("change", (e) => {
    update(e.target.value);
  });
}