async function loadAndPlot3D() {
  try {
    // Load JSON data (adjust the path to your JSON file)
    const response = await fetch(
      "https://raw.githubusercontent.com/ychenhq/comp4471/main/pca_3d_data.json"
    );
    const jsonData = await response.json();

    // Prepare traces for Plotly
    const traces = jsonData.clusters.map((cluster, index) => {
      const x = cluster.points.map((point) => point[0]);
      const y = cluster.points.map((point) => point[1]);
      const z = cluster.points.map((point) => point[2]);

      return {
        x,
        y,
        z,
        mode: "markers",
        type: "scatter3d",
        marker: {
          color: `hsl(${(index * 360) / jsonData.clusters.length}, 100%, 50%)`,
          size: 4,
        },
        name: `Cluster ${cluster.cluster}`,
      };
    });

    // Optional: Add mesh traces
    const meshes = jsonData.clusters.map((cluster, index) => {
      const x = cluster.points.map((point) => point[0]);
      const y = cluster.points.map((point) => point[1]);
      const z = cluster.points.map((point) => point[2]);

      return {
        type: "mesh3d",
        x,
        y,
        z,
        alphahull: 7,
        opacity: 0.1,
        color: `hsl(${(index * 360) / jsonData.clusters.length}, 100%, 70%)`,
        name: `Cluster ${cluster.cluster} Hull`,
      };
    });

    // Combine traces
    const data = [...traces, ...meshes];

    // Layout for the Plotly visualization
    const layout = {
      title: "3D Cluster Visualization",
      scene: {
        xaxis: { title: "X" },
        yaxis: { title: "Y" },
        zaxis: { title: "Z" },
      },
    };

    // Render the plot
    Plotly.newPlot("3dCluster", data, layout);
  } catch (error) {
    console.error("Error loading or plotting data:", error);
  }
}
