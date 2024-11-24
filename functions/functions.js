// Function to load CSV files
let rawData = null;
let globalData = null;
let chosenState = null;

function viewSankeyChart(bool) {
  const original = document.querySelectorAll(".chart-container-3d");
  console.log(original);
  original.forEach((section) => {
    if (bool) section.classList.add("hidden");
    else section.classList.remove("hidden");
  });
  const sections = document.querySelectorAll(".sankey-chart-container");
  sections.forEach((section) => {
    if (bool) section.classList.remove("hidden");
    else section.classList.add("hidden");
  });
}

function showContent(sectionId) {
  // Hide all content sections
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((section) => {
    section.classList.add("hidden");
  });
  //hide all items below
  const filter = document.querySelectorAll(".chart-container");
  filter.forEach((section) => {
    section.classList.add("hidden");
  });
  document.getElementById(sectionId).classList.remove("hidden");
}

function getColorForAmount(amount, maxAmount) {
  const intensity = Math.floor((amount / maxAmount) * 255); // Scale intensity between 0 and 255
  return `rgb(0, 0, ${255 - intensity})`; // Darker blue with higher amounts
}

// Update heatmap legend (color scale)
function updateHeatmapLegend(minAmount, maxAmount) {
  const minIntensity = Math.floor((minAmount / maxAmount) * 255);
  const maxIntensity = Math.floor((maxAmount / maxAmount) * 255);
  const minColor = `rgb(0, 0, ${255 - minIntensity})`;
  const maxColor = `rgb(0, 0, ${255 - maxIntensity})`;

  // Create a linear gradient for the heatmap legend
  const gradient = `linear-gradient(to right, ${minColor}, ${maxColor})`;

  // Apply the gradient to the legend
  const legend = document.getElementById("heatmapLegend");
  legend.querySelector(".legend-gradient").style.background = gradient;
  const lowLabel = legend.querySelector(".legend-scale span:first-child");
  const highLabel = legend.querySelector(".legend-scale span:last-child");
  lowLabel.textContent = `$${minAmount.toLocaleString()}`;
  highLabel.textContent = `$${maxAmount.toLocaleString()}`;
}

function updateMapWithHeatmap() {
  console.log("here");
  const maxAmount = 29589;
  const minAmount = 14428;
  for (const key in statePurchaseAmounts) {
    const amount = statePurchaseAmounts[key];
    const color = getColorForAmount(amount, maxAmount);
    if (simplemaps_usmap_mapdata.state_specific[key]) {
      // console.log("updating");
      simplemaps_usmap_mapdata.state_specific[key].color = color;
      simplemaps_usmap_mapdata.state_specific[key].hover_color = color; // Optional: use the same color on hover
    }

    // console.log(
    // `${key}: ${simplemaps_usmap_mapdata.state_specific[key].color}`
    // );
  }

  // Refresh the map after updating colors
  simplemaps_usmap.load();

  updateHeatmapLegend(minAmount, maxAmount);
}

