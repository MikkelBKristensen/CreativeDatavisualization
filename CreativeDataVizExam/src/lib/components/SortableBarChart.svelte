<script>
  import { onMount } from "svelte";
  import { renderSortableBarChart } from "$lib/utils/sortableBarChart.js";

  export let csvUrl = "/data/dataENG.csv";
  export let width = 1000;
  export let height = 700;

  let chartContainer;

  onMount(() => {
    renderSortableBarChart(chartContainer, csvUrl, width, height);
  });
</script>

<section class="section">
  <div class="viz-flex-container vertical">
    <div class="viz-text">
      <h2>Sortable Bar Chart of CO₂ Emissions by Brancher (1990)</h2>
      <p>
        This bar chart shows the CO₂ emissions for each brancher in 1990.
        Click the chart to toggle between descending and ascending order.
      </p>
    </div>
    <div class="viz-chart">
      <div bind:this={chartContainer}></div>
    </div>
  </div>
</section>