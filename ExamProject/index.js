// Main visualization function - better encapsulation
function createCO2EmissionsViz(containerId) {
    // Configuration object for easy customization
    const config = {
      width: 1200,
      height: 1100,
      margin: { top: 50, right: 50, bottom: 300, left: 80 },
      backgroundColor: "#1f1f1f",
      textColor: "#ffffff",
      towerColor: "#555",
      towerStroke: "#333",
      animate: true,
      animationDuration: 500,
      initialYScale: 300, // Much lower initial y value to zoom in on small values
      maxYScale: null, // Will be calculated from data
      zoomAnimationDuration: 6000, // Duration for the zoom-out animation
      minBubbles: 1, // Minimum number of bubbles for small values
      maxBubbles: 50, // Maximum number of bubbles for large values
      cameraZoom: 1.5 // Visual zoom factor for the initial view
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
      .style("background-image", "url('BackgroundImg.webp')") // Set the background image
      .style("background-size", "cover") // Ensure the image covers the entire SVG
      .style("background-repeat", "no-repeat") // Prevent tiling
      .style("background-position", "center") // Center the image
      .style("opacity", 1) // Lower the opacity
      .style("display", "block")
      .style("margin", "0 auto");
  
    // Add chart title
    const title = svg.append("text")
      .attr("x", config.width / 2)
      .attr("y", config.margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("fill", "000")
      .style("font-family", "'Roboto', sans-serif") // Updated font
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
      .style("font-size", "14px")
      .style("font-family", "'Roboto', sans-serif"); // Updated font
      
    // State management
    let data = [];
    let years = [];
    let companies = [];
    let currentYearIndex = 0;
    let xScale, yScale, xAxis, yAxis;
    let maxYValue = 0; // Track the actual max value
    let currentYMax = 0; // Current maximum for animation
    let zoomAnimationInProgress = false;
    
    // Add axes groups
    const xAxisGroup = chart.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .style("color", "#1f1f1f");
      
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
      .style("font-family", "'Roboto', sans-serif") // Updated font
      .text("CO2 Emissions (in Tonnes)");
      
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

      // Control buttons container
      const controlsContainer = sliderContainer.append("div")
        .style("margin-bottom", "15px")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("gap", "10px");
      
      // Previous year button
      const prevButton = controlsContainer.append("button")
        .text("◀ Previous Year")
        .style("padding", "5px 15px")
        .on("click", function() {
          stopAnimation();
          playButton.text("▶ Play");
          if (currentYearIndex > 0) {
            currentYearIndex--;
            slider.node().value = currentYearIndex;
            updateYearDisplay();
            updateVisualization(false);
          }
        });
      
      // Add play button with animation toggle
      const playButton = controlsContainer.append("button")
        .text("▶ Play")
        .style("padding", "5px 15px")
        .on("click", toggleAnimation);
      
      // Next year button
      const nextButton = controlsContainer.append("button")
        .text("Next Year ▶")
        .style("padding", "5px 15px")
        .on("click", function() {
          stopAnimation();
          playButton.text("▶ Play");
          if (currentYearIndex < years.length - 1) {
            currentYearIndex++;
            slider.node().value = currentYearIndex;
            updateYearDisplay();
            updateVisualization(false);
          }
        });
      
      // Second row of controls
      const secondRowControls = sliderContainer.append("div")
        .style("margin-top", "10px")
        .style("margin-bottom", "15px")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("gap", "10px");
      
      // Add zoom animation button
      const zoomButton = secondRowControls.append("button")
        .text("🔍 Show Scale Animation")
        .style("padding", "5px 15px")
        .on("click", function() {
          if (!zoomAnimationInProgress) {
            stopAnimation();
            playButton.text("▶ Play");
            startZoomAnimation();
            d3.select(this).text("⏱️ Animating...");
          }
        });
        
      const sliderWidth = config.width * 0.6;
        
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
          playButton.text("▶ Play");
          currentYearIndex = +this.value;
          updateYearDisplay();
          updateVisualization(false); // Don't animate the scale when using slider
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
            updateVisualization(false); // Don't animate scale during year changes
          }, 6500);
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
  
    // Create bubbles for a tower with progressive animation
  function createBubbles(selection, x, towerWidth, finalValue, maxScaleValue) {
    const bubbleGroup = selection.append("g")
      .attr("class", "bubbles")
      .attr("transform", `translate(0, -70)`);
    
    // Calculate number of bubbles based on Value / 1000 rounded
    const numBubbles = Math.round(finalValue / 1000);
    
    // Generate bubbles based on CO2 value
    for (let i = 0; i < numBubbles; i++) {
      const bubbleYStart = innerHeight; // Start at the base of the cooling tower
      
      // Calculate a position for this bubble along the tower path
      const randOffset = Math.random() * 8 - 4;
      const xPos = x + towerWidth / 2 + Math.sin(i * 0.5) * (towerWidth * 0.3) + randOffset;
      const radius = Math.random() * 6 + 4;
      
      // Generate a delay based on bubble's position in the stack
      const delay = i * (config.zoomAnimationDuration / numBubbles / 3);
      
      // Create the bubble with staggered animation
      bubbleGroup.append("circle")
        .attr("cx", xPos)
        .attr("cy", bubbleYStart)
        .attr("r", 0)
        .attr("fill", d3.interpolateBlues(0.3 + Math.random() * 0.5))
        .attr("opacity", 0.8)
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .transition()
        .delay(delay)
        .duration(config.zoomAnimationDuration * 0.8) // Adjusted duration
        .ease(d3.easeLinear)
        .attr("r", radius)
        .attr("cy", yScale(finalValue * (i / numBubbles)));
    }
    
    // Return the bubble group for future updates
    return bubbleGroup;
  }
  
    // Initialize scales and axes
    function initializeScalesAndAxes() {
      // Create x scale for companies
      xScale = d3.scaleBand()
        .domain(companies)
        .range([0, innerWidth])
        .padding(0.5);
  
      // Find the actual maximum value in the data
      maxYValue = d3.max(data, d => d.Value) * 1.2;
      
      // Start with a smaller scale focused on lower values
      currentYMax = config.initialYScale;
      
      // Create y scale for values (adjusted to account for towers below the x-axis)
      yScale = d3.scaleLinear()
        .domain([0, currentYMax])
        .range([innerHeight, config.margin.top]);
  
      // Create axes
      xAxisGroup.call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "translate(-5, 68) rotate(-45)")
        .style("font-size", "14px")
        .style("fill", config.textColor);
  
      yAxisGroup.call(d3.axisLeft(yScale));
    }
  
    // Update visualization based on current year
    function updateVisualization(animateScale = false) {
      // Filter data for the current year
      const currentData = data.filter(d => d.Year === years[currentYearIndex]);
      
      // Get the max value for the current year
      const yearMaxValue = d3.max(currentData, d => d.Value) * 1.2;
      
      // If we're not in a zoom animation and we're asked to animate the scale
      if (animateScale && !zoomAnimationInProgress) {
        // Start with the initial scale and animate to the max value
        currentYMax = config.initialYScale;
        animateYScale(yearMaxValue);
      } else if (!zoomAnimationInProgress) {
        // If not animating, just set the scale directly
        currentYMax = yearMaxValue;
        yScale.domain([0, currentYMax]);
        yAxisGroup.call(d3.axisLeft(yScale));
      }
      
      // Clear previous towers, bars, and gridlines
      towerGroup.selectAll("*").remove();
      chart.selectAll(".gridline").remove();

      // Add stippled gridlines for y-axis ticks
      const yTicks = yScale.ticks();
      chart.selectAll(".gridline")
        .data(yTicks)
        .enter()
        .append("line")
        .attr("class", "gridline")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("y1", d => yScale(d))
        .attr("y2", d => yScale(d))
        .attr("stroke", "#cccccc")
        .attr("stroke-dasharray", "4 4") // Stippled line style
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.5);

      // Move the entire tower group down by 70 pixels
      towerGroup.attr("transform", "translate(0, 70)");
  
      // Create cooling towers
      const towerHeight = 70; // Height of cooling tower in pixels
      const towerWidth = xScale.bandwidth();
      
      // Draw towers and bubbles for each company
      currentData.forEach(d => {
        const companyX = xScale(d.Brancher);
        const valueHeight = d.Value; // Store raw value

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
        const bubbleGroup = createBubbles(tower, companyX, towerWidth, valueHeight, currentYMax);
        
        // Store the final value with the bubble group for updating during animations
        bubbleGroup.attr("data-value", valueHeight);
        
        // Add value label on the cooling tower
        tower.append("text")
          .attr("x", companyX + towerWidth / 2)
          .attr("y", innerHeight - towerHeight / 2)
          .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .style("fill", config.textColor)
          .style("font-weight", "bold")
          .text(d.Value.toLocaleString());
      });
    }
    
    // Animate the y-scale from initial value to target
    function animateYScale(targetMax) {
      const startMax = currentYMax;
      
      d3.select({})
        .transition()
        .duration(config.zoomAnimationDuration)
        .tween("scale", function() {
          const interpolator = d3.interpolateNumber(startMax, targetMax);
          
          return function(t) {
            // Update the current scale maximum
            currentYMax = interpolator(t);
            
            // Update y-scale domain
            yScale.domain([0, currentYMax]);
            
            // Update y-axis with animation
            yAxisGroup.call(d3.axisLeft(yScale));
            
            // Update all bubbles to stay properly positioned within the current scale
            towerGroup.selectAll(".bubbles circle").each(function() {
              const bubble = d3.select(this);
              const finalValue = +bubble.attr("data-final-value");
              const bubbleIndex = +bubble.attr("data-bubble-index");
              const numBubbles = finalValue / 1800; // Estimation of total bubbles
              
              // Calculate the value this bubble represents based on its index
              const bubbleValue = finalValue * (bubbleIndex / numBubbles);
              
              // Ensure the bubble stays within the visible area of the current scale
              const visibleValue = Math.min(bubbleValue, currentYMax);
              const newY = yScale(visibleValue);
              
              // Update position
              bubble.attr("cy", newY);
            });
          };
        });
    }
    
    // Start the zoom animation sequence
    function startZoomAnimation() {
      zoomAnimationInProgress = true;
      
      // Filter data for the current year
      const currentData = data.filter(d => d.Year === years[currentYearIndex]);
      
      // Get the max value for the current year
      const yearMaxValue = d3.max(currentData, d => d.Value) * 1.2;
      
      // Start with a small scale showing the lowest values clearly
      currentYMax = config.initialYScale;
      yScale.domain([0, currentYMax]);
      yAxisGroup.call(d3.axisLeft(yScale));
      
      // Clear previous towers and bars to start fresh
      towerGroup.selectAll("*").remove();
      
      // Redraw the visualization with this scale
      updateVisualization();
      
      // Start the animation to zoom out
      setTimeout(() => {
        // Animate from initial scale to final scale
        animateYScale(yearMaxValue);
        
        // Reset the animation button when finished
        setTimeout(() => {
          zoomAnimationInProgress = false;
          d3.select("button").filter(function() {
            return d3.select(this).text() === "⏱️ Animating...";
          }).text("🔍 Show Scale Animation");
        }, config.zoomAnimationDuration + 500);
      }, 1000);
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
        updateVisualization(false);
      },
      showScaleAnimation: function() {
        startZoomAnimation();
      }
    };
  }
  
  // Initialize the visualization when the document is ready
  document.addEventListener("DOMContentLoaded", function() {
    createCO2EmissionsViz("#canvas");
  });