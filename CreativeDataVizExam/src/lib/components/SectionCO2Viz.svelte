<script>
  import { onMount } from 'svelte';
  import { createCO2EmissionsViz } from '$lib/utils/createCO2EmissionsViz';

  let containerRef;

  onMount(() => {
    createCO2EmissionsViz(containerRef);
  });
</script>

<section class="section">
  <div bind:this={containerRef}></div>
</section>

<style>
  .section {
    min-height: 100vh;
    background-color: #1f1f1f;
    padding: 2rem;
  }

  #canvas {
    margin: 0 auto;
    max-width: 100%;
  }
</style>
