const h = 500;
const w = 500;

var canvas = d3
  .select("#canvas")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .style("background-color", "");

function createCircle(h, w, r, canvas, color) {
  canvas
    .append("circle")
    .attr("cx", w / 2)
    .attr("cy", h / 2)
    .attr("r", r)
    .attr("fill", color);
}

const colors = ["#CCD5AE", "#E9EDC9", "#FEFAE0", "#FAEDCD", "#D4A373"];

createCircle(300, 300, 144, canvas, colors[4]);
createCircle(260, 400, 89, canvas, colors[3]);
createCircle(240, 450, 55, canvas, colors[2]);
createCircle(230, 475, 34, canvas, colors[1]);
createCircle(225, 497, 21, canvas, colors[0]);
