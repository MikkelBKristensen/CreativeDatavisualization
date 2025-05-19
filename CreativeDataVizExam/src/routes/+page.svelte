<script>
  import SectionCO2Viz from "$lib/components/SectionCO2Viz.svelte";
  import Co2EmissionPage from "$lib/components/CO2EmissionPage.svelte";
</script>

<main>
  <!-- <SectionCO2Viz /> -->
  <Co2EmissionPage />
</main>

<style>
  main {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
  }
</style>
