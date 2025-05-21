<script>
  import SectionHero from "$lib/components/SectionHero.svelte";
  import SectionIntro from "$lib/components/SectionIntro.svelte";
  import SortableBarChart from "$lib/components/SortableBarChart.svelte";
  import SectionIndexChart from "$lib/components/SectionIndexChart.svelte";
  import Co2EmissionPage from "$lib/components/CO2EmissionPage.svelte";
  import PieChart from "$lib/components/PieChart.svelte";
  import StackedAreaChart from "$lib/components/StackedAreaChart.svelte";
  import FullBarChart from "$lib/components/FullBarChart.svelte";
</script>

<main>
  <SectionHero />
  <SectionIntro />
  <SortableBarChart />
  <PieChart />
  <SectionIndexChart />
  <StackedAreaChart />
  <FullBarChart />
</main>

<style>
  main {
    
  }
</style>
