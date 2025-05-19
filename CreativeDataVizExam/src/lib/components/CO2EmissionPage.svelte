<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { createCO2EmissionsChart } from '$lib/utils/co2BarChart';
  
  // Chart container reference
  let chartContainer;
  let containerWidth;
  let containerHeight;
  
  // Responsive sizing
  $: chartWidth = containerWidth || 900;
  $: chartHeight = Math.max(400, containerWidth * 0.5); // Maintain aspect ratio
  
  // Chart configuration
  $: chartConfig = {
    width: chartWidth,
    height: chartHeight,
    barColor: "#4c9c6e", // Green theme for eco-friendliness
    barHoverColor: "#6bbf8e",
    textColor: "#ffffff",
    // Adjust margins based on container size
    margin: {
      top: Math.max(40, chartHeight * 0.08), 
      right: Math.max(30, chartWidth * 0.05), 
      bottom: Math.max(100, chartHeight * 0.25), 
      left: Math.max(60, chartWidth * 0.08)
    }
  };
  
  // Data state
  let data = [];
  let years = [];
  let currentYearIndex = 0;
  let chart;
  
  // Computed values
  $: currentYear = years[currentYearIndex] || '';
  $: currentYearData = data.filter(d => d.Year === currentYear);
  
  // Handle year changes
  $: if (chart && currentYear && currentYearData) {
    chart.update(currentYearData, currentYear);
  }
  
  // Navigate to previous year
  function prevYear() {
    if (currentYearIndex > 0) {
      currentYearIndex--;
    }
  }
  
  // Navigate to next year
  function nextYear() {
    if (currentYearIndex < years.length - 1) {
      currentYearIndex++;
    }
  }
  
  // Load data and initialize chart
  onMount(async () => {
    try {
      // Load data
      const csvData = await d3.csv('/data/dataENG.csv');
      
      // Process data
      data = csvData.map(d => ({
        Brancher: d.Brancher,
        Year: d.Year.toString(),
        Value: +d.Value
      }));
      
      // Extract unique years and sort
      years = Array.from(new Set(data.map(d => d.Year))).sort();
      
      // Set initial year
      currentYearIndex = 0;
      
      // Get container dimensions
      const updateContainerSize = () => {
        if (chartContainer) {
          // Get parent container width
          const parentWidth = chartContainer.parentElement.clientWidth;
          containerWidth = Math.min(1200, parentWidth - 40); // Account for padding
          containerHeight = Math.max(400, containerWidth * 0.6);
        }
      };
      
      // Update container size initially
      updateContainerSize();
      
      // Create chart
      chart = createCO2EmissionsChart(chartContainer, chartConfig);
      
      // Initial render
      chart.update(currentYearData, currentYear);
      
      // Handle window resize
      const handleResize = () => {
        updateContainerSize();
        if (chart) {
          chart.resize(chartWidth, chartHeight);
          // Re-render after resize
          chart.update(currentYearData, currentYear);
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        if (chart) chart.destroy();
      };
    } catch (error) {
      console.error("Error loading data:", error);
    }
  });
</script>

<div class="container">
  <div class="chart-section">
    <!-- Use dynamic sizing for the chart container -->
    <div bind:this={chartContainer} class="chart-container" style="width: {chartWidth}px; height: {chartHeight}px;"></div>
    
    <!-- Year Control UI - Now managed by Svelte -->
    {#if years.length > 0}
      <div class="controls-container">
        <p class="year-display">
          Year: <span class="year-value">{currentYear}</span>
        </p>
        
        <div class="controls">
          <button 
            class="control-btn" 
            on:click={prevYear} 
            disabled={currentYearIndex === 0}
          >
            ◀ Previous Year
          </button>
          
          <input 
            type="range" 
            min="0" 
            max={years.length - 1} 
            bind:value={currentYearIndex} 
            class="year-slider"
          />
          
          <button 
            class="control-btn" 
            on:click={nextYear} 
            disabled={currentYearIndex === years.length - 1}
          >
            Next Year ▶
          </button>
        </div>
      </div>
    {/if}
  </div>
  
  <div class="info-section">
    <h2>CO2 Emissions Reduction</h2>
    <p>
      This visualization shows how different companies have reduced their carbon footprint over time.
      Use the slider below the chart to navigate between different years and see the progress made.
    </p>
  </div>
</div>

<style>
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .chart-section {
    background-color: #1f1f1f;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-image: url('/images/smoke-towers.webp');
    background-size: cover;
    background-position: center;
    position: relative;
  }
  
  .chart-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 8px;
    z-index: 0;
  }
  
  .chart-container {
    margin: 0 auto;
    min-height: 400px;
    position: relative;
    z-index: 1;
  }
  
  .controls-container {
    position: relative;
    z-index: 1;
    text-align: center;
    margin-top: 20px;
    padding: 15px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
  }
  
  .year-display {
    color: #ffffff;
    margin-bottom: 10px;
  }
  
  .year-value {
    font-weight: bold;
    font-size: 1.2em;
  }
  
  .controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
  }
  
  .control-btn {
    background-color: #4c9c6e;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .control-btn:hover:not(:disabled) {
    background-color: #6bbf8e;
  }
  
  .control-btn:disabled {
    background-color: #666666;
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  .year-slider {
    flex-grow: 1;
    max-width: 50%;
    accent-color: #4c9c6e;
  }
  
  .info-section {
    padding: 1rem;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  h2 {
    margin-top: 0;
    color: #333;
  }
</style>