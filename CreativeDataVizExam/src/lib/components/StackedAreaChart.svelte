<script>
  import { onMount } from "svelte";
  import { renderStackedAreaChart } from "$lib/utils/stackedAreaChart.js";
  import { base } from "$app/paths";

  export let csvUrl = `${base}/data/dataENG.csv`;
  export let width = 1200;
  export let height = 600;

  let chartContainer;

  onMount(() => {
    renderStackedAreaChart(chartContainer, csvUrl, width, height);
  });
</script>

<section class="section">
  <div class="viz-flex-container left">
    <div class="viz-text" style="margin: 0rem 3rem 1.5rem 3rem; z-index: 1">
      <h2 class="area-headline">
        Emissions Over Time: <span class="highlight"
          >Denmark's Biggest Culprits</span
        >
      </h2>
      <p class="lead">
        <strong
          >Let's look at how the emissions of Denmark's biggest culprits have
          evolved since 1990.</strong
        >
      </p>
      <p>
        This <span class="highlight">stacked area chart</span> shows the
        changing contributions of major sectors to Denmark's total CO₂ emissions
        over the years.
        <br />
        <em class="muted"
          >Hover over the chart to see the emissions for each sector in a given
          year.</em
        >
      </p>
      <p>
        <span class="insight">Notice:</span> Some sectors have
        <span class="reduced">reduced their emissions significantly</span>,
        while others remain <span class="challenge">persistent challenges</span>
        for Denmark's green transition.
      </p>
      <p>
        <strong>How does the picture look today?</strong>
      </p>
    </div>
    <div class="viz-chart">
      <div bind:this={chartContainer}></div>
    </div>
  </div>
</section>

<style>
  .area-headline {
    font-size: 3rem;
    margin-bottom: 1rem;
    line-height: 1.1;
  }
  .area-headline .highlight {
    font-weight: bold;
  }
  .lead {
    font-size: 1.15rem;
    margin-bottom: 0.25rem;
    line-height: 1.7;
  }
  .viz-text {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 800px;
    /* margin: 3rem; moved to inline style for custom top/bottom */
  }
  .viz-text p {
    font-size: 1.15rem;
    margin-bottom: 0.25rem;
    line-height: 1.7;
  }
  .viz-text p + p {
    margin-top: -0.5rem;
  }
  .muted,
  .insight,
  .reduced,
  .challenge {
    font-weight: bold;
    font-style: normal;
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
