import * as d3 from 'd3';

/**
 * Creates a simple CO2 emissions bar chart using D3
 * @param {string|Element} container - Container element or selector
 * @param {Object} options - Chart configuration options
 * @returns {Object} - Chart API for updating and manipulating the chart
 */
export function createCO2EmissionsChart(container, options = {}) {
  // Default configuration
  const config = {
    width: 800,
    height: 500,
    margin: { top: 60, right: 50, bottom: 150, left: 80 },
    barColor: "#4c9c6e",
    barHoverColor: "#6bbf8e",
    textColor: "#ffffff",
    backgroundColor: "#1f1f1f",
    title: "Green Initiatives, in Tonnes of CO2",
    xAxisLabel: "Companies",
    yAxisLabel: "CO2 Emissions (in Tonnes)",
    animationDuration: 500,
    ...options
  };

  // Calculate dimensions
  const innerWidth = config.width - config.margin.left - config.margin.right;
  const innerHeight = config.height - config.margin.top - config.margin.bottom;

  // Select the container
  const containerSel = d3.select(container);

  // Create SVG element
  const svg = containerSel
    .append("svg")
    .attr("width", config.width)
    .attr("height", config.height)
    .style("background-color", config.backgroundColor)
    .style("display", "block")
    .style("margin", "0 auto");

  // Create the chart group with margins
  const chart = svg.append("g")
    .attr("transform", `translate(${config.margin.left}, ${config.margin.top})`);

  // Create title
  const title = svg.append("text")
    .attr("x", config.width / 2)
    .attr("y", config.margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .style("fill", config.textColor)
    .style("font-family", "'Roboto', sans-serif")
    .text(config.title);

  // Create tooltip
  const tooltip = containerSel.append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "rgba(0, 0, 0, 0.8)")
    .style("color", "white")
    .style("padding", "10px")
    .style("border-radius", "5px")
    .style("pointer-events", "none")
    .style("font-size", "14px")
    .style("font-family", "'Roboto', sans-serif");

  // Create scales
  const xScale = d3.scaleBand()
    .range([0, innerWidth])
    .padding(0.3);

  const yScale = d3.scaleLinear()
    .range([innerHeight, 0]);

  // Create axes groups
  const xAxis = chart.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .style("color", config.textColor);

  const yAxis = chart.append("g")
    .attr("class", "y-axis")
    .style("color", config.textColor);

  // X-axis label
  chart.append("text")
    .attr("class", "x-axis-label")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + config.margin.bottom / 1.5)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("fill", config.textColor)
    .text(config.xAxisLabel);

  // Y-axis label
  chart.append("text")
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -config.margin.left / 1.5)
    .attr("x", -innerHeight / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("fill", config.textColor)
    .text(config.yAxisLabel);

  // Create bars group
  const barsGroup = chart.append("g")
    .attr("class", "bars");

  // Function to update the chart with new data
  function updateChart(data, year) {
    // Update title
    if (year) {
      title.text(`${config.title} - ${year}`);
    }

    // Update scales
    xScale.domain(data.map(d => d.Brancher));
    yScale.domain([0, d3.max(data, d => d.Value) * 1.1]); // 10% padding on top

    // Update axes
    xAxis.transition()
      .duration(config.animationDuration)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .style("font-size", "12px");
      
    yAxis.transition()
      .duration(config.animationDuration)
      .call(d3.axisLeft(yScale));

    // Data join for bars
    const bars = barsGroup.selectAll(".bar")
      .data(data, d => d.Brancher);
    
    // Remove old bars
    bars.exit()
      .transition()
      .duration(config.animationDuration)
      .attr("y", innerHeight)
      .attr("height", 0)
      .remove();
    
    // Add new bars
    const newBars = bars.enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.Brancher))
      .attr("width", xScale.bandwidth())
      .attr("y", innerHeight)
      .attr("height", 0)
      .style("fill", config.barColor)
      .style("stroke", d3.color(config.barColor).darker(0.5))
      .style("stroke-width", 1);
    
    // Update all bars
    newBars.merge(bars)
      .on("mouseover", function(event, d) {
        d3.select(this)
          .style("fill", config.barHoverColor)
          .style("cursor", "pointer");
        
        tooltip.style("visibility", "visible")
          .html(`<strong>${d.Brancher}</strong><br>${d.Value.toLocaleString()} tonnes`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 40) + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .style("fill", config.barColor)
          .style("cursor", "default");
        
        tooltip.style("visibility", "hidden");
      })
      .transition()
      .duration(config.animationDuration)
      .attr("x", d => xScale(d.Brancher))
      .attr("width", xScale.bandwidth())
      .attr("y", d => yScale(d.Value))
      .attr("height", d => innerHeight - yScale(d.Value));
  }

  // Public API for the chart
  return {
    update: updateChart,
    
    setTitle: function(newTitle) {
      config.title = newTitle;
      title.text(newTitle);
      return this;
    },
    
    setColors: function(barColor, hoverColor) {
      config.barColor = barColor || config.barColor;
      config.barHoverColor = hoverColor || d3.color(config.barColor).brighter(0.5);
      
      barsGroup.selectAll(".bar")
        .style("fill", config.barColor)
        .style("stroke", d3.color(config.barColor).darker(0.5));
        
      return this;
    },
    
    resize: function(width, height) {
      // Store original data before resizing
      const currentData = barsGroup.selectAll(".bar").data();
      const currentTitle = title.text();
      
      // Update config dimensions
      config.width = width || config.width;
      config.height = height || config.height;
      
      // Recalculate dimensions
      const innerWidth = config.width - config.margin.left - config.margin.right;
      const innerHeight = config.height - config.margin.top - config.margin.bottom;
      
      // Update SVG size
      svg.attr("width", config.width)
         .attr("height", config.height);
      
      // Update title position
      title.attr("x", config.width / 2);
      
      // Update chart position
      chart.attr("transform", `translate(${config.margin.left}, ${config.margin.top})`);
      
      // Update scales
      xScale.range([0, innerWidth]);
      yScale.range([innerHeight, 0]);
      
      // Update axes positions
      xAxis.attr("transform", `translate(0, ${innerHeight})`);
      
      // Update labels
      chart.select(".x-axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + config.margin.bottom / 1.5);
        
      chart.select(".y-axis-label")
        .attr("x", -innerHeight / 2);
      
      // Redraw with updated dimensions
      if (currentData.length > 0) {
        // Extract year from the current title (if it exists)
        const yearMatch = currentTitle.match(/\d{4}$/);
        const year = yearMatch ? yearMatch[0] : null;
        
        // Re-render the chart with the same data but new dimensions
        this.update(currentData, year);
      }
      
      return this;
    },
    
    destroy: function() {
      svg.remove();
      tooltip.remove();
      return null;
    }
  };
}