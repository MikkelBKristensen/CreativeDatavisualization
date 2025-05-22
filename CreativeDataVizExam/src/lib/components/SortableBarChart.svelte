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
    <div class="viz-text">
      <h1>Let's take a look at...</h1>
      <h2>CO₂ Emissions by Sectors 1990</h2>
      <p>
        This bar chart shows the CO₂ emissions for each sector in 1990.<br>
        <em>Click the drop down menu to toggle between orders.</em>
      </p>
      <p>
        <em>Who's the biggest source of emissions at the time?</em>
      </p>
      <p>
        In the Climate Act there should be a <strong>70% reduction of emissions in 2030 compared to 1990</strong>.
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
  gap: 1.5rem; /* More space between paragraphs */
  padding: 2rem 2rem 2rem 0;
}

.viz-text h1 {
  font-size: 3rem; /* Bigger H1 */
  margin-bottom: 1rem;
  line-height: 1.1;
}

.viz-text h2 {
  font-size: 2rem; /* Bigger H2 */
  margin-bottom: 1rem;
  line-height: 1.2;
}

.viz-text p {
  font-size: 1.15rem;
  margin-bottom: 0.75rem;
  line-height: 1.7;
}
</style>