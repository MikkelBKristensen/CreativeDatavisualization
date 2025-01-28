const h = 500;
const w = 500;

var canvas = d3
  .select("#myVis")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .style("background-color", "grey");

function createCircle(h, w, r, canvas, color) {
  canvas
    .append("circle")
    .attr("cx", w / 2)
    .attr("cy", h / 2)
    .attr("r", r)
    .attr("fill", color);
}

createCircle(500, 500, 34, canvas, "purple");
createCircle(500, 550, 27, canvas, "yellow");
createCircle(500, 600, 18, canvas, "green");
createCircle(500, 630, 11, canvas, "red");