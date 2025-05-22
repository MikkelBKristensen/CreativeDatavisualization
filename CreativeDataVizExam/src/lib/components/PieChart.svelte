<script>
  import { onMount } from "svelte";
  import { renderEmissionPieChart } from "$lib/utils/emissionPieChart.js";
  import { base } from "$app/paths";

  export let csvUrl = `${base}/data/dataENG.csv`;
  export let width = 600;
  export let height = width;
  export let year = 1990;

  let chartContainer;

  onMount(() => {
    renderEmissionPieChart(chartContainer, csvUrl, width, height, year);
  });
</script>

<section class="section">
  <div class="viz-flex-container left">
    <div class="viz-text" style="margin: 3rem;">
      <h2 class="big-headline">Pie Chart of CO₂ Emissions by Sector in 1990</h2>
      <p>
        This pie chart visualizes the distribution of CO₂ emissions by sector
        for the year {year}. The data is sourced from the Danish Energy Agency.
      </p>
      <p>
        By breaking down the emissions, we can clearly see which sectors were
        the largest contributors to Denmark's CO₂ output in 1990. Sectors such
        as energy production, transport, and agriculture often stand out as the
        main culprits, each playing a significant role in the country's overall
        emissions.
      </p>
      <p>
        Understanding which sectors are responsible for the largest shares of
        emissions is crucial for targeting effective climate policies and
        tracking progress over time. Use this chart to get a sense of where the
        biggest challenges and opportunities for improvement—lie.
      </p>
    </div>
    <div class="viz-chart ml-4">
      <div bind:this={chartContainer}></div>
    </div>
  </div>
</section>

<style>
  .viz-flex-container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 2.5rem;
    padding: 2.5rem 0;
  }

  .viz-text {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 800px;
    /* Add margin to match DanishClimateAct.svelte */
    margin: 3rem;
  }

  .big-headline {
    font-size: 3rem;
    margin-bottom: 1rem;
    line-height: 1.1;
  }

  .viz-text p {
    font-size: 1.15rem;
    margin-bottom: 0.25rem;
    line-height: 1.7;
  }

  .viz-text p + p {
    margin-top: -0.5rem;
  }

  .viz-chart {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 350px;
  }

  .ml-4 {
    margin-left: 2rem;
  }

  @media (max-width: 900px) {
    .viz-flex-container {
      flex-direction: column;
      gap: 1.5rem;
    }
    .viz-chart {
      margin-left: 0;
      min-width: unset;
    }
    .viz-text {
      padding: 1.5rem 0 0 0;
      max-width: 100%;
      margin: 0;
    }
  }
</style>
