const h = 500;
const w = 500;

var canvas = d3.select("#canvas")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .style("background-color", "maroon");

var cupsOfCocoa = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
const colors = ["#CCD5AE", "#E9EDC9", "#FEFAE0", "#FAEDCD", "#D4A373"];

// For every person, draw on circle
var circsCocoa = canvas.selectAll("circsCocoa")
    .data(cupsOfCocoa)
    .join("rect")
    .attr("x", function (d) {
        return 25 + d * 4
    })
    .attr("y", h / 2)
    .attr("width", function (d) {
        return d;
    })
    .attr("height", function (d) {
        return d;
    })
    .attr("fill", (_, i) => colors[i])
    .attr("stroke", "black")