function createOverviewVis() {
  const canvas = document.getElementById("stateChart").getContext("2d");
  let chartStatus = Chart.getChart("stateChart");
  if (chartStatus == undefined) {
    const seasonItemCounts = {};

    // Aggregate counts for each item by season
    rawData.forEach((entry) => {
      const season = entry.season;
      const item = entry.item_purchased;

      if (!seasonItemCounts[item]) {
        seasonItemCounts[item] = { Spring: 0, Summer: 0, Fall: 0, Winter: 0 };
      }
      seasonItemCounts[item][season] += 1;
    });

    // Prepare data for Chart.js
    const items = Object.keys(seasonItemCounts); // Items on y-axis
    const seasons = ["Spring", "Summer", "Fall", "Winter"]; // Seasons as datasets

    const seasonColors = {
      Spring: "#77DD77",
      Summer: "#FFB347",
      Fall: "#FF6961",
      Winter: "#AEC6CF",
    };

    const datasets = seasons.map((season) => {
      const data = items.map((item) => seasonItemCounts[item][season]);
      return {
        label: season,
        data: data,
        backgroundColor: seasonColors[season], // Use color code for the season
        borderWidth: 1,
      };
    });

    // Create the chart
    window.stateChartInstance = new Chart(canvas, {
      type: "bar",
      data: {
        labels: items, // Items on the y-axis
        datasets: datasets, // Stacked data for each season
      },
      options: {
        indexAxis: "y", // Horizontal bar chart
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${context.raw}`;
              },
            },
          },
          legend: {
            position: "top",
          },
        },
        scales: {
          x: {
            stacked: true, // Stack the bars horizontally
            title: {
              display: true,
              text: "Total Amount",
            },
            beginAtZero: true,
          },
          y: {
            stacked: true, // Keep the stacked structure
            title: {
              display: true,
              text: "Items",
            },
          },
        },
      },
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  function loadCSV(filePath) {
    return new Promise((resolve, reject) => {
      Papa.parse(filePath, {
        download: true,
        header: true,
        complete: (results) => resolve(results.data),
        error: (error) => reject(error),
      });
    });
  }

  const filePath =
    "https://raw.githubusercontent.com/ychenhq/comp4471/main/customer_data_all.csv";

  // Load the CSV file
  loadCSV(filePath)
    .then((data) => {
      console.log("CSV Files Loaded", data);

      // Get the number of rows and columns
      const numRows = data.length;
      const numColumns = numRows > 0 ? Object.keys(data[0]).length : 0;
      // console.log(
      // `Number of rows: ${numRows}, Number of columns: ${numColumns}`
      // );
      rawData = data;
      // Separate data by location
      const locationData = {};

      data.forEach((row) => {
        const location = row.location;
        if (!locationData[location]) {
          locationData[location] = [];
        }
        locationData[location].push(row);
      });

      globalData = locationData;
      // Access data for "New Jersey"
      console.log(locationData["New Jersey"]);
      createSankeyChart();
    })
    .catch((error) => {
      console.error("Error loading CSV file:", error);
    });
  showContent("mapSection");
  updateMapWithHeatmap();
  loadAndPlot3D();
});

function showTopColors(data) {
  // Count occurrences of each color
  const colorCounts = {};
  data.forEach((item) => {
    const color = item.color;
    colorCounts[color] = (colorCounts[color] || 0) + 1;
  });

  // Sort colors by frequency and get the top 5
  const sortedColors = Object.keys(colorCounts).sort(
    (a, b) => colorCounts[b] - colorCounts[a]
  );
  const topColors = sortedColors.slice(0, 5);

  // Clear previous content in the "top-colors" div
  const topColorsDiv = document.getElementById("top-colors");
  topColorsDiv.innerHTML = "<h2>Top Color Preferences</h2>";

  // Create and append circles for top colors
  topColors.forEach((color) => {
    const circle = document.createElement("div");
    const label = document.createElement("p");

    // Style the circle
    circle.style.width = "50px";
    circle.style.height = "50px";
    circle.style.borderRadius = "50%";
    circle.style.backgroundColor = colorMap[color] || "#CCCCCC"; // Use colorMap or fallback to gray
    circle.style.display = "inline-block";
    circle.style.margin = "10px";

    // Add the label
    label.innerText = `${color} (${colorCounts[color]})`;
    label.style.textAlign = "center";
    label.style.margin = "0";
    label.style.fontSize = "14px";
    label.style.color = "#000"; // Black text for labels

    // Create a wrapper to align the circle and label
    const wrapper = document.createElement("div");
    wrapper.style.display = "inline-block";
    wrapper.style.textAlign = "center";
    wrapper.style.margin = "10px";

    wrapper.appendChild(circle);
    wrapper.appendChild(label);

    topColorsDiv.appendChild(wrapper);
  });
}

// Handle state data
function showStateData(stateAbbr) {
  const filter = document.querySelectorAll(".chart-container");
  filter.forEach((section) => {
    section.classList.remove("hidden");
  });
  console.log(stateCodeToName[chosenState]);
  if (stateAbbr != null) {
    chosenState = stateAbbr;
  }
  if (stateAbbr == null && chosenState == null) {
    chosenState = "NY";
  }
  if (chosenState == null) {
    chosenState = stateAbbr;
  }
  const data = globalData[stateCodeToName[chosenState]];
  if (data) {
    console.log("visualizing data");
    // Display the chart container
    document.getElementById("chart-container").style.display = "block";

    const ctx = document.getElementById("stateChartDetails").getContext("2d");
    const frequency = document
      .getElementById("stateChartFrequency")
      .getContext("2d");

    if (Chart.getChart("stateChartDetails") != undefined) {
      Chart.getChart("stateChartDetails").destroy();
    }
    if (Chart.getChart("stateChartFrequency") != undefined) {
      Chart.getChart("stateChartFrequency").destroy();
    }

    document.getElementById(
      "state-name"
    ).innerText = `Top Items Purchased in ${stateCodeToName[chosenState]}`;

    // Aggregate data for gender and season
    const seasonFilter = document.getElementById("seasonFilter");
    const genderItemCounts = { Male: {}, Female: {} };
    const seasonItemCounts = {};

    data.forEach((entry) => {
      const { gender = "Unknown", item_purchased, season } = entry;

      // Gender aggregation
      if (!genderItemCounts[gender]) genderItemCounts[gender] = {};
      genderItemCounts[gender][item_purchased] =
        (genderItemCounts[gender][item_purchased] || 0) + 1;

      // Season aggregation
      if (!seasonItemCounts[item_purchased]) {
        seasonItemCounts[item_purchased] = {
          Spring: 0,
          Summer: 0,
          Fall: 0,
          Winter: 0,
        };
      }
      seasonItemCounts[item_purchased][season] += 1;
    });

    // Extract all unique items
    const allItems = Array.from(
      new Set(
        Object.keys(genderItemCounts.Male || {})
          .concat(Object.keys(genderItemCounts.Female || {}))
          .concat(Object.keys(seasonItemCounts))
      )
    );

    function updateChart(season) {
      const maleItemCounts = allItems.map(
        (item) => genderItemCounts.Male[item] || 0
      );
      const femaleItemCounts = allItems.map(
        (item) => genderItemCounts.Female[item] || 0
      );

      let filteredSeasonCounts = {};
      if (season !== "All") {
        filteredSeasonCounts = allItems.map(
          (item) => seasonItemCounts[item][season] || 0
        );
      }
      const datasets = [
        {
          label: "Male",
          data: maleItemCounts,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "Female",
          data: femaleItemCounts,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ];

      if (season !== "All") {
        datasets.push({
          label: `${season}`,
          data: filteredSeasonCounts,
          backgroundColor: {
            Spring: "#77DD77",
            Summer: "#FFB347",
            Fall: "#FF6961",
            Winter: "#AEC6CF",
          }[season], // Use consistent hues for seasons
          borderColor: "#000",
          borderWidth: 1,
          stack: "Season",
        });
      }
      if (Chart.getChart("stateChartDetails") != undefined) {
        Chart.getChart("stateChartDetails").destroy();
      }

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: allItems, // Items purchased
          datasets: datasets,
        },
        options: {
          indexAxis: "y", // Horizontal bar chart
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
          scales: {
            x: {
              stacked: true, // Enable stacking on the x-axis
              title: {
                display: true,
                text: "Amount",
              },
              beginAtZero: true,
            },
            y: {
              stacked: true, // Enable stacking on the y-axis
              title: {
                display: true,
                text: "Items Purchased",
              },
            },
          },
        },
      });
    }

    // Initial chart load
    updateChart("All");

    // Add event listener for season filter
    seasonFilter.addEventListener("change", (event) => {
      const selectedSeason = event.target.value;
      updateChart(selectedSeason);
    });
    showTopColors(data);
    //Now add the frequency chart
    document.getElementById(
      "state-name"
    ).innerText = `Purchase Frequencies in ${stateCodeToName[chosenState]}`;

    const frequencyCounts = {};

    // Build frequencyCounts with additional details
    data.forEach((item) => {
      const frequency = item.frequency_of_purchases;
      const category = item.category || "Unknown Category";
      const itemPurchased = item.item_purchased || "Unknown Item";

      if (frequency) {
        if (!frequencyCounts[frequency]) {
          frequencyCounts[frequency] = {
            count: 0,
            categories: new Set(),
            items: new Set(),
          };
        }
        frequencyCounts[frequency].count++;
        frequencyCounts[frequency].categories.add(category);
        frequencyCounts[frequency].items.add(itemPurchased);
      }
    });

    // Prepare data for the chart
    const labels = Object.keys(frequencyCounts).map(
      (freq) => frequencyLabels[freq]
    );
    const dataCounts = Object.values(frequencyCounts).map(
      (entry) => entry.count
    );

    new Chart(frequency, {
      type: "polarArea",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Purchase Frequency",
            data: dataCounts,
            backgroundColor: [
              "#003049",
              "#d62828",
              "#f77f00",
              "#fcbf49",
              "#eae2b7",
              "#2a9d8f",
              "#6a4c93",
            ],
            borderColor: "#ffffff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        scale: {
          ticks: {
            beginAtZero: true,
            display: false,
          },
          gridLines: {
            display: false,
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const frequency = labels[tooltipItem.dataIndex];
                const entry = frequencyCounts[frequency];
                const total = dataCounts.reduce((acc, val) => acc + val, 0);
                const percentage =
                  ((tooltipItem.raw / total) * 100).toFixed(1) + "%";

                // Format category and items
                const categories = Array.from(entry.categories).join(", ");
                const items = Array.from(entry.items).join(", ");

                return [
                  `${tooltipItem.label}: ${percentage}`,
                  `Count: ${entry.count}`,
                  `Categories: ${categories}`,
                  `Items: ${items}`,
                ];
              },
            },
          },
          legend: {
            position: "top",
          },
        },
      },
    });

    // Scroll down to the chart container
    document
      .getElementById("chart-container")
      .scrollIntoView({ behavior: "smooth" });
  }
}
