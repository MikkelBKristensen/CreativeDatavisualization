<script>
  import SectionBarChart from "$lib/components/SectionBarChart.svelte";
  import SectionLineChart from "$lib/components/SectionLineChart.svelte";
  import SectionScatterPlot from "$lib/components/SectionScatterPlot.svelte";
  import SectionCO2Viz from "$lib/components/SectionCO2Viz.svelte";
</script>

<main>
  <SectionBarChart />
  <SectionLineChart />
  <SectionScatterPlot />
  <SectionCO2Viz />
</main>

<style>
  main {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
  }
</style>
