<script>
  import { onMount } from "svelte";
  import { renderFullBarChart } from "$lib/utils/fullBarChart.js";
  import { base } from "$app/paths";

  export let csvUrl = `${base}/data/dataENG.csv`;
  export let width = 1100;
  export let height = 600;

  let chartContainer;

  onMount(() => {
    renderFullBarChart(chartContainer, csvUrl, width, height);
  });
</script>

<section class="section">
  <div class="viz-flex-container" style="align-items: flex-start;">
    <div
      class="viz-text"
      style="max-width: 900px; margin: 2.5rem 3rem 2rem 3rem; z-index: 1"
    >
      <h2 class="big-headline">
        CO₂ Emissions by Sector: <br /> Explore Year by Year
      </h2>
      <p>
        Move through the years at your own pace and discover how Denmark's
        sectors have changed. Notice the shifts, the surprises, and the stories
        hidden in each year.
      </p>
    </div>
    <div
      class="viz-chart"
      style="display: flex; align-items: center; min-width: 350px;"
    >
      <div bind:this={chartContainer}></div>
    </div>
  </div>
</section>

<style>
  .big-headline {
    font-size: 2.3rem;
    margin-bottom: 1.2rem;
    line-height: 1.1;
  }
  .viz-flex-container {
    width: 100vw;
    max-width: 100vw;
    margin: 0;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 2.5rem;
    padding: 2.5rem 0;
  }
  .viz-text {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    max-width: 900px;
    margin: 2.5rem 3rem 2rem 3rem;
  }
  .viz-text p {
    font-size: 1.15rem;
    margin-bottom: 0.25rem;
    line-height: 1.7;
  }
  .viz-chart {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 350px;
  }
  @media (max-width: 900px) {
    .viz-flex-container {
      flex-direction: column;
      gap: 1.5rem;
      padding: 1.5rem 0;
    }
    .viz-chart {
      margin-left: 0;
      min-width: unset;
    }
    .viz-text {
      max-width: 100vw;
      margin: 1.5rem 0 1rem 0;
      padding: 0 0.5rem;
    }
  }
</style>
