// Main visualization function - better encapsulation
function createCO2EmissionsViz(containerId) {
    // Configuration object for easy customization
    const config = {
      width: 1200,
      height: 1000,
      margin: { top: 50, right: 50, bottom: 250, left: 80 },
      backgroundColor: "#1f1f1f",
      textColor: "#ffffff",
      towerColor: "#555",
      towerStroke: "#333",
      animate: true,
      animationDuration: 500
    };
  
    // Calculate inner dimensions
    const innerWidth = config.width - config.margin.left - config.margin.right;
    const innerHeight = config.height - config.margin.top - config.margin.bottom;
  
    // Select the container
    const container = d3.select(containerId);
  
    // Create SVG
    const svg = container
      .append("svg")
      .attr("width", config.width)
      .attr("height", config.height)
      .style("background-color", config.backgroundColor)
      .style("display", "block")
      .style("margin", "0 auto");
  
    // Add chart title
    const title = svg.append("text")
      .attr("x", config.width / 2)
      .attr("y", config.margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("fill", config.textColor)
      .text("Green Initiatives, in Tonnes of CO2");
  
    // Add main visualization group
    const chart = svg.append("g")
      .attr("transform", `translate(${config.margin.left}, ${config.margin.top})`);
  
    // Add tooltip for interactivity
    const tooltip = container.append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("padding", "10px")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("font-size", "14px");
      
    // State management
    let data = [];
    let years = [];
    let companies = [];
    let currentYearIndex = 0;
    let xScale, yScale, xAxis, yAxis;
    
    // Add axes groups
    const xAxisGroup = chart.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .style("color", "#cccccc");
      
    const yAxisGroup = chart.append("g")
      .style("color", "#cccccc");
      
    // Add y-axis label
    chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x", -innerHeight / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", config.textColor)
      .text("CO2 Emissions (in 1000 Tonnes)");
      
    // Tower group
    const towerGroup = chart.append("g")
      .attr("class", "towers");
      
    // Create Year Slider
    function createSlider() {
      const sliderContainer = container
        .append("div")
        .attr("class", "slider-container")
        .style("margin-top", "20px")
        .style("text-align", "center")
        .style("width", "100%");
  
      sliderContainer.append("p")
        .style("color", config.textColor)
        .style("margin-bottom", "10px")
        .text("Year: ")
        .append("span")
        .attr("id", "year-label")
        .style("font-weight", "bold")
        .text(years[currentYearIndex]);
  
      const sliderWidth = config.width * 0.6;
      
      // Add play button
      const playButton = sliderContainer.append("button")
        .text("▶ Play")
        .style("margin-right", "15px")
        .style("padding", "5px 10px")
        .on("click", toggleAnimation);
        
      // Add slider
      const slider = sliderContainer.append("input")
        .attr("id", "year-slider")
        .attr("type", "range")
        .attr("min", 0)
        .attr("max", years.length - 1)
        .attr("value", currentYearIndex)
        .attr("step", 1)
        .style("width", `${sliderWidth}px`)
        .on("input", function() {
          stopAnimation();
          currentYearIndex = +this.value;
          updateYearDisplay();
          updateVisualization();
        });
        
      // Animation state
      let animationTimer = null;
      
      function toggleAnimation() {
        if (animationTimer) {
          stopAnimation();
          playButton.text("▶ Play");
        } else {
          playButton.text("⏸ Pause");
          animationTimer = setInterval(() => {
            currentYearIndex = (currentYearIndex + 1) % years.length;
            slider.node().value = currentYearIndex;
            updateYearDisplay();
            updateVisualization();
          }, 3000);
        }
      }
      
      function stopAnimation() {
        if (animationTimer) {
          clearInterval(animationTimer);
          animationTimer = null;
        }
      }
    }
    
    // Update year display
    function updateYearDisplay() {
      d3.select("#year-label").text(years[currentYearIndex]);
      title.text(`Green Initiatives, in Tonnes of CO2 - ${years[currentYearIndex]}`);
    }
  
    // Tower geometry creation
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
  
    // Create bubbles for a tower
    function createBubbles(selection, x, towerWidth, valueHeight, numBubbles) {
      const bubbleGroup = selection.append("g")
        .attr("class", "bubbles");
      
      // Generate bubbles based on CO2 value
      for (let i = 0; i < numBubbles; i++) {
        const bubbleYStart = innerHeight; // Start at the base of the cooling tower
        const bubbleYEnd = yScale(valueHeight) - (i * (valueHeight / numBubbles)); // Adjust to match y-scale
        const randOffset = Math.random() * 8 - 4;
        const xPos = x + towerWidth / 2 + Math.sin(i * 0.5) * (towerWidth * 0.3) + randOffset;
        const radius = Math.random() * 6 + 4;
        
        bubbleGroup.append("circle")
          .attr("cx", xPos)
          .attr("cy", bubbleYStart) // Start at the base
          .attr("r", 0) // Start with radius 0 for animation
          .attr("fill", d3.interpolateBlues(0.3 + Math.random() * 0.5))
          .attr("opacity", 0.8)
          .attr("stroke", "#fff")
          .attr("stroke-width", 0.5)
          .transition()
          .duration(config.animationDuration * 3) // Take longer to rise
          .ease(d3.easeLinear) // Smooth linear rise
          .attr("cy", bubbleYEnd) // Animate to the trail height
          .attr("r", radius) // Animate to final radius
          .on("end", function() {
            // Ensure the bubble stays at the final height
            d3.select(this)
              .transition()
              .duration(200)
              .attr("cy", bubbleYEnd);
          });
      }
    }
  
    // Initialize scales and axes
    function initializeScalesAndAxes() {
      // Create x scale for companies
      xScale = d3.scaleBand()
        .domain(companies)
        .range([0, innerWidth])
        .padding(0.5);
  
      // Create y scale for values (adjusted to account for towers below the x-axis)
      yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Value) * 1.2])
        .range([innerHeight, config.margin.top]); // Extend range to match visualization
  
      // Create axes
      xAxisGroup.call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end") // Align text to the end
        .attr("transform", "rotate(-45)") // Rotate text by -45 degrees
        .style("font-size", "14px")
        .style("fill", config.textColor);
  
      yAxisGroup.call(d3.axisLeft(yScale));
    }
  
    // Update visualization based on current year
    function updateVisualization() {
      // Filter data for the current year
      const currentData = data.filter(d => d.Year === years[currentYearIndex]);
      
      // Update y-scale domain if needed
      const maxValue = d3.max(currentData, d => d.Value) * 1.2;
      yScale.domain([0, maxValue]);
      
      // Animate y-axis if enabled
      if (config.animate) {
        yAxisGroup.transition()
          .duration(config.animationDuration)
          .call(d3.axisLeft(yScale));
      } else {
        yAxisGroup.call(d3.axisLeft(yScale));
      }
      
      // Clear previous towers and bars
      towerGroup.selectAll("*").remove();
      
      // Create cooling towers
      const towerHeight = 70; // Height of cooling tower in pixels
      const towerWidth = xScale.bandwidth();
      
      // Draw towers and bubbles for each company
      currentData.forEach(d => {
        const companyX = xScale(d.Brancher);
        const valueHeight = innerHeight - yScale(d.Value);

        // Create tower group
        const tower = towerGroup.append("g")
          .attr("class", "tower")
          .on("mouseover", function(event) {
            tooltip.style("visibility", "visible")
              .html(`<strong>${d.Brancher}</strong><br>Year: ${d.Year}<br>Value: ${d.Value.toLocaleString()} tonnes`)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 40) + "px");
          })
          .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
          });
        
        // Draw cooling tower silhouette
        tower.append("path")
          .attr("d", createTowerPath(companyX, towerWidth, towerHeight))
          .attr("fill", config.towerColor)
          .attr("stroke", config.towerStroke)
          .attr("stroke-width", 1);
        
        // Create smoke bubbles based on CO2 value
        const numBubbles = Math.max(5, Math.ceil(d.Value / 1800));
        createBubbles(tower, companyX, towerWidth, valueHeight, numBubbles);
        
        // Add value label on the cooling tower
        tower.append("text")
          .attr("x", companyX + towerWidth / 2)
          .attr("y", innerHeight - towerHeight / 2) // Position on the cooling tower
          .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .style("fill", config.textColor)
          .style("font-weight", "bold")
          .text(d.Value.toLocaleString());
      });
    }
  
    // Handle window resize
    function handleResize() {
      // Get new container width
      const containerWidth = container.node().getBoundingClientRect().width;
      
      // Only resize if width changes significantly
      if (Math.abs(containerWidth - config.width) > 50) {
        // Update config width
        config.width = containerWidth;
        
        // Recalculate inner width
        const innerWidth = config.width - config.margin.left - config.margin.right;
        
        // Update SVG dimensions
        svg.attr("width", config.width);
        
        // Update x scale
        xScale.range([0, innerWidth]);
        
        // Update x axis
        xAxisGroup.call(d3.axisBottom(xScale));
        
        // Update title position
        title.attr("x", config.width / 2);
        
        // Re-render visualization
        updateVisualization();
      }
    }
  
    // Load and process data
    function loadData() {
      d3.csv("data/dataENG.csv")
        .then(csvData => {
          // Process data
          data = csvData.map(d => ({
            Brancher: d.Brancher,
            Year: d.Year.toString(),
            Value: +d.Value // Convert to number
          }));
          
          // Extract unique companies and years
          companies = Array.from(new Set(data.map(d => d.Brancher)));
          years = Array.from(new Set(data.map(d => d.Year))).sort();
          
          console.log("Companies:", companies);
          console.log("Years:", years);
          
          // Initialize the visualization
          initializeScalesAndAxes();
          createSlider();
          updateYearDisplay();
          updateVisualization();
          
          // Setup resize handler
          window.addEventListener("resize", handleResize);
        })
        .catch(error => {
          console.error("Error loading data:", error);
          container.append("p")
            .style("color", "red")
            .style("text-align", "center")
            .text("Error loading data. Please check the console for details.");
        });
    }
    
    // Initialize the visualization
    loadData();
    
    // Return public methods for external control
    return {
      updateYear: function(yearIndex) {
        currentYearIndex = yearIndex;
        d3.select("#year-slider").node().value = yearIndex;
        updateYearDisplay();
        updateVisualization();
      }
    };
  }
  
  // Initialize the visualization when the document is ready
  document.addEventListener("DOMContentLoaded", function() {
    createCO2EmissionsViz("#canvas");
  });