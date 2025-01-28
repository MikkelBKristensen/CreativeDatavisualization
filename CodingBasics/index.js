// import all 38 d3 modules
import * as d3 from 'd3';

// Alternative: import only the select and selectAll modules
// import { select, selectAll } from "d3";

const redCircle = d3.select('red-circle');
redCircle.style('fill', 'green');
d3.selectAll('div');

// how does this code take effect in the html file?
// <svg>
//     <circle id="red-circle" cx="50" cy="50" r="20" fill="red"></circle>
// </svg>