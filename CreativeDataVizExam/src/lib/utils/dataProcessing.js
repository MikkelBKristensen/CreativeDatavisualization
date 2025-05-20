import * as d3 from "d3";

/**
 * Groups specified brancher names into "Other", summing their values per year.
 * Optionally excludes specified branchers from the result entirely.
 * @param {Array} data - Array of objects with Brancher, Year, and Value fields.
 * @param {Array} branchersToGroup - Array of brancher names to group as "Other".
 * @param {Array} branchersToExclude - Array of brancher names to exclude from result.
 * @returns {Array} - New data array with grouped "Other" and remaining branchers.
 */
export function groupBranchersAsOther(
  data,
  branchersToGroup = [],
  branchersToExclude = []
) {
  const filteredData = data.filter(
    (d) => !branchersToExclude.includes(d.Brancher)
  );
  const otherByYear = d3.rollup(
    filteredData.filter((d) => branchersToGroup.includes(d.Brancher)),
    (v) => d3.sum(v, (d) => +d.Value),
    (d) => d.Year
  );
  const otherRows = Array.from(otherByYear, ([Year, Value]) => ({
    Brancher: "Other",
    Year,
    Value,
  }));
  const kept = filteredData.filter(
    (d) => !branchersToGroup.includes(d.Brancher)
  );
  return kept.concat(otherRows);
}