import * as d3 from "d3";
import { groupBranchersAsOther } from "./dataProcessing";
import { brancherColor } from "./colorScale";

// Accept a DOM element and a CSV URL
export async function renderIndexChart(
  container,
  csvUrl,
  heightParam,
  widthParam
) {
  // Clear previous chart if any
  container.innerHTML = "";

  const width = widthParam;
  const height = heightParam;
  const marginTop = 200;
  const marginRight = 200;
  const marginBottom = 200;
  const marginLeft = 80;

  // Load your CSV data
  // Use d3.utcParse for correct year parsing
  const parseYear = d3.utcParse("%Y");
  var data = await d3.csv(csvUrl, d3.autoType);

  const branchersToGroup = ["Mining and quarrying", "Construction", "Information and communication", "Financing and insurance", "Real estate and rental of commercial properties", "Housing", "Business services", "Public administration, education, and health", "Culture, leisure, and other services"]; // Replace with actual names
  const branchersToExclude = ["Total", "Total Industries"];
  const groupedData = groupBranchersAsOther(data, branchersToGroup, branchersToExclude);

  // Group by "Brancher" (sector), and parse years
  const stocks = groupedData.map((d) => ({
    Symbol: d.Brancher,
    Date: parseYear(d.Year), // <-- FIXED: use utcParse for correct alignment
    Close: +d.Value,
  }));

  // Group by Symbol
  const series = d3
    .groups(stocks, (d) => d.Symbol)
    .map(([key, values]) => {
      const v = values[0].Close;
      return {
        key,
        values: values.map(({ Date, Close }) => ({ Date, value: Close / v })),
      };
    });

  // Create the horizontal time scale.
  const x = d3
    .scaleUtc()
    .domain(d3.extent(stocks, (d) => d.Date))
    .range([marginLeft, widthParam - marginRight])
    .clamp(true);

  // Create the vertical scale.
  const k = d3.max(
    series,
    ({ values }) =>
      d3.max(values, (d) => d.value) / d3.min(values, (d) => d.value)
  );
  const y = d3
    .scaleLog()
    .domain([1 / k, k])
    .rangeRound([heightParam - marginBottom, marginTop]);

  // For each given series, the update function needs to identify the date—closest to the current
  // date—that actually contains a value. To do this efficiently, it uses a bisector:
  const bisect = d3.bisector((d) => d.Date).left;

  // Create the SVG container.
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", widthParam)
    .attr("height", heightParam)
    .attr("viewBox", [0, 0, widthParam, heightParam])
    .attr(
      "style",
      "max-width: 100%; height: auto; -webkit-tap-highlight-color: transparent;"
    );

  // Create the axes and central rule.
  svg
    .append("g")
    .attr("transform", `translate(0,${heightParam - marginBottom})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(widthParam / 80)
        .tickSizeOuter(0)
    )
    .call((g) => g.select(".domain").remove());

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(null, (x) => +x.toFixed(6) + "×"))
    .call((g) =>
      g
        .selectAll(".tick line")
        .clone()
        .attr("stroke-opacity", (d) => (d === 1 ? null : 0.2))
        .attr("x2", widthParam - marginLeft - marginRight)
    )
    .call((g) => g.select(".domain").remove());

  const rule = svg
    .append("g")
    .append("line")
    .attr("y1", heightParam)
    .attr("y2", 0)
    .attr("stroke", "#fff"); // Make the vertical line white

  // Create a line and a label for each series.
  const serie = svg
    .append("g")
    .style("font", "bold 10px sans-serif")
    .selectAll("g")
    .data(series)
    .join("g");

  const line = d3
    .line()
    .x((d) => x(d.Date))
    .y((d) => y(d.value));

  serie
    .append("path")
    .attr("fill", "none")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke", (d) => brancherColor(d.key))
    .attr("d", (d) => line(d.values));

  serie
    .append("text")
    .datum((d) => ({ key: d.key, value: d.values[d.values.length - 1].value }))
    .attr("fill", (d) => brancherColor(d.key))
    .attr("x", x.range()[1] + 3)
    .attr("y", (d) => y(d.value))
    .attr("dy", "0.35em")
    .text((d) => d.key);

  // Get all unique years (dates) from your data
  const allDates = Array.from(new Set(stocks.map((d) => d.Date)));

  function getClosestDate(mouseDate) {
    // Find the date in allDates closest to mouseDate
    return allDates.reduce((a, b) =>
      Math.abs(a - mouseDate) < Math.abs(b - mouseDate) ? a : b
    );
  }

  function update(mouseDate) {
    // Find the closest year/date to the mouse position
    const closestDate = getClosestDate(mouseDate);
    rule.attr("transform", `translate(${x(closestDate) + 0.5},0)`);
    serie.attr("transform", ({ values }) => {
      const i = bisect(values, closestDate, 0, values.length - 1);
      return `translate(0,${y(1) - y(values[i].value / values[0].value)})`;
    });
    svg.property("value", closestDate).dispatch("input");
  }

  svg.on("mousemove touchmove", function (event) {
    const mouse = d3.pointer(event, this);
    const mouseDate = x.invert(mouse[0]);
    update(mouseDate);
    if (event.preventDefault) event.preventDefault();
  });
}