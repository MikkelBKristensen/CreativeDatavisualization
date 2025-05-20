<script>
  import { onMount } from "svelte";
  import { renderIndexChart } from "$lib/utils/indexChart.js";

  let chartContainer;

  onMount(() => {
    renderIndexChart(chartContainer, "/data/dataENG.csv");
  });
</script>

<section>
  <h2>Denmark’s CO₂ Emissions Over Time</h2>
  <div bind:this={chartContainer}></div>
</section>