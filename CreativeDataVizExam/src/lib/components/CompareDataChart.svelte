<script>
  import { onMount } from "svelte";
  import { renderComparedLineChart } from "$lib/utils/comparedLineChart.js";
  import { base } from "$app/paths";

  export let csvUrl1 = `${base}/data/KF24Total.csv`;
  export let csvUrl2 = `${base}/data/dataENG.csv`;
  export let width = 1500;
  export let height = 600;

  let chartContainer;

  onMount(() => {
    renderComparedLineChart(chartContainer, csvUrl1, csvUrl2, width, height);
  });
</script>

<section class="section">
  <div
    class="viz-flex-container vertical"
    style="flex-direction: column; align-items: center;"
  >
    <div
      class="viz-text"
      style="max-width: 1200px; width: 100%; margin: 2.5rem 0 2rem 0;"
    >
      <h2 class="big-headline">
        Two Ways to Measure CO₂: Which Story Do We Tell?
      </h2>
      <p>
        This chart reveals the contrast between two ways of recording
        Denmark's CO₂ emissions. The steeply declining line shows the official
        numbers Denmark uses for climate policy—emissions produced within the
        country's borders.
      </p>
      <p>
        The other line tells a different story: it tracks the CO₂ emissions that
        the Danish economy is actually responsible for, including the impact of
        Danish international transport.
      </p>
      <p>
        The difference between these two lines is eye-opening. As you compare
        them, consider what each perspective means for Denmark's climate
        responsibility, and how the story changes depending on which numbers we
        choose to focus on. 
      </p>
      <p>
        <strong>Which numbers should we focus on?</strong>
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
    max-width: 900px;
    width: 100%;
    margin: 2.5rem 0 0 0;
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
