// ////////// DATA EXAMPLE /////////////

var data = [
  {
    hour: 1,
    wind: 24,
    air_quality: "fair",
    smell: "dry",
    feeling: "cold",
    visability: 13,
  },
  {
    hour: 2,
    wind: 33,
    air_quality: "fair",
    smell: "dry",
    feeling: "cold",
    visability: 13,
  },
  {
    hour: 3,
    wind: 24,
    air_quality: "poor",
    smell: "dry",
    feeling: "cold",
    visability: 13,
  },
  {
    hour: 4,
    wind: 24,
    air_quality: "poor",
    smell: "dry",
    feeling: "very cold",
    visability: 13,
  },
  {
    hour: 5,
    wind: 24,
    air_quality: "poor",
    smell: "dry",
    feeling: "very cold",
    visability: 13,
  },
  {
    hour: 6,
    wind: 13,
    air_quality: "poor",
    smell: "crisp",
    feeling: "very cold",
    visability: 13,
  },
  {
    hour: 7,
    wind: 22,
    air_quality: "poor",
    smell: "crisp",
    feeling: "very cold",
    visability: 13,
  },
  {
    hour: 8,
    wind: 22,
    air_quality: "poor",
    smell: "crisp",
    feeling: "very cold",
    visability: 13,
  },
  {
    hour: 9,
    wind: 22,
    air_quality: "fair",
    smell: "frosty",
    feeling: "very cold",
    visability: 13,
  },
  {
    hour: 10,
    wind: 5,
    air_quality: "fair",
    smell: "frosty",
    feeling: "very cold",
    visability: 13,
  }
]


///////// GLOBAL VARS //////////

var margin = { top: 10, right: 10, bottom: 10, left: 10 },
  width = 800 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom,
  innerRadius = 80,
  outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

let smells = new Set(data.map(d => d.smell))
let qualities = new Set(data.map(d => d.air_quality))


// append the svg object to the canvas div
var svg = d3.select("#canvas")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .style("background-color", "#fae3c6")

// X scale
var x = d3.scaleLinear()
  .range([50, width - 50])
  .domain(d3.extent(data, d => d.hour)) //same as [d3.min(data, d => d.hour),d3.max(data, d => d.hour)]

// Heigth scale - wind
var heightScale = d3.scaleLinear()
  .range([0, 60])
  .domain([0, 30]);

// outer color scale - smells
var smellColor = d3.scaleOrdinal()
  .range(["#C2A878", "#A4D4AE", "#B6E0FE"])
  .domain(Array.from(smells))

// inner color scale - qualities
var qualityColor = d3.scaleOrdinal()
  .range(["#FF6347", "#32CD32"])
  .domain(Array.from(qualities))


// circles
svg
  .selectAll("circle")
  .data(data)
  .join("circle")
  .attr("r", 20)
  .attr("cx", d => x(d.hour))
  .attr("cy", height / 2)
  .attr("fill", d => smellColor(d.smell));

// rects

svg
  .selectAll("rect")
  .data(data)
  .join("rect")
  .attr("x", d => x(d.hour) - 3)
  .attr("y", d => height / 2 - heightScale(d.wind) / 2)
  .attr("width", 6)
  .attr("height", d => heightScale(d.wind))
  .attr("fill", d => qualityColor(d.air_quality))
  .attr("transform", function (d) {
    if (d.feeling == "very cold") {
      //get coords of rect center
      let xCoord = x(d.hour)
      let yCoord = height / 2
      return `rotate(45,${xCoord},${yCoord})` //The "new school way" (string template)
    }
  });


/////// LEGENDS - Thank you Claude.ai ///////

// Add a legend group at the bottom of the canvas
const legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", `translate(${width / 2}, ${height - 120})`);

// Background for the legend
legend.append("rect")
  .attr("x", -340)
  .attr("y", -10)
  .attr("width", 700)
  .attr("height", 110)
  .attr("fill", "#f5f5f5")
  .attr("rx", 10)
  .attr("ry", 10)
  .attr("stroke", "#ccc")
  .attr("stroke-width", 1)
  .attr("opacity", 0.8);

// Smell color legend (circles)
const smellLegend = legend.append("g")
  .attr("transform", "translate(-300, 30)");

smellLegend.append("text")
  .attr("x", 0)
  .attr("y", 0)
  .attr("font-weight", "bold")
  .text("Smell:");

// Create smell color swatches
Array.from(smells).forEach((smell, i) => {
  smellLegend.append("circle")
    .attr("r", 8)
    .attr("cx", 60 + i * 80)
    .attr("cy", -4)
    .attr("fill", smellColor(smell));

  smellLegend.append("text")
    .attr("x", 75 + i * 80)
    .attr("y", 0)
    .text(smell);
});

// Air quality legend (rectangles)
const qualityLegend = legend.append("g")
  .attr("transform", "translate(-300, 80)");

qualityLegend.append("text")
  .attr("x", 0)
  .attr("y", 0)
  .attr("font-weight", "bold")
  .text("Air Quality:");

// Create air quality swatches
Array.from(qualities).forEach((quality, i) => {
  qualityLegend.append("rect")
    .attr("x", 90 + i * 80)
    .attr("y", -9)
    .attr("width", 6)
    .attr("height", 12)
    .attr("fill", qualityColor(quality));

  qualityLegend.append("text")
    .attr("x", 100 + i * 80)
    .attr("y", 0)
    .text(quality);
});

// Wind speed legend
const windLegend = legend.append("g")
  .attr("transform", "translate(30, 30)");

windLegend.append("text")
  .attr("x", 0)
  .attr("y", 0)
  .attr("font-weight", "bold")
  .text("Wind Speed:");

// Create example rectangles for wind
[10, 20, 30].forEach((speed, i) => {
  windLegend.append("rect")
    .attr("x", 100 + i * 70)
    .attr("y", -heightScale(speed) / 2)
    .attr("width", 6)
    .attr("height", heightScale(speed))
    .attr("fill", "#999");

  windLegend.append("text")
    .attr("x", 95 + i * 70)
    .attr("y", 0)
    .text(`${speed} mph`);
});

// Feeling legend (rotation)
const feelingLegend = legend.append("g")
  .attr("transform", "translate(30, 80)");

feelingLegend.append("text")
  .attr("x", 0)
  .attr("y", 0)
  .attr("font-weight", "bold")
  .text("Feeling:");

// Normal rectangle
feelingLegend.append("rect")
  .attr("x", 80)
  .attr("y", -6)
  .attr("width", 6)
  .attr("height", 12)
  .attr("fill", "#999");

feelingLegend.append("text")
  .attr("x", 95)
  .attr("y", 0)
  .text("Cold");

// Rotated rectangle for "very cold"
const rotRect = feelingLegend.append("rect")
  .attr("x", 150)
  .attr("y", -6)
  .attr("width", 6)
  .attr("height", 12)
  .attr("fill", "#999")
  .attr("transform", "rotate(45 153 0)");

feelingLegend.append("text")
  .attr("x", 165)
  .attr("y", 0)
  .text("Very Cold");