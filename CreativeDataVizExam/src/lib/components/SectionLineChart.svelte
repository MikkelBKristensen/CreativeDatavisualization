<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  const data = [10, 40, 30, 60, 20, 80, 50];

  onMount(() => {
    const svg = d3.select('#line-chart')
      .append('svg')
      .attr('width', 500)
      .attr('height', 300);

    const xScale = d3.scaleLinear().domain([0, data.length - 1]).range([0, 500]);
    const yScale = d3.scaleLinear().domain([0, d3.max(data)]).range([300, 0]);

    const line = d3.line()
      .x((d, i) => xScale(i))
      .y(d => yScale(d));

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);
  });
</script>

<section class="section">
  <h2>Line Chart</h2>
  <div id="line-chart"></div>
</section>
