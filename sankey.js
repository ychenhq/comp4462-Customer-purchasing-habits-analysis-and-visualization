function SankeyChart(
  { nodes, links },
  {
    format = ",",
    align = "justify", // Alignment of nodes
    nodeId = (d) => d.id,
    nodeWidth = 15,
    nodePadding = 10,
    width = 1000,
    height = 1000,
    colors = d3.schemeTableau10,
  } = {}
) {
  const aggregatedLinks = Array.from(
    d3.group(links, (d) => `${d.source}-${d.target}`),
    ([, group]) => ({
      source: group[0].source,
      target: group[0].target,
      value: d3.sum(group, (d) => d.value),
    })
  );

  if (!nodes) {
    nodes = Array.from(
      new Set([
        ...aggregatedLinks.map((l) => l.source),
        ...aggregatedLinks.map((l) => l.target),
      ]),
      (id) => ({ id })
    );
  }

  const color = d3.scaleOrdinal(
    nodes.map((d) => d.id),
    colors
  );

  // Sankey layout
  const sankey = d3
    .sankey()
    .nodeId((d) => d.id)
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .nodeAlign(d3[`sankey${align[0].toUpperCase() + align.slice(1)}`]) // Align nodes
    .extent([
      [1, 1],
      [width - 1, height - 1],
    ]);

  const { nodes: sankeyNodes, links: sankeyLinks } = sankey({
    nodes: nodes.map((d) => Object.assign({}, d)),
    links: aggregatedLinks.map((d) => Object.assign({}, d)),
  });

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

  // Draw nodes (proportional to total link value)
  svg
    .append("g")
    .selectAll("rect")
    .data(sankeyNodes)
    .join("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("fill", (d) => color(d.id))
    .append("title")
    .text((d) => `${d.id}\n${d3.format(format)(d.value)}`);

  // Draw links
  svg
    .append("g")
    .attr("fill", "none")
    .selectAll("path")
    .data(sankeyLinks)
    .join("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke-width", (d) => Math.max(1, d.width))
    .attr("stroke", (d) => color(d.source.id))
    .attr("opacity", 0.7)
    .append("title")
    .text(
      (d) => `${d.source.id} → ${d.target.id}\n${d3.format(format)(d.value)}`
    );

  // Add labels
  svg
    .append("g")
    .selectAll("text")
    .data(sankeyNodes)
    .join("text")
    .attr("x", (d) => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
    .attr("y", (d) => (d.y0 + d.y1) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
    .text((d) => d.id)
    .style("font-size", "14px")
    .style("font-family", "sans-serif")
    .style("fill", "#000");

  return svg.node();
}

async function createSankeyChart() {
  // Filter and clean the data
  const filteredData = rawData.filter(
    (row) => row.item_purchased && row.color && row.category && row.season
  );

  // Create nodes and links
  const nodes = [];
  const links = [];

  const addNode = (name) => {
    if (!nodes.find((n) => n.id === name)) {
      nodes.push({ id: name });
    }
  };

  filteredData.forEach((row) => {
    const { item_purchased, color, category, season } = row;

    // Add nodes
    addNode(item_purchased);
    addNode(color);
    addNode(category);
    addNode(season);

    // Add links
    links.push({ source: item_purchased, target: color, value: 1 });
    links.push({ source: color, target: category, value: 1 });
    links.push({ source: category, target: season, value: 1 });
  });

  // Render Sankey chart
  const chart = SankeyChart(
    { nodes, links },
    {
      width: 950,
      height: 800,
      nodeWidth: 20,
      nodePadding: 15,
      align: "justify", // Options: "left", "right", "justify", or "center"
    }
  );

  // Append the chart to the DOM
  document.getElementById("sankey-chart").appendChild(chart);
}
