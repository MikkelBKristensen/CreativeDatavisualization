d3.csv("data/data.csv").then((data) => {

    // Steps to make the visualization
    // 1. Fetch data into data variable
    const brancher = Array.from(new Set(data.map(d => d.Brancher)));
    console.log("Unique Brancher:", brancher);
    data.forEach(d => {
        // Extract unique brancher names
        
    });
    // 2. Setup SVG canvas
    const height = 800;
    const width = 1400;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const svg = d3.select("#canvas")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style("background-color", "#1f1f1f");


    // 3. Create scales
    const xScale = d3.scaleBand()
        .domain(brancher)
        .range([margin.left, width - margin.right])
        .padding(1);
});