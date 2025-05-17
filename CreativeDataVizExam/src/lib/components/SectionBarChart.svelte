<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  const data = [30, 80, 45, 60, 20, 90, 50];

  onMount(() => {
    const svg = d3.select('#bar-chart')
      .append('svg')
      .attr('width', 500)
      .attr('height', 300);

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 70)
      .attr('y', d => 300 - d * 3)
      .attr('width', 50)
      .attr('height', d => d * 3)
      .attr('fill', 'teal');
  });
</script>

<section class="section">
  <h2>Bar Chart</h2>
  <div id="bar-chart"></div>
</section>

<style>
  .section {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
