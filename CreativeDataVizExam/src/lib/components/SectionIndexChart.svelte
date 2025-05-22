<script>
  import { onMount } from "svelte";
  import { renderIndexChart } from "$lib/utils/indexChart.js";
  import { base } from "$app/paths";

  let chartContainer;

  onMount(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderIndexChart(chartContainer, `${base}/data/dataENG.csv`, height, width);
  });
</script>

<section class="section">
  <div
    class="viz-flex-container vertical"
    style="flex-direction: column; align-items: center;"
  >
    <div class="viz-text" style="max-width: 1600px; width: 100%; margin: 2.5rem 0 2rem 0;">
      <h2 class="big-headline">
        Denmark's CO₂ Emissions Index: Year-by-Year Perspective
      </h2>
      <p>
        This index chart lets you explore Denmark's CO₂ emissions from the
        perspective of each year, revealing how the journey has unfolded and
        changed over time.
      </p>
    </div>
    <div class="viz-chart" style="display: flex; justify-content: center;">
      <div bind:this={chartContainer}></div>
    </div>
  </div>
</section>

<style>
  .big-headline {
    font-size: 2.3rem;
    margin-top: 0;
    margin-bottom: 1.2rem;
    line-height: 1.1;
  }
  .viz-flex-container.vertical {
    width: 100vw;
    max-width: 100vw;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  .viz-text {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    width: 100%;
    max-width: 1000px;
    margin: 2.5rem 0 2rem 0;
  }
  .viz-text p {
    font-size: 1.15rem;
    margin-bottom: 0.25rem;
    line-height: 1.7;
  }
  .viz-chart {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @media (max-width: 900px) {
    .viz-flex-container.vertical {
      max-width: 100vw;
      padding: 0 0.5rem;
    }
    .viz-text {
      max-width: 100vw;
      margin: 1.5rem 0 1rem 0;
      padding: 0 0.5rem;
    }
    .viz-chart {
      width: 100vw;
      min-width: unset;
    }
  }
</style>
