import * as d3 from 'd3';

export function createCO2EmissionsViz(container, width, height) {
  const config = {
    width,
    height,
    margin: { top: 50, right: 50, bottom: 300, left: 80 },
    backgroundColor: "#1f1f1f",
    textColor: "#ffffff",
    towerColor: "#555",
    towerStroke: "#333",
    animate: true,
    animationDuration: 500,
    initialYScale: 300,
    maxYScale: null,
    zoomAnimationDuration: 6000,
    minBubbles: 1,
    maxBubbles: 50,
    cameraZoom: 1.5
  };

  const innerWidth = config.width - config.margin.left - config.margin.right;
  const innerHeight = config.height - config.margin.top - config.margin.bottom;

  const containerSel = d3.select(container);

  const svg = containerSel
    .append("svg")
    .attr("width", config.width)
    .attr("height", config.height)
    .style("background-image", "url('/smoke-towers.webp')")
    .style("background-size", "cover")
    .style("background-repeat", "no-repeat")
    .style("background-position", "center")
    .style("display", "block")
    .style("margin", "0 auto");

  const title = svg.append("text")
    .attr("x", config.width / 2)
    .attr("y", config.margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .style("fill", "#000")
    .style("font-family", "'Roboto', sans-serif")
    .text("Green Initiatives, in Tonnes of CO2");

  const chart = svg.append("g")
    .attr("transform", `translate(${config.margin.left}, ${config.margin.top})`);

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

  let data = [], years = [], companies = [], currentYearIndex = 0;
  let xScale, yScale, xAxisGroup, yAxisGroup, maxYValue = 0, currentYMax = 0;
  let zoomAnimationInProgress = false;

  const xAxis = chart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .style("color", "#1f1f1f");

  const yAxis = chart.append("g")
    .style("color", "#cccccc");

  const towerGroup = chart.append("g").attr("class", "towers");

  chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", -innerHeight / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("fill", config.textColor)
    .style("font-family", "'Roboto', sans-serif")
    .text("CO2 Emissions (in Tonnes)");

  function updateYearDisplay() {
    containerSel.select("#year-label")
      .text(years[currentYearIndex]);
    title.text(`Green Initiatives, in Tonnes of CO2 - ${years[currentYearIndex]}`);
  }

  function createSlider() {
    const sliderContainer = containerSel.append("div")
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

    const controls = sliderContainer.append("div")
      .style("margin-bottom", "15px")
      .style("display", "flex")
      .style("justify-content", "center")
      .style("gap", "10px");

    const sliderWidth = config.width * 0.6;

    const slider = sliderContainer.append("input")
      .attr("id", "year-slider")
      .attr("type", "range")
      .attr("min", 0)
      .attr("max", years.length - 1)
      .attr("value", currentYearIndex)
      .attr("step", 1)
      .style("width", `${sliderWidth}px`)
      .on("input", function () {
        currentYearIndex = +this.value;
        updateYearDisplay();
        updateVisualization();
      });

    controls.append("button")
      .text("◀ Previous Year")
      .on("click", () => {
        if (currentYearIndex > 0) {
          currentYearIndex--;
          slider.node().value = currentYearIndex;
          updateYearDisplay();
          updateVisualization();
        }
      });

    controls.append("button")
      .text("▶ Next Year")
      .on("click", () => {
        if (currentYearIndex < years.length - 1) {
          currentYearIndex++;
          slider.node().value = currentYearIndex;
          updateYearDisplay();
          updateVisualization();
        }
      });
  }

  function initializeScalesAndAxes() {
    xScale = d3.scaleBand()
      .domain(companies)
      .range([0, innerWidth])
      .padding(0.5);

    maxYValue = d3.max(data, d => d.Value) * 1.2;
    currentYMax = config.initialYScale;

    yScale = d3.scaleLinear()
      .domain([0, currentYMax])
      .range([innerHeight, config.margin.top]);

    xAxis.call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "translate(-5, 68) rotate(-45)")
      .style("font-size", "14px")
      .style("fill", config.textColor);

    yAxis.call(d3.axisLeft(yScale));
  }

  function updateVisualization() {
    const currentData = data.filter(d => d.Year === years[currentYearIndex]);

    const yearMaxValue = d3.max(currentData, d => d.Value) * 1.2;
    currentYMax = yearMaxValue;
    yScale.domain([0, currentYMax]);
    yAxis.call(d3.axisLeft(yScale));
    towerGroup.selectAll("*").remove();

    currentData.forEach(d => {
      const x = xScale(d.Brancher);
      const towerWidth = xScale.bandwidth();
      const height = d.Value * (innerHeight / currentYMax);

      const tower = towerGroup.append("rect")
        .attr("x", x)
        .attr("y", innerHeight - height)
        .attr("width", towerWidth)
        .attr("height", height)
        .attr("fill", config.towerColor)
        .attr("stroke", config.towerStroke);

      tower.on("mouseover", (event) => {
        tooltip.style("visibility", "visible")
          .html(`<strong>${d.Brancher}</strong><br>Year: ${d.Year}<br>Value: ${d.Value.toLocaleString()} tonnes`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 40) + "px");
      }).on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });
    });
  }

  d3.csv("/data/dataENG.csv")
    .then(csvData => {
      data = csvData.map(d => ({
        Brancher: d.Brancher,
        Year: d.Year.toString(),
        Value: +d.Value
      }));

      companies = Array.from(new Set(data.map(d => d.Brancher)));
      years = Array.from(new Set(data.map(d => d.Year))).sort();
      
      initializeScalesAndAxes();
      createSlider();
      updateYearDisplay();
      updateVisualization();
    })
    .catch(error => {
      console.error("Error loading data:", error);
      containerSel.append("p")
        .style("color", "red")
        .style("text-align", "center")
        .text("Error loading data. Please check the console for details.");
    });
}
