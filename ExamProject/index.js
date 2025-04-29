// Load the data and create the visualization
d3.csv("data/data.csv").then((data) => {
    // 1. Process the data
    // Parse numeric values
    data.forEach(d => {
        d.Value = +d.Value; // Convert Value to number
        d.Year = d.Year.toString(); // Ensure Year is a string
    });

    // Extract unique brancher names and years
    const brancher = Array.from(new Set(data.map(d => d.Brancher)));
    const years = Array.from(new Set(data.map(d => d.Year))).sort();
    console.log("Unique Brancher:", brancher);
    console.log("Years:", years);

    // Set initial year
    let currentYear = years[0];

    // 2. Setup SVG canvas
    const height = 900;
    const width = 1500;
    const margin = { top: 50, right: 50, bottom: 100, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select("#canvas")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .style("background-color", "#1f1f1f");

    // Add a title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("fill", "#ffffff")
        .text("Green Initiatives, in Tonnes of CO2");

    // Add a group for the main visualization
    const g = svg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // 3. Create scales
    // 3.1 Create xScale for brancher
    const xScale = d3.scaleBand()
        .domain(brancher)
        .range([0, innerWidth])
        .padding(0.5);

    // 3.2 Create yScale for values
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Value) * 1.2]) // Add 20% headroom
        .range([innerHeight, 0]);

    // 4. Create axes
    // 4.1 Create xAxis
    const xAxis = g.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .style("color", "#cccccc");

    // Style x-axis text
    xAxis.selectAll("text")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "#ffffff");

    // 4.2 Create yAxis
    const yAxis = g.append("g")
        .call(d3.axisLeft(yScale))
        .style("color", "#cccccc");

    // Add y-axis label
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", -innerHeight / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "#ffffff")
        .text("CO2 Emissions (in 1000 Tonnes)");

    // 5. Create a group for the towers and bars
    const towerGroup = g.append("g")
        .attr("class", "towers");

    // 6. Create a slider for years
    const sliderContainer = d3.select("#canvas")
        .append("div")
        .attr("class", "slider-container")
        .style("margin-top", "20px")
        .style("text-align", "center")
        .style("width", "100%");

    sliderContainer.append("p")
        .style("color", "#ffffff")
        .style("margin-bottom", "10px")
        .text("Year: ")
        .append("span")
        .attr("id", "year-label")
        .style("font-weight", "bold")
        .text(currentYear);

    const sliderWidth = width * 0.6;
    const slider = sliderContainer.append("input")
        .attr("type", "range")
        .attr("min", 0)
        .attr("max", years.length - 1)
        .attr("value", 0)
        .attr("step", 1)
        .style("width", `${sliderWidth}px`)
        .on("input", function() {
            const yearIndex = +this.value;
            currentYear = years[yearIndex];
            d3.select("#year-label").text(currentYear);
            updateVisualization();
        });

    // Function to create a cooling tower path
    function createTowerPath(x, width, height) {
        const baseWidth = width * 0.7;
        const topWidth = width * 0.5;
        
        return `
            M ${x + (width - baseWidth) / 2}, ${innerHeight}
            L ${x + (width - topWidth) / 2}, ${innerHeight - height}
            C ${x + (width - topWidth) / 2 + topWidth * 0.1}, ${innerHeight - height - height * 0.05}
              ${x + (width - topWidth) / 2 + topWidth * 0.9}, ${innerHeight - height - height * 0.05}
              ${x + (width - topWidth) / 2 + topWidth}, ${innerHeight - height}
            L ${x + (width + baseWidth) / 2}, ${innerHeight}
            Z
        `;
    }

    // Function to create bubbles for a tower
    function createBubbles(selection, x, towerWidth, valueHeight, numBubbles) {
        const bubbleGroup = selection.append("g")
            .attr("class", "bubbles");
        
        // Calculate bubble positions using a "smoke stack" pattern
        for (let i = 0; i < numBubbles; i++) {
            const bubbleY = innerHeight - 80 - (i * (valueHeight) / numBubbles);
            const randOffset = Math.random() * 8 - 4;
            const xPos = x + towerWidth / 2 + Math.sin(i * 0.5) * (towerWidth * 0.3) + randOffset;
            const radius = Math.random() * 6 + 4;
            
            bubbleGroup.append("circle")
                .attr("cx", xPos)
                .attr("cy", bubbleY)
                .attr("r", radius)
                .attr("fill", d3.interpolateBlues(0.3 + Math.random() * 0.5))
                .attr("opacity", 0.8)
                .attr("stroke", "#fff")
                .attr("stroke-width", 0.5);
        }
    }

    // Tooltip for data points
    const tooltip = d3.select("#canvas")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("padding", "10px")
        .style("border-radius", "5px")
        .style("pointer-events", "none")
        .style("font-size", "14px");

    // Function to update the visualization based on the current year
    function updateVisualization() {
        // Filter data for the current year
        const currentData = data.filter(d => d.Year === currentYear);
        
        // Update y-scale domain if needed
        yScale.domain([0, d3.max(currentData, d => d.Value) * 1.2]);
        yAxis.transition().duration(500).call(d3.axisLeft(yScale));
        
        // Clear previous towers and bars
        towerGroup.selectAll("*").remove();
        
        // Create cooling towers
        const towerHeight = 70; // Height of cooling tower in pixels
        const towerWidth = xScale.bandwidth();
        
        // Draw towers and bubbles for each branch
        currentData.forEach(d => {
            const branchX = xScale(d.Brancher);
            const valueHeight = innerHeight - yScale(d.Value);
            
            // Create tower group
            const tower = towerGroup.append("g")
                .attr("class", "tower")
                .on("mouseover", function(event) {
                    tooltip.style("visibility", "visible")
                        .html(`<strong>${d.Brancher}</strong><br>Year: ${d.Year}<br>Value: ${d.Value}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 40) + "px");
                })
                .on("mouseout", function() {
                    tooltip.style("visibility", "hidden");
                });
            
            // Draw cooling tower silhouette
            tower.append("path")
                .attr("d", createTowerPath(branchX, towerWidth, towerHeight))
                .attr("fill", "#555")
                .attr("stroke", "#333")
                .attr("stroke-width", 1);
            
            // Create value bar background (optional, for better visibility)
            // tower.append("rect")
            //     .attr("x", branchX)
            //     .attr("y", yScale(d.Value))
            //     .attr("width", towerWidth)
            //     .attr("height", valueHeight - towerHeight)
            //     .attr("fill", "rgba(100, 100, 200, 0.1)")
            //     .attr("stroke", "rgba(100, 100, 200, 0.3)")
            //     .attr("stroke-width", 1);
            
            // Create smoke bubbles
            const numBubbles = Math.max(5, Math.ceil(d.Value / 1800));
            createBubbles(tower, branchX, towerWidth, valueHeight, numBubbles);
            
            // Add value label
            tower.append("text")
                .attr("x", branchX + towerWidth / 2)
                .attr("y", yScale(d.Value) - 10)
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .style("fill", "#ffffff")
                .style("font-weight", "bold")
                .text(d.Value);
        });

        // Update title with current year
        svg.select("text").text(`Green Initiatives, in Tonnes of CO2 - ${currentYear}`);
    }

    // Initial visualization
    updateVisualization();

    // Handle window resize
    window.addEventListener("resize", function() {
        // Get new container dimensions and update if needed
        // This is a placeholder - you would need to implement actual resize handling
        console.log("Window resized - visualization should adapt");
    });
});