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

<section class="section">
  <h2>Stacked Area Chart Example</h2>
  <p>
    This chart visualizes the CO₂ emissions in Denmark from 1990 to 2021, broken
    down by sector. The data is sourced from the Danish Energy Agency.
  </p>
  <div>
    <div bind:this={chartContainer}></div>
  </div>
</section>
