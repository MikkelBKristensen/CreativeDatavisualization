<script>
  import { onMount } from "svelte";
  import { renderEmissionPieChart } from "$lib/utils/emissionPieChart.js";
  import { base } from "$app/paths";

  export let csvUrl = `${base}/data/dataENG.csv`;
  export let width = 600;
  export let height = width;
  export let year = 1990; // Optional: pass a year to filter

  let chartContainer;

  onMount(() => {
    renderEmissionPieChart(chartContainer, csvUrl, width, height, year);
  });
</script>

<section class="section">
  <div class="viz-flex-container">
    <div class="viz-text">
      <h2>Pie Chart of CO₂ Emissions by Sector (1990)</h2>
      <p>
        This pie chart visualizes the distribution of CO₂ emissions by sector
        for the year {year}. The data is sourced from the Danish Energy Agency.
      </p>
      <p>
        Hover over the segments to see the exact values and percentages for each
        sector.
      </p>
    </div>
    <div class="viz-chart ml-4">
      <div bind:this={chartContainer}></div>
    </div>
  </div>
</section>
