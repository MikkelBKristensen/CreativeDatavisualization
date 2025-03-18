d3.csv("data.csv").then((data) => {
    // Convert string "true"/"false" to actual boolean values
    data.forEach(d => {
        d.solo = d.solo === "true"; // This converts "true" to true and anything else to false
        d.hours = +d.hours; // Also convert hours to a number
    });
    
    const height = 600;
    const width = 800;
    const margin = { top: 80, right: 30, bottom: 40, left: 40 }; // Increased top margin for header

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
    
    // Add letter-like header background
    svg.append("rect")
        .attr("x", width/2 - 100)
        .attr("y", -60)
        .attr("width", 200)
        .attr("height", 40)
        .attr("fill", "#f8f8f8")
        .attr("stroke", "#333")
        .attr("stroke-width", 1)
        .attr("rx", 5)
        .attr("ry", 5);
    
    // Add the letter-like header text
    svg.append("text")
        .attr("x", width/2)
        .attr("y", height/2-margin.top)
        .attr("font-family", "Brush Script MT, cursive")
        .attr("font-size", "48px")
        .attr("fill", "#333")
        .attr("text-anchor", "middle")
        .text("Dear Data,");

    // x-axis scale
    const x = d3.scaleLinear()
        .domain([0, 10])
        .range([0, width])

    // y-axis scale
    const y = d3.scaleLinear()
        .domain([0, 10])
        .nice()
        .range([height, 0]);

    // Get the number of rows needed
    const numRows = Math.ceil(data.length / 10);
    
    // Create a group for each data point - fix the ordering issue
    const points = svg.selectAll("g.datapoint")
        .data(data)
        .join("g")
        .attr("class", "datapoint")
        .attr("transform", (d, i) => {
            // Calculate row and column (fixed order - top row is first)
            const row = Math.floor(i / 10);
            const col = i % 10;
            return `translate(${x(col)}, ${y(numRows - 1 - row)})`;
        });

    // Add the appropriate shape to each group
    points.each(function(d) {
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
});