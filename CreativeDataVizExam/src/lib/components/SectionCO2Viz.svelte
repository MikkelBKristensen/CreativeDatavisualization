<script>
  import { onMount } from 'svelte';
  import { createCO2EmissionsViz } from '$lib/utils/createCO2EmissionsViz.js';
  import { base } from '$app/paths';

  let containerRef;

  onMount(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Delay to ensure layout is painted
    setTimeout(() => {
      // If your visualization loads data, pass the correct path:
      // Example: createCO2EmissionsViz(containerRef, width, height, `${base}/data/yourfile.csv`);
      createCO2EmissionsViz(containerRef, width, height);
    }, 0);
  });
</script>

<section class="section">
  <div bind:this={containerRef}></div>
</section>

<style>
  .section {
    min-height: 100vh;
    overflow: hidden;
  }
</style>