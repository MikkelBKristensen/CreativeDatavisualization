d3.csv("data.csv").then((data) => {
    const height = 600;
    const width = 800;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const windScale = {
        "NA": 0,
        "Let-": 1,
        "Let": 2,
        "Let+": 3,
        "Moderat-": 4,
        "Moderat": 5,
        "Moderat+": 6,
    };

    const svg = d3.select("#canvas")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // x-axis scale
    const x = d3.scaleBand()
        .domain(data.map((_, i) => i))
        .range([0, width])
        .padding(0.1);

    // y-axis scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => windScale[d.wind])])
        .nice()
        .range([height, 0]);

    // Add x-axis grid lines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x)
            .tickSize(-height)
            .tickFormat("")
        )
        .selectAll("line")
        .attr("stroke", "#ccc")
        .attr("stroke-dasharray", "2,2");

    // Add y-axis grid lines
    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat("")
        )
        .selectAll("line")
        .attr("stroke", "#ccc")
        .attr("stroke-dasharray", "2,2");

    // x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(i => data[i].timestamp))
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin.bottom - 10)
        .attr("fill", "#000")
        .attr("text-anchor", "middle")
        .text("Timestamp");

    // y-axis
    svg.append("g")
        .call(d3.axisLeft(y).ticks(6))
        .append("text")
        .attr("x", -margin.left)
        .attr("y", -10)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .text("Wind Strength");

    // x-axis positioning
    svg.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", (_, i) => x(i) + x.bandwidth() / 2)
        .attr("cy", d => y(windScale[d.wind]))
        .attr("r", 15)
        .attr("fill", d => d.color);
});