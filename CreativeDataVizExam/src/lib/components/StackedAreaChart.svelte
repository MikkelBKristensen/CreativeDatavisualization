<script>
  import { onMount } from "svelte";
  import { renderStackedAreaChart } from "$lib/utils/stackedAreaChart.js";

  export let csvUrl = "/data/dataENG.csv";
  export let width = 900;
  export let height = 500;

  let chartContainer;

  onMount(() => {
    renderStackedAreaChart(chartContainer, csvUrl, width, height);
  });
</script>

<section class="section" style="background-color: aliceblue;">
  <div class="viz-flex-container">
    <div class="viz-text">
      <h2>Some text</h2>
      <p>Explanation or controls here.</p>
    </div>
    <div class="viz-chart">
      <div bind:this={chartContainer}></div>
    </div>
  </div>
</section>
