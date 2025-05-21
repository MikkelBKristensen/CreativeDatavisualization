<script>
  import { onMount } from "svelte";
  import { renderComparedLineChart } from "$lib/utils/comparedLineChart.js";

  export let csvUrl1 = "/data/KF24Total.csv";
  export let csvUrl2 = "/data/dataENG.csv";
  export let width = 1500;
  export let height = 600;

  let chartContainer;

  onMount(() => {
    renderComparedLineChart(chartContainer, csvUrl1, csvUrl2, width, height);
  });
</script>

<section class="section" style="background-color: aliceblue;">
  <div class="viz-flex-container left">
    <div class="viz-text">
      <h2>Compare Totals</h2>
      <p>This chart compares the "Total" emissions from two datasets over time.</p>
    </div>
    <div class="viz-chart">
      <div bind:this={chartContainer}></div>
    </div>
  </div>
</section>