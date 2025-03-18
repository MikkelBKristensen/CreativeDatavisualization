d3.csv("data.csv").then((data) => {
    // Convert string "true"/"false" to actual boolean values
    data.forEach(d => {
        d.solo = d.solo === "true"; // This converts "true" to true and anything else to false
        d.hours = +d.hours; // Also convert hours to a number
    });

    const height = 500;
    const width = 1400;
    const margin = { top: 120, right: 30, bottom: 120, left: 40 }; // Increased top margin for header and bottom for legend

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

    // Add the letter-like header text (without the box)
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -60)
        .attr("font-family", "Brush Script MT, cursive")
        .attr("font-size", "48px")
        .attr("fill", "#333")
        .attr("text-anchor", "middle")
        .text("Dear Data,");

    // Calculate visualization area and spacing
    const dataHeight = height - 40; // Leave space for legend at bottom
    const numRows = Math.ceil(data.length / 10);
    const rowHeight = dataHeight / numRows;

    // x-axis scale - evenly distribute across width
    const x = d3.scaleLinear()
        .domain([0, 10])
        .range([0, width]);

    // y-axis scale - distribute rows evenly in available space
    const y = d3.scaleLinear()
        .domain([0, numRows])
        .range([0, dataHeight]);

    // Create a group for each data point with improved spacing
    const points = svg.selectAll("g.datapoint")
        .data(data)
        .join("g")
        .attr("class", "datapoint")
        .attr("transform", (d, i) => {
            // Calculate row and column for nice spacing
            const row = Math.floor(i / 10);
            const col = i % 10;
            // Center in column and space rows evenly
            return `translate(${x(col + 0.5)}, ${y(row) + rowHeight / 2})`;
        });

    // Add the appropriate shape to each group
    points.each(function (d) {
        const shape = d.type && shapeMap[d.type] ?
            shapeMap[d.type] :
            d3.symbol().type(d3.symbolSquare).size(calcSize(d.hours, d.solo) * 50);

        d3.select(this)
            .append("path")
            .attr("d", shape)
            .attr("fill", colormap[d.howGood]);

        // Add a small dot indicator if solo is true
        if (d.solo) {
            d3.select(this)
                .append("circle")
                .attr("cx", calcSize(d.hours, d.solo) + 8) // Position to the right
                .attr("cy", -10)
                .attr("r", 3) // Small fixed size
                .attr("fill", "#000"); // Black dot
        }
    });

    // Add Legend
    const legendY = height + 20;

    // Create legend container with box
    const legendContainer = svg.append("g")
        .attr("class", "legend-container");

    // Add legend box background
    legendContainer.append("rect")
        .attr("x", 0)
        .attr("y", legendY - 25)
        .attr("width", width)
        .attr("height", 100)
        .attr("fill", "#f8f8f8")
        .attr("stroke", "#333")
        .attr("stroke-width", 1)
        .attr("rx", 5)
        .attr("ry", 5);

    // Shape legend
    const shapeTypes = Object.keys(shapeMap);
    const shapeScale = 100; // Fixed size for legend icons

    const shapeLegend = legendContainer.append("g")
        .attr("class", "shape-legend")
        .attr("transform", `translate(20, ${legendY})`);

    shapeLegend.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .attr("font-weight", "bold")
        .text("Activity Types:");

    shapeTypes.forEach((type, i) => {
        const legendItem = shapeLegend.append("g")
            .attr("transform", `translate(${i * 120}, 20)`);

        // Create shape symbol for legend
        const symbol = d3.symbol()
            .type(shapeMap[type].type())
            .size(shapeScale);

        legendItem.append("path")
            .attr("d", symbol)
            .attr("fill", "#666");

        legendItem.append("text")
            .attr("x", 20)
            .attr("y", 5)
            .text(type.charAt(0).toUpperCase() + type.slice(1));
    });

    // Color legend
    const colorTypes = Object.keys(colormap);

    const colorLegend = legendContainer.append("g")
        .attr("class", "color-legend")
        .attr("transform", `translate(${width / 2}, ${legendY})`);

    colorLegend.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .attr("font-weight", "bold")
        .text("Quality Rating:");

    colorTypes.forEach((type, i) => {
        const legendItem = colorLegend.append("g")
            .attr("transform", `translate(${i * 100}, 20)`);

        legendItem.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", colormap[type]);

        legendItem.append("text")
            .attr("x", 25)
            .attr("y", 12)
            .text(type.charAt(0).toUpperCase() + type.slice(1));
    });

    // Solo indicator legend
    const soloLegend = legendContainer.append("g")
        .attr("class", "solo-legend")
        .attr("transform", `translate(20, ${legendY + 60})`);

    soloLegend.append("text")
        .attr("font-weight", "bold")
        .text("Solo Work:");

    soloLegend.append("g")
        .attr("transform", "translate(100, 0)")
        .append("circle")
        .attr("r", 3)
        .attr("fill", "#000");

    soloLegend.append("text")
        .attr("x", 110)
        .attr("y", 5)
        .text("= Solo activity");

    // Size legend
    const sizeLegend = legendContainer.append("g")
        .attr("class", "size-legend")
        .attr("transform", `translate(${width / 2}, ${legendY + 60})`);

    sizeLegend.append("text")
        .attr("font-weight", "bold")
        .text("Size:");

    sizeLegend.append("text")
        .attr("x", 50)
        .attr("y", 5)
        .text("Represents hours spent");
});