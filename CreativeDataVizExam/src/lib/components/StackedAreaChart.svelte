<script>
  import { onMount } from "svelte";
  import { renderStackedAreaChart } from "$lib/utils/stackedAreaChart.js";
  import { base } from "$app/paths";

  export let csvUrl = `${base}/data/dataENG.csv`;
  export let width = 1200;
  export let height = 600;

  let chartContainer;

  onMount(() => {
    renderStackedAreaChart(chartContainer, csvUrl, width, height);
  });
</script>

<section class="section" style="background-color: aliceblue;">
  <div class="viz-flex-container left">
    <div class="viz-text">
      <h2>Some text</h2>
      <p>Explanation or controls here.</p>
    </div>
    <div class="viz-chart">
      <div bind:this={chartContainer}></div>
    </div>
  </div>
</section>
