import * as d3 from "d3";

// Accept a DOM element and a CSV URL
export async function renderIndexChart(container, csvUrl) {
  // Clear previous chart if any
  container.innerHTML = "";

  const width = 928;
  const height = 600;
  const marginTop = 20;
  const marginRight = 40;
  const marginBottom = 30;
  const marginLeft = 40;

  // Load your CSV data
  const data = await d3.csv(csvUrl, d3.autoType);

  // Group by "Brancher" (sector), and parse years
  const stocks = data.map(d => ({
    Symbol: d.Brancher,
    Date: new Date(d.Year, 0, 1),
    Close: +d.Value
  }));

  // Group by Symbol
  const series = d3.groups(stocks, d => d.Symbol).map(([key, values]) => {
    const v = values[0].Close;
    return {key, values: values.map(({Date, Close}) => ({Date, value: Close / v}))};
  });

  // Create the horizontal time scale.
  const x = d3.scaleUtc()
      .domain(d3.extent(stocks, d => d.Date))
      .range([marginLeft, width - marginRight])
      .clamp(true);

  // Create the vertical scale.
  const k = d3.max(series, ({values}) => d3.max(values, d => d.value) / d3.min(values, d => d.value));
  const y = d3.scaleLog()
      .domain([1 / k, k])
      .rangeRound([height - marginBottom, marginTop]);

  // Create a color scale to identify series.
  const z = d3.scaleOrdinal(d3.schemeCategory10).domain(series.map(d => d.key));

  // For each given series, the update function needs to identify the date—closest to the current
  // date—that actually contains a value. To do this efficiently, it uses a bisector:
  const bisect = d3.bisector(d => d.Date).left;

  // Create the SVG container.
  const svg = d3.select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; -webkit-tap-highlight-color: transparent;");

  // Create the axes and central rule.
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
      .call(g => g.select(".domain").remove());

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y)
          .ticks(null, x => +x.toFixed(6) + "×"))
      .call(g => g.selectAll(".tick line").clone()
          .attr("stroke-opacity", d => d === 1 ? null : 0.2)
          .attr("x2", width - marginLeft - marginRight))
      .call(g => g.select(".domain").remove());

  const rule = svg.append("g")
    .append("line")
      .attr("y1", height)
      .attr("y2", 0)
      .attr("stroke", "black");

  // Create a line and a label for each series.
  const serie = svg.append("g")
      .style("font", "bold 10px sans-serif")
    .selectAll("g")
    .data(series)
    .join("g");

  const line = d3.line()
      .x(d => x(d.Date))
      .y(d => y(d.value));

  serie.append("path")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke", d => z(d.key))
      .attr("d", d => line(d.values));

  serie.append("text")
      .datum(d => ({key: d.key, value: d.values[d.values.length - 1].value}))
      .attr("fill", d => z(d.key))
      .attr("paint-order", "stroke")
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .attr("x", x.range()[1] + 3)
      .attr("y", d => y(d.value))
      .attr("dy", "0.35em")
      .text(d => d.key);

  function update(date) {
    date = d3.utcDay.round(date);
    rule.attr("transform", `translate(${x(date) + 0.5},0)`);
    serie.attr("transform", ({values}) => {
      const i = bisect(values, date, 0, values.length - 1);
      return `translate(0,${y(1) - y(values[i].value / values[0].value)})`;
    });
    svg.property("value", date).dispatch("input");
  }

  d3.transition()
      .ease(d3.easeCubicOut)
      .duration(1500)
      .tween("date", () => {
        const i = d3.interpolateDate(x.domain()[1], x.domain()[0]);
        return t => update(i(t));
      });

  svg.on("mousemove touchmove", function(event) {
    update(x.invert(d3.pointer(event, this)[0]));
    if (event.preventDefault) event.preventDefault();
  });
}