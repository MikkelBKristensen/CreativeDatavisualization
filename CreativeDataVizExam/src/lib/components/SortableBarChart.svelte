<script>
  import { onMount } from "svelte";
  import { renderSortableBarChart } from "$lib/utils/sortableBarChart.js";
  import { base } from "$app/paths";

  export let csvUrl = `${base}/data/dataENG.csv`;
  export let width = 1000;
  export let height = 800;

  let chartContainer;

  onMount(() => {
    renderSortableBarChart(chartContainer, csvUrl, width, height);
  });
</script>

<section class="section">
  <div class="viz-flex-container left">
    <div class="viz-text" style="margin: 3rem;">
      <h1>CO₂ Emissions by Sector: 1990</h1>
      <h2>Who were Denmark's biggest emitters?</h2>
      <p>
        This bar chart shows the CO₂ emissions for each sector in 1990.
        <br>
        <em>Use the drop-down menu to sort the data and reveal different perspectives.</em>
      </p>
      <p>
        <strong>Which sector stands out as the largest source of emissions?</strong> Explore the chart to see how energy, transport, agriculture, and other sectors compare.
      </p>
      <p>
        <em>Did you know?</em> The Danish Climate Act aims for a <strong>70% reduction in emissions by 2030 compared to 1990</strong>. Understanding the starting point is key to tracking progress.
      </p>
    </div>
    <div class="viz-chart" style="z-index: 1">
      <div bind:this={chartContainer}></div>
    </div>
  </div>
</section>

<style>
.viz-text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem 2rem 2rem 0;
}

.viz-text h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1.1;
}

.viz-text h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.viz-text p {
  font-size: 1.15rem;
  margin-bottom: 0.75rem;
  line-height: 1.7;
}
</style>