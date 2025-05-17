<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  const data = [
    { x: 10, y: 20 },
    { x: 40, y: 90 },
    { x: 80, y: 50 },
    { x: 160, y: 70 },
    { x: 200, y: 30 }
  ];

  onMount(() => {
    const svg = d3.select('#scatter-plot')
      .append('svg')
      .attr('width', 300)
      .attr('height', 300);

    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => 300 - d.y)
      .attr('r', 8)
      .attr('fill', 'orange');
  });
</script>

<section class="section">
  <h2>Scatter Plot</h2>
  <div id="scatter-plot"></div>
</section>
