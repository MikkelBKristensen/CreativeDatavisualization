<script>
  import { base } from "$app/paths";
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
  <div class="svg-bg">
    <img
      src="{base}/svgelements/lines/1lyseblå.svg"
      class="bg-svg lines1"
      alt=""
    />
    <img
      src="{base}/svgelements/lines/2hvid.svg"
      class="bg-svg lines2"
      alt="Lines 2"
    />
    <img
      src="{base}/svgelements/lines/3hvid.svg"
      class="bg-svg lines3"
      alt="Lines 3"
    />
    <img
      src="{base}/svgelements/blomster/1.svg"
      class="bg-svg flower1"
      alt="Flower 1"
    />
    <img
      src="{base}/svgelements/blomster/2.svg"
      class="bg-svg flower2"
      alt="Flower 2"
    />
    <img
      src="{base}/svgelements/blomster/3.svg"
      class="bg-svg flower3"
      alt="Flower 3"
    />
    <img
      src="{base}/svgelements/blomster/4.svg"
      class="bg-svg flower4"
      alt="Flower 4"
    />
    <img
      src="{base}/svgelements/blomster/5.svg"
      class="bg-svg flower5"
      alt="Flower 5"
    />
  </div>
  <SectionIntro />
  <SortableBarChart />
  <PieChart />
  <SectionIndexChart />
  <StackedAreaChart />
  <FullBarChart />
  <CompareDataChart />
</main>

<style>
  .svg-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    overflow: visible;
  }
  .bg-svg {
    position: absolute;
    width: auto; /* Adjust as needed */
    height: auto;
  }
  .lines1 {
    top: 6vh;
    left: 15vw;
    height: 45vw; /* Adjust as needed */
    width: auto;
  }
  .lines2 {
    top: 112vh;
    left: 68vw;
    height: 1400px; /* Adjust as needed */
    width: auto;
    opacity: 0.3;
  }
  .lines3 {
    top: 270vh;
    left: 2vw;
    height: 73vw; /* Adjust as needed */
    width: auto;
    opacity: 0.2;
  }
  .flower1 {
    top: 86vh;
    left: 3vw;
    height: 175px; /* Adjust as needed */
  }
  .flower2 {
    top: 96vh;
    left: 12vw;
    height: 150px; /* Adjust as needed */
  }
  .flower3 {
    top: 91vh;
    left: 88vw;
    height: 150px; /* Adjust as needed */
  }
  .flower4 {
    top: 195vh;
    left: 88vw;
    height: 100px; /* Adjust as needed */
  }
  .flower5 {
    top: 195vh;
    left: 3vw;
    height: 200px; /* Adjust as needed */
  }
  main {
    position: relative;
    z-index: 1;
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
