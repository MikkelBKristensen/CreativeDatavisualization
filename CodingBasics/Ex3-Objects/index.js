d3.csv("data.csv").then((data) => {
  const width = 600;
  const height = width;
  const innerRadius = 100;
  const outerRadius = 250;

  
  const windScale = {
    NA: 0,
    "Let-": 1,
    Let: 2,
    "Let+": 3,
    "Moderat-": 4,
    Moderat: 5,
    "Moderat+": 6,
  };

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
    .domain(data.map((d) => d.timestamp)) // Uses timestmaps at category
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
    .text((d) => `Time: ${d.timestamp}h\nWind: ${d.wind}`);
});
