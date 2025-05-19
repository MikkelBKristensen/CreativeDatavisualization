<script>
  import HeroSection from "$lib/components/HeroSection.svelte";
</script>

<main>
  <HeroSection />
</main>

<style>
  main {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
  }
  main > * {
    min-height: 100vh;
    scroll-snap-align: start;
  }
</style>
