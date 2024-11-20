function SankeyChart(
  { nodes, links },
  {
    format = ",",
    align = "justify",
    nodeId = (d) => d.id,
    nodeWidth = 15,
    nodePadding = 10,
    width = 1000,
    height = 600,
    colors = d3.schemeTableau10,
  } = {}
) {
  const LS = d3.map(links, (d) => d.source);
  const LT = d3.map(links, (d) => d.target);
  const LV = d3.map(links, (d) => d.value);

  if (!nodes) nodes = Array.from(new Set([...LS, ...LT]), (id) => ({ id }));
  const color = d3.scaleOrdinal(
    nodes.map((d) => d.id),
    colors
  );

  d3
    .sankey()
    .nodeId((d) => d.id)
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .extent([
      [1, 1],
      [width - 1, height - 1],
    ])({ nodes, links });

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

  // Add nodes
  svg
    .append("g")
    .selectAll("rect")
    .data(nodes)
    .join("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("fill", (d) => color(d.id));

  // Add links with visible stroke and increased width
  svg
    .append("g")
    .attr("fill", "none")
    .selectAll("path")
    .data(links)
    .join("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke-width", (d) => Math.max(1, d.width))
    .attr("stroke", (d) => color(d.source)) // Color links by source node
    .attr("opacity", 0.7); // Adjust opacity to make links more visible

  // Add labels to nodes
  svg
    .append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("x", (d) => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)) // Position on left or right
    .attr("y", (d) => (d.y1 + d.y0) / 2) // Center vertically
    .attr("dy", "0.35em") // Align text vertically
    .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end")) // Align text to start or end
    .text((d) => d.id) // Node name
    .style("font-size", "14px") // Increase font size for better readability
    .style("font-family", "sans-serif")
    .style("fill", "#000"); // Set text color to black for better contrast

  return svg.node();
}

async function createSankeyChart() {
  // Filter and clean the data if necessary
  const filteredData = rawData.filter(
    (row) => row.item_purchased && row.color && row.category && row.season // Ensure all fields are present
  );

  // Create nodes and links for the Sankey diagram
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

  console.log("Nodes:", nodes);
  console.log("Links:", links);

  // Render the Sankey diagram
  const chart = SankeyChart(
    { nodes, links },
    {
      width: 950,
      height: 800,
      nodeWidth: 20,
      nodePadding: 15,
    }
  );

  // Append the chart to the DOM
  document.getElementById("sankey-chart").appendChild(chart);
}
