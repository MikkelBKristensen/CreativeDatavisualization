<script>
  import { onMount } from "svelte";
  import { renderFullBarChart } from "$lib/utils/fullBarChart.js";
  import { base } from "$app/paths";

  export let csvUrl = `${base}/data/dataENG.csv`;
  export let width = 1100;
  export let height = 600;

  let chartContainer;

  onMount(() => {
    renderFullBarChart(chartContainer, csvUrl, width, height);
  });
</script>

<section class="section">
  <div class="viz-flex-container">
    <div class="viz-text">
      <h2>CO₂ Emissions by Brancher (Interactive Year)</h2>
      <p>
        This bar chart shows the CO₂ emissions for each brancher. Use the timeline slider or the previous/next buttons below the chart to change the year being displayed.
      </p>
    </div>
    <div class="viz-chart">
      <div bind:this={chartContainer}></div>
    </div>
  </div>
</section>