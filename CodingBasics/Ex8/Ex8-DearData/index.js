d3.csv("data.csv").then((data) => {
    const height = 600;
    const width = 800;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const scaleConst = 5;

    const colormap = {
        "terrible": "#ae2c0e",
        "meh": "#8d909b",
        "ok": "#f0e51d",
        "fine": "#ec8517",
        "great": "#35bd1d",
        "awesome": "#e96fb8"
    }

    // Define shape generation functions
    const shapeMap = {
        "research": d3.symbol().type(d3.symbolDiamond).size(d => calcSize(d.hours, d.solo) * 50),
        "coding": d3.symbol().type(d3.symbolCircle).size(d => calcSize(d.hours, d.solo) * 50),
        "writing": d3.symbol().type(d3.symbolSquare).size(d => calcSize(d.hours, d.solo) * 50),
        "meeting": d3.symbol().type(d3.symbolWye).size(d => calcSize(d.hours, d.solo) * 50),
        "testing": d3.symbol().type(d3.symbolTriangle).size(d => calcSize(d.hours, d.solo) * 50),
        "prep": d3.symbol().type(d3.symbolTriangle).size(d => calcSize(d.hours, d.solo) * 50)
    }

    function calcSize(hours, solo) {
        return solo ? (scaleConst * hours) / 2 : scaleConst * hours;
    }

    const svg = d3.select("#canvas")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("background-color", "#fff9e8")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // x-axis scale
    const x = d3.scaleLinear()
        .domain([0, 10])
        .range([0, width])

    // y-axis scale
    const y = d3.scaleLinear()
        .domain([0, 10])
        .nice()
        .range([height, 0]);

    // Create a group for each data point
    const points = svg.selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", (d, i) => `translate(${x(i % 10)}, ${y(4- Math.floor(i / 10))})`);

    // Add the appropriate shape to each group
    points.each(function(d) {
        const shape = d.type && shapeMap[d.type] ? 
                      shapeMap[d.type] : 
                      d3.symbol().type(d3.symbolSquare).size(calcSize(d.hours, d.solo) * 50);
        
        d3.select(this)
            .append("path")
            .attr("d", shape)
            .attr("fill", colormap[d.howGood]);
    });
});