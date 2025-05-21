import * as d3 from "d3";
import { brancherColor } from "./colorScale";
import { groupBranchersAsOther } from "./dataProcessing";

/**
 * Renders a bar chart with branchers on x-axis, values on y-axis, and a timeline slider to select year.
 * @param {HTMLElement} container - The DOM element to render the chart in.
 * @param {string} csvUrl - The URL to the CSV data.
 * @param {number} width - Width of the SVG.
 * @param {number} height - Height of the SVG.
 */
export async function renderFullBarChart(container, csvUrl, width, height) {
  container.innerHTML = "";

  // Load and process data
  const data = await d3.csv(csvUrl, d3.autoType);

  // Group branchers as "Other" if needed
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
  const years = Array.from(new Set(groupedData.map(d => d.Year))).sort((a, b) => a - b);
  const branchers = Array.from(new Set(groupedData.map(d => d.Brancher)));

  // Initial year
  let currentYear = years[0];

  // Create controls container
  const controls = document.createElement("div");
  controls.style.display = "flex";
  controls.style.alignItems = "center";
  controls.style.justifyContent = "center"; // Center horizontally
  controls.style.gap = "1rem";
  controls.style.margin = "1.5rem 0 0 0"; // Add margin-top only

  // Previous button
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Previous";
  prevBtn.style.padding = "0.4em 1em";
  prevBtn.style.borderRadius = "6px";
  prevBtn.style.border = "1px solid #b0b0b0";
  prevBtn.style.background = "#f8fafc";
  prevBtn.style.fontSize = "1rem";
  prevBtn.style.cursor = "pointer";

  // Next button
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.style.padding = "0.4em 1em";
  nextBtn.style.borderRadius = "6px";
  nextBtn.style.border = "1px solid #b0b0b0";
  nextBtn.style.background = "#f8fafc";
  nextBtn.style.fontSize = "1rem";
  nextBtn.style.cursor = "pointer";

  // Year label
  const yearLabel = document.createElement("div");
  yearLabel.style.fontWeight = "bold";
  yearLabel.style.fontSize = "3rem";
  yearLabel.style.textAlign = "center";
  yearLabel.style.margin = "0 0 0.5rem 0";
  yearLabel.textContent = currentYear;

  // Timeline slider
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = 0;
  slider.max = years.length - 1;
  slider.value = years.indexOf(currentYear);
  slider.style.width = "300px";
  slider.style.margin = "0 1rem";

  controls.appendChild(prevBtn);
  controls.appendChild(slider);
  controls.appendChild(nextBtn);

  // SVG setup
  const margin = { top: 40, right: 40, bottom: 110, left: 80 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Centered year label above chart
  container.appendChild(yearLabel);

  // Create SVG first, then controls after
  const svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // X and Y scales
  const x = d3.scaleBand()
    .domain(branchers)
    .range([0, innerWidth])
    .padding(0.2);

  const y = d3.scaleLinear()
    .range([innerHeight, 0]);

  // X Axis
  const xAxis = g.append("g")
    .attr("transform", `translate(0,${innerHeight})`);

  // Y Axis
  const yAxis = g.append("g")
    .call(d3.axisLeft(y));

  // Add horizontal grid lines for y-axis ticks
  const yGrid = g.append("g")
    .attr("class", "y-grid");

  // Add Y-axis label
  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 15)
    .attr("x", -innerHeight / 2)
    .attr("text-anchor", "middle")
    .attr("fill", "#fff") // Make y-axis label white
    // .attr("font-weight", "bold")
    .attr("font-size", "15px")
    .attr("font-family", "sans-serif")
    .attr("opacity", 0.8)
    .text("Thousand tonnes CO₂e");

  // Set a static y-axis domain up to 55000
  y.domain([0, 55000]);

  // Draw/update chart for a given year
  function updateChart(year) {
    // Filter and sum values for the selected year
    const filtered = groupedData.filter(d => d.Year === year);
    const values = d3.rollups(
      filtered,
      v => d3.sum(v, d => +d.Value),
      d => d.Brancher
    );
    const valueMap = new Map(values);

    // y.domain([0, maxValue * 1.08]); // REMOVE this dynamic domain

    // Bars
    const bars = g.selectAll("rect")
      .data(branchers, d => d);

    bars.join(
      enter => enter.append("rect")
        .attr("x", d => x(d))
        .attr("width", x.bandwidth())
        .attr("y", y(0))
        .attr("height", 0)
        .attr("fill", d => brancherColor(d))
        .call(enter => enter.transition().duration(500)
          .attr("y", d => y(valueMap.get(d) || 0))
          .attr("height", d => innerHeight - y(valueMap.get(d) || 0))
        ),
      update => update
        .call(update => update.transition().duration(500)
          .attr("y", d => y(valueMap.get(d) || 0))
          .attr("height", d => innerHeight - y(valueMap.get(d) || 0))
        ),
      exit => exit
        .call(exit => exit.transition().duration(300)
          .attr("y", y(0))
          .attr("height", 0)
          .remove()
        )
    );

    // Value labels
    const labels = g.selectAll("text.value-label")
      .data(branchers, d => d);

    labels.join(
      enter => enter.append("text")
        .attr("class", "value-label")
        .attr("x", d => x(d) + x.bandwidth() / 2)
        .attr("y", d => y(valueMap.get(d) || 0) - 6)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "#fff") // Make value labels white
        .text(d => valueMap.get(d) || 0)
        .style("opacity", 0)
        .transition().duration(500)
        .style("opacity", 1),
      update => update
        .transition().duration(500)
        .attr("x", d => x(d) + x.bandwidth() / 2)
        .attr("y", d => y(valueMap.get(d) || 0) - 6)
        .text(d => valueMap.get(d) || 0),
      exit => exit
        .transition().duration(300)
        .style("opacity", 0)
        .remove()
    );

    // Update axes
    xAxis.transition().duration(500)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-30)")
      .style("text-anchor", "end");

    yAxis.transition().duration(500)
      .call(d3.axisLeft(y));

    // Update y grid lines
    const ticks = y.ticks ? y.ticks() : y.domain();
    yGrid.selectAll("line")
      .data(ticks)
      .join("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", d => y(d))
      .attr("y2", d => y(d))
      .attr("stroke", "#ccc")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-dasharray", "4,2")
      .lower();

    // Update year label
    yearLabel.textContent = year;
  }

  // Initial draw
  updateChart(currentYear);

  // Timeline slider event
  slider.addEventListener("input", (e) => {
    currentYear = years[+slider.value];
    updateChart(currentYear);
  });

  // Previous/Next button events
  prevBtn.onclick = () => {
    let idx = years.indexOf(currentYear);
    if (idx > 0) {
      currentYear = years[idx - 1];
      slider.value = idx - 1;
      updateChart(currentYear);
    }
  };
  nextBtn.onclick = () => {
    let idx = years.indexOf(currentYear);
    if (idx < years.length - 1) {
      currentYear = years[idx + 1];
      slider.value = idx + 1;
      updateChart(currentYear);
    }
  };

  // Move controls below the chart and center
  container.appendChild(controls);
}