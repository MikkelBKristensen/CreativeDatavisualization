var w = 800;
var h = 800;

var canvas = d3.select('#canvas')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .style('background-color', 'lightgrey');

var objectArray = [
    {
        name: "Mikkel",
        coffee: 2,
        water: 1,
    },
    {
        name: "Mads",
        coffee: 4,
        water: 5,
    },
    {
        name: "Anders",
        coffee: 3,
        water: 2,
    },
    {
        name: "Jesper",
        coffee: 1,
        water: 3,
    },
    {
        name: "Morten",
        coffee: 2,
        water: 4,
    }
];

var centerLine = d3.select("#canvas");

var square = canvas.selectAll("squareData")
    .data(objectArray)
    .join("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("x", h / 2)
    .attr("y", h / 2)
    .attr("fill", "blue");