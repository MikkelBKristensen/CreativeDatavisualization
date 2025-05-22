<script>
  import { base } from "$app/paths";
  import SectionHero from "$lib/components/SectionHero.svelte";
  import SectionIntro from "$lib/components/SectionIntro.svelte";
  import DanishClimateAct from "$lib/components/DanishClimateAct.svelte";
  import DataStorySection from "$lib/components/DataStorySection.svelte";
  import SortableBarChart from "$lib/components/SortableBarChart.svelte";
  import SectionIndexChart from "$lib/components/SectionIndexChart.svelte";
  import PieChart from "$lib/components/PieChart.svelte";
  import StackedAreaChart from "$lib/components/StackedAreaChart.svelte";
  import FullBarChart from "$lib/components/FullBarChart.svelte";
  import CompareDataChart from "$lib/components/CompareDataChart.svelte";
  import Conclusion from "$lib/components/Conclusion.svelte";
  import Sources from "$lib/components/Sources.svelte";
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
      src="{base}/svgelements/lines/4grå.svg"
      class="bg-svg lines4"
      alt="Lines 4"
    />
    <img
      src="{base}/svgelements/lines/5grå.svg"
      class="bg-svg lines5"
      alt="Lines 5"
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
    <img
      src="{base}/svgelements/blomster/6.svg"
      class="bg-svg flower6"
      alt="Flower 6"
    />
    <img
      src="{base}/svgelements/blomster/7.svg"
      class="bg-svg flower7"
      alt="Flower 7"
    />
    <img
      src="{base}/svgelements/blomster/8.svg"
      class="bg-svg flower8"
      alt="Flower 8"
    />
    <img
      src="{base}/svgelements/blomster/9.svg"
      class="bg-svg flower9"
      alt="Flower 9"
    />
    <img
      src="{base}/svgelements/blomster/10.svg"
      class="bg-svg flower10"
      alt="Flower 10"
    />
    <img
      src="{base}/svgelements/blomster/11.svg"
      class="bg-svg flower11"
      alt="Flower 11"
    />
    <img
      src="{base}/svgelements/snurrer/1.svg"
      class="bg-svg swurl1"
      alt="Swurl 1"
    />
    <img
      src="{base}/svgelements/snurrer/2.svg"
      class="bg-svg swurl2"
      alt="Swurl 2"
    />
    <img
      src="{base}/svgelements/snurrer/3.svg"
      class="bg-svg swurl3"
      alt="Swurl 3"
    />
  </div>
  <SectionIntro />
  <DanishClimateAct />
  <DataStorySection />
  <SortableBarChart />
  <PieChart />
  <StackedAreaChart />
  <SectionIndexChart />
  <FullBarChart />
  <CompareDataChart />
  <Conclusion />
</main>
<Sources />

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
    width: auto;
    height: auto;
    z-index: -1;
  }
  .swurl1 {
    top: 962vh;
    left: 86vw;
    height: 220px;
  }
  .swurl2 {
    top: 999vh;
    left: 4vw;
    height: 230px;
  }
  .swurl3 {
    top: 1048vh;
    left: 82vw;
    height: 190px;
  }
  .lines1 {
    top: 6vh;
    left: 15vw;
    height: 45vw;
    width: auto;
  }
  .lines2 {
    top: 180vh;
    left: 2vw;
    height: 1600px;
    width: auto;
    opacity: 0.1;
    transform: scaleX(-1);
  }
  .lines3 {
    top: 365vh;
    left: 2vw;
    height: 73vw;
    width: auto;
    opacity: 0.05;
  }
  .lines4 {
    top: 485vh;
    left: 2vw;
    height: 73vw;
    width: auto;
    opacity: 0.3;
    transform: scale(-1, -1);
    z-index: -1;
  }
  .lines5 {
    top: 722vh;
    left: 2vw;
    height: 73vw;
    width: auto;
    opacity: 0.3;
    z-index: -1;
  }
  .flower1 {
    top: 86vh;
    left: 3vw;
    height: 175px;
  }
  .flower2 {
    top: 96vh;
    left: 12vw;
    height: 150px;
  }
  .flower3 {
    top: 91vh;
    left: 88vw;
    height: 150px;
  }
  .flower4 {
    top: 195vh;
    left: 88vw;
    height: 100px;
  }
  .flower5 {
    top: 195vh;
    left: 3vw;
    height: 200px;
  }
  .flower6 {
    top: 208vh;
    left: 83vw;
    height: 250px;
  }
  .flower7 {
    top: 230vh;
    left: 18vw;
    height: 130px;
  }
  .flower8 {
    top: 390vh;
    left: 10vw;
    height: 200px;
  }
  .flower9 {
    top: 370vh;
    left: 4vw;
    height: 150px;
  }
  .flower10 {
    top: 275vh;
    left: 85vw;
    height: 200px;
  }
  .flower11 {
    top: 382vh;
    left: 84vw;
    height: 150px;
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
      #3f0909 100%
    );
    color: #fff;
  }
</style>
