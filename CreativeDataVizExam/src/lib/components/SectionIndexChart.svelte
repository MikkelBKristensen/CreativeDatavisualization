<script>
  import { onMount } from "svelte";
  import { renderIndexChart } from "$lib/utils/indexChart.js";

  let chartContainer;

  onMount(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderIndexChart(chartContainer, "/data/dataENG.csv", height, width);
  });
</script>

<section class="section">
  <!-- <h2>Denmark's CO₂ Emissions Over Time</h2> -->
  <div>
    <div>
      <h2>Denmark's CO₂ Emissions Over Time</h2>
      <p>
        This chart shows the total CO₂ emissions in Denmark from 1990 to 2021.
        The data is sourced from the Danish Energy Agency and is presented in
        million tonnes of CO₂.
      </p>
      <p>
        The chart allows you to explore the changes in emissions over time, with
        a focus on the years 1990 to 2021.
      </p>
    </div>
    <div bind:this={chartContainer}></div>
  </div>
</section>
