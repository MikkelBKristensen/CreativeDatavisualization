<script>
  import { onMount } from "svelte";
  import { renderEmissionPieChart } from "$lib/utils/emissionPieChart.js";

  export let csvUrl = "/data/dataENG.csv";
  export let width = 600;
  export let height = width;
  export let year = 1990; // Optional: pass a year to filter

  let chartContainer;

  onMount(() => {
    renderEmissionPieChart(chartContainer, csvUrl, width, height, year);
  });
</script>

<section class="section">
  <div bind:this={chartContainer}></div>
</section>
