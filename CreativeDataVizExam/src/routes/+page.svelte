<script>
  import SectionHero from "$lib/components/SectionHero.svelte";
  import SectionIntro from "$lib/components/SectionIntro.svelte";
  import SortableBarChart from "$lib/components/SortableBarChart.svelte";
  import SectionIndexChart from "$lib/components/SectionIndexChart.svelte";
  import Co2EmissionPage from "$lib/components/CO2EmissionPage.svelte";
  import PieChart from "$lib/components/PieChart.svelte";
  import StackedAreaChart from "$lib/components/StackedAreaChart.svelte";
  import FullBarChart from "$lib/components/FullBarChart.svelte";
  import CompareDataChart from "$lib/components/CompareDataChart.svelte";
</script>

<SectionHero />

<main>
  <SectionIntro />
  <SortableBarChart />
  <PieChart />
  <SectionIndexChart />
  <StackedAreaChart />
  <FullBarChart />
  <CompareDataChart />
</main>

<style>
  main {
    min-height: 100vh;
    background: linear-gradient(
      #0e0909 0%,
      #6db872 5%,
      #4e7651 19%,
      #060b06 72%,
      #040804 80%,
      #0b150c 100%
    );
    color: #fff;
  }
</style>
