d3.csv("data.csv").then((data) => {
  const width = 800;
  const height = width;
  const innerRadius = 120;
  const outerRadius = 355;

  const windScale = {
    "NA": 0,
    "Let-": 1,
    "Let": 2,
    "Let+": 3,
    "Moderat-": 4,
    "Moderat": 5,
    "Moderat+": 6,
  };

  const windScaleArray = [
    "NA",
    "Let-",
    "Let",
    "Let+",
    "Moderat-",
    "Moderat",
    "Moderat+"];

  data.forEach((d) => {
    d.timestamp = +d.timestamp; // Converts the string to number
    d.wind = windScale[d.wind]; // Converts category to number
  });

  const svg = d3
    .select("#canvas")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height]); // Center it

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.timestamp)) // Uses timestamps as category
    .range([0, 2 * Math.PI]) // Full circle
    .align(0);

  const y = d3.scaleRadial().domain([0, 6]).range([innerRadius, outerRadius]);

  const arc = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius((d) => y(d.wind))
    .startAngle((d) => x(d.timestamp))
    .endAngle((d) => x(d.timestamp) + x.bandwidth())
    .padAngle(0.02);

  svg
    .append("g")
    .selectAll("path")
    .data(data)
    .join("path")
    .attr("d", arc)
    .attr("fill", (d) => d.color)
    .append("title")
    .text((d) => `Time: ${d.timestamp}m\nWind: ${d.wind}`);

  // Add radial x-axis
  const xAxis = svg.append("g")
    .attr("text-anchor", "middle");

  xAxis.selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", d => `
      rotate(${((x(d.timestamp) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
      translate(${innerRadius},0)
    `)
    .call(g => g.append("line")
      .attr("x2", -5)
      .attr("stroke", "#000"))
    .call(g => g.append("text")
      .attr("transform", d => (x(d.timestamp) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
        ? "rotate(90)translate(0,16)"
        : "rotate(-90)translate(0,-9)")
      .text(d => d.timestamp));

  // Add radial y-axis
  const yAxis = svg.append("g")
    .attr("text-anchor", "middle");

  const yTicks = y.ticks(5).slice(1);

  yAxis.selectAll("circle")
    .data(yTicks)
    .join("circle")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-opacity", 0.1)
    .attr("r", y);

  yAxis.selectAll("text")
    .data(yTicks)
    .join("text")
    .attr("y", d => -y(d))
    .attr("dy", "0.35em")
    .attr("stroke", "#eef")
    .attr("stroke-width", 1)
    .text(d => windScaleArray[d])
    .clone(true)
    .attr("fill", "#000")
    .attr("stroke", "none");
});
