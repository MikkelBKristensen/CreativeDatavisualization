import * as d3 from "d3";

/**
 * Renders a line chart comparing the "Total" values from two CSV files.
 * @param {HTMLElement} container - The DOM element to render the chart in.
 * @param {string} csvUrl1 - The URL to the first CSV data (KF24Total.csv).
 * @param {string} csvUrl2 - The URL to the second CSV data (dataENG.csv).
 * @param {number} width - Width of the SVG.
 * @param {number} height - Height of the SVG.
 * @param {boolean} includeExtraYears - Whether to include extra years from KF24Total.
 */
export async function renderComparedLineChart(container, csvUrl1, csvUrl2, width, height, includeExtraYears = false) {
  // Add toggle button if not present
  let btn = container.parentNode.querySelector("#toggle-extra-years");
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "toggle-extra-years";
    btn.style.padding = "0.4em 1em";
    btn.style.borderRadius = "6px";
    btn.style.border = "1px solid #b0b0b0";
    btn.style.background = "#f8fafc";
    btn.style.fontSize = "1rem";
    btn.style.cursor = "pointer";
    btn.style.marginBottom = "1em";
    container.parentNode.insertBefore(btn, container);
  }
  btn.textContent = includeExtraYears
    ? "Hide prediction of Emission in Denmark"
    : "Show prediction of Emission in Denmark";

  // Load both datasets
  const [data1, data2] = await Promise.all([
    d3.csv(csvUrl1, d3.autoType),
    d3.csv(csvUrl2, d3.autoType)
  ]);
  const totals1 = data1.filter(d => d.Brancher === "Total");
  const totals2 = data2.filter(d => d.Brancher === "Total");

  // Get years
  let years;
  if (includeExtraYears) {
    years = Array.from(new Set([...totals1.map(d => d.Year), ...totals2.map(d => d.Year)])).sort((a, b) => +a - +b);
  } else {
    const years1 = new Set(totals1.map(d => d.Year));
    const years2 = new Set(totals2.map(d => d.Year));
    years = Array.from([...years1].filter(y => years2.has(y))).sort((a, b) => +a - +b);
  }

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
  const margin = { top: 40, right: 300, bottom: 60, left: 80 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // --- SVG INIT ---
  let svg = d3.select(container).select("svg");
  let firstRender = svg.empty();
  if (firstRender) {
    svg = d3.select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const g = svg.append("g")
      .attr("class", "main-group")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Axes groups
    g.append("g").attr("class", "x-axis").attr("transform", `translate(0,${innerHeight})`);
    g.append("g").attr("class", "y-axis");

    // Y-axis label
    g.append("text")
      .attr("class", "y-label")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -innerHeight / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .attr("font-weight", "bold")
      .attr("font-size", "15px")
      .attr("font-family", "sans-serif")
      .attr("opacity", 0.8)
      .text("Thousand tonnes CO₂e");

    // Lines
    g.append("path").attr("class", "line1");
    g.append("path").attr("class", "line2");

    // Vertical hover line
    g.append("line")
      .attr("class", "hover-line")
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "5,3")
      .style("opacity", 0);

    // Legend
    const legendData = [
      { label: "Emission from danish economy", color: "#FF4136" },
      { label: "Emission in Denmark", color: "#0074D9" },
      { label: "Climate Law Goal (23,502 kt CO₂e)", color: "#2ECC40" }
    ];
    const legendBoxHeight = legendData.length * 28;
    const legendY = margin.top + (innerHeight - legendBoxHeight) / 2;
    const legend = svg.append("g")
      .attr("class", "legend")
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
        .attr("alignment-baseline", "middle")
        .attr("fill", "#fff");
    });

    // Tooltip setup
    if (!document.getElementById("compared-tooltip")) {
      const tooltip = document.createElement("div");
      tooltip.id = "compared-tooltip";
      tooltip.style.position = "fixed";
      tooltip.style.pointerEvents = "none";
      tooltip.style.background = "rgba(0,0,0,0.85)";
      tooltip.style.color = "#fff";
      tooltip.style.padding = "12px 16px";
      tooltip.style.borderRadius = "4px";
      tooltip.style.fontSize = "15px";
      tooltip.style.display = "none";
      tooltip.style.zIndex = "1000";
      tooltip.style.lineHeight = "1.6";
      document.body.appendChild(tooltip);
    }

    // Overlay for mouse events
    g.append("rect")
      .attr("class", "overlay")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("fill", "none")
      .attr("pointer-events", "all");
  }

  // --- SCALES ---
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

  // --- AXES ---
  const g = svg.select(".main-group");
  g.select(".x-axis")
    .transition()
    .duration(600)
    .call(
      d3.axisBottom(x)
        .tickFormat(d3.format("d"))
        .tickValues(years.map(Number))
    )
    .selectAll("text")
    .attr("transform", "rotate(-30)")
    .style("text-anchor", "end");

  g.select(".y-axis")
    .transition()
    .duration(600)
    .call(d3.axisLeft(y));

  // --- LINES ---
  const lineGen = d3.line()
    .defined(d => d.value !== null)
    .x(d => x(d.year))
    .y(d => y(d.value))
    .curve(d3.curveMonotoneX);

  g.select(".line1")
    .datum(line1)
    .transition()
    .duration(600)
    .attr("fill", "none")
    .attr("stroke", "#0074D9")
    .attr("stroke-width", 2.5)
    .attr("d", lineGen);

  g.select(".line2")
    .datum(line2)
    .transition()
    .duration(600)
    .attr("fill", "none")
    .attr("stroke", "#FF4136")
    .attr("stroke-width", 2.5)
    .attr("d", lineGen);

  // --- CLIMATE LAW GOAL LINE ---
  // Remove previous goal line/label if present
  g.selectAll(".climate-goal-line").remove();
  g.selectAll(".climate-goal-label").remove();

  const goalValue = 23502;
  const yGoal = y(goalValue);

  g.append("line")
    .attr("class", "climate-goal-line")
    .attr("x1", 0)
    .attr("x2", innerWidth)
    .attr("y1", yGoal)
    .attr("y2", yGoal)
    .attr("stroke", "#2ECC40")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "6,4");

  g.append("text")
    .attr("class", "climate-goal-label")
    .attr("x", innerWidth - 180)
    .attr("y", yGoal - 8)
    .attr("text-anchor", "end")
    .attr("fill", "#2ECC40")
    .attr("font-size", "15px")
    .attr("font-weight", "bold")
    .text("Climate Law");

  // --- TOOLTIP & HOVER LINE ---
  const tooltip = document.getElementById("compared-tooltip");
  const hoverLine = g.select(".hover-line");

  g.select(".overlay")
    .on("mousemove", function (event) {
      const [mx] = d3.pointer(event, this);
      // Find closest year by x-pixel
      let minDist = Infinity;
      let closestYear = years[0];
      for (const year of years) {
        const px = x(+year);
        const dist = Math.abs(mx - px);
        if (dist < minDist) {
          minDist = dist;
          closestYear = year;
        }
      }
      // Get values for both lines
      const v1 = line1.find(d => d.year == closestYear)?.value;
      const v2 = line2.find(d => d.year == closestYear)?.value;
      if (v1 == null && v2 == null) {
        tooltip.style.display = "none";
        hoverLine.style("opacity", 0);
        return;
      }

      // Calculate difference and percent
      let diff = null, percent = null;
      if (v1 != null && v2 != null) {
        diff = v2 - v1;
        percent = v1 !== 0 ? ((diff / v1) * 100).toFixed(1) : null;
      }

      tooltip.style.display = "block";
      tooltip.innerHTML = `
        <b>Year: ${closestYear}</b><br>
        <span style="color:#FF4136;">Emission from danish economy:</span> ${v2 !== null ? v2.toLocaleString() : "N/A"}<br>
        <span style="color:#0074D9;">Emission in Denmark:</span> ${v1 !== null ? v1.toLocaleString() : "N/A"}<br>
        ${diff !== null && percent !== null
          ? `<span style="color:#bbb;">Difference: ${(diff > 0 ? "+" : "") + diff.toLocaleString()} (${percent}%)</span>`
          : ""}
      `;
      tooltip.style.left = event.clientX + 15 + "px";
      tooltip.style.top = event.clientY + 15 + "px";

      // Show and move vertical hover line
      hoverLine
        .style("opacity", 1)
        .attr("x1", x(closestYear))
        .attr("x2", x(closestYear));
    })
    .on("mouseleave", function () {
      tooltip.style.display = "none";
      hoverLine.style("opacity", 0);
    });

  // --- BUTTON EVENT ---
  btn.onclick = () => {
    renderComparedLineChart(container, csvUrl1, csvUrl2, width, height, !includeExtraYears);
  };
}