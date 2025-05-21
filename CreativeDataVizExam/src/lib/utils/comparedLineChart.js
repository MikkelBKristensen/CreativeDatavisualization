import * as d3 from "d3";

/**
 * Renders a line chart comparing the "Total" values from two CSV files.
 * @param {HTMLElement} container - The DOM element to render the chart in.
 * @param {string} csvUrl1 - The URL to the first CSV data (KF24Total.csv).
 * @param {string} csvUrl2 - The URL to the second CSV data (dataENG.csv).
 * @param {number} width - Width of the SVG.
 * @param {number} height - Height of the SVG.
 */
export async function renderComparedLineChart(container, csvUrl1, csvUrl2, width, height) {
  container.innerHTML = "";

  // Load both datasets
  const [data1, data2] = await Promise.all([
    d3.csv(csvUrl1, d3.autoType),
    d3.csv(csvUrl2, d3.autoType)
  ]);

  // Extract "Total" values for each year from both datasets
  const totals1 = data1.filter(d => d.Brancher === "Total");
  const totals2 = data2.filter(d => d.Brancher === "Total");

  // Get all years present in either dataset, sorted
  const years = Array.from(
    new Set([...totals1.map(d => d.Year), ...totals2.map(d => d.Year)])
  ).sort((a, b) => +a - +b);

  // Prepare data for lines
  const line1 = years.map(year => {
    const found = totals1.find(d => d.Year == year);
    return { year: +year, value: found ? +found.Value : null };
  });
  const line2 = years.map(year => {
    const found = totals2.find(d => d.Year == year);
    return { year: +year, value: found ? +found.Value : null };
  });

  // SVG and margins
  const margin = { top: 40, right: 260, bottom: 60, left: 80 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Scales
  const x = d3.scaleLinear()
    .domain(d3.extent(years, d => +d))
    .range([0, innerWidth]);

  const y = d3.scaleLinear()
    .domain([
      0,
      d3.max([
        d3.max(line1, d => d.value || 0),
        d3.max(line2, d => d.value || 0)
      ])
    ])
    .nice()
    .range([innerHeight, 0]);

  // Axes
  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(
      d3.axisBottom(x)
        .tickFormat(d3.format("d"))
        .ticks(Math.min(years.length, 20))
    )
    .selectAll("text")
    .attr("transform", "rotate(-30)")
    .style("text-anchor", "end");

  g.append("g")
    .call(d3.axisLeft(y));

  // Y-axis label
  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 20)
    .attr("x", -innerHeight / 2)
    .attr("text-anchor", "middle")
    .attr("fill", "#333")
    .attr("font-weight", "bold")
    .attr("font-size", "15px")
    .attr("font-family", "sans-serif")
    .attr("opacity", 0.5)
    .text("Thousand tonnes CO₂e");

  // Line generators
  const lineGen = d3.line()
    .defined(d => d.value !== null)
    .x(d => x(d.year))
    .y(d => y(d.value))
    .curve(d3.curveMonotoneX);

  // Draw lines
  g.append("path")
    .datum(line1)
    .attr("fill", "none")
    .attr("stroke", "#0074D9")
    .attr("stroke-width", 2.5)
    .attr("d", lineGen);

  g.append("path")
    .datum(line2)
    .attr("fill", "none")
    .attr("stroke", "#FF4136")
    .attr("stroke-width", 2.5)
    .attr("d", lineGen);

  // Legend styled like StackedAreaChart.svelte
  const legendData = [
    { label: "Emission in Denmark", color: "#0074D9" },
    { label: "Emission from danish economy", color: "#FF4136" }
  ];
  const legendBoxHeight = legendData.length * 28;
  const legendY = margin.top + (innerHeight - legendBoxHeight) / 2;

  const legend = svg.append("g")
    .attr("transform", `translate(${width - margin.right + 20},${legendY})`);

  legendData.forEach((item, i) => {
    const yPos = i * 28;
    legend.append("rect")
      .attr("x", 0)
      .attr("y", yPos)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", item.color);
    legend.append("text")
      .attr("x", 26)
      .attr("y", yPos + 13)
      .text(item.label)
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
  });
}