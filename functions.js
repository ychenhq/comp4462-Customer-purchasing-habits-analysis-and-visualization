// Function to load CSV files
let globalData = null;
let chosenState = null;

function showContent(sectionId) {
  // Hide all content sections
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((section) => {
    section.classList.add("hidden");
  });

  // Show the selected content section
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
    })
    .catch((error) => {
      console.error("Error loading CSV file:", error);
    });
  showContent("mapSection");
  updateMapWithHeatmap();
});

// Handle state data
function showStateData(stateAbbr, chartType = "gender") {
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

    // Clear previous chart if it exists
    if (window.stateChartInstance) {
      window.stateChartInstance.destroy();
    }

    if (chartType == "gender") {
      document.getElementById(
        "state-name"
      ).innerText = `Gender Distribution for Items Purchased in ${stateCodeToName[chosenState]}`;
      const ctx = document.getElementById("stateChart").getContext("2d");

      // Aggregate data for items purchased by gender
      const genderItemCounts = {
        Male: {},
        Female: {},
      };

      // Count the frequency of each item purchased by gender
      data.forEach((item) => {
        const gender = item.gender || "Unknown";
        const purchasedItem = item.item_purchased || "Unknown Item";

        if (!genderItemCounts[gender]) {
          genderItemCounts[gender] = {};
        }
        genderItemCounts[gender][purchasedItem] =
          (genderItemCounts[gender][purchasedItem] || 0) + 1;
      });

      // Extract item labels and corresponding data for males and females
      const allItems = Array.from(
        new Set(
          Object.keys(genderItemCounts.Male || {}).concat(
            Object.keys(genderItemCounts.Female || {})
          )
        )
      );

      const maleItemCounts = allItems.map(
        (item) => genderItemCounts.Male[item] || 0
      );
      const femaleItemCounts = allItems.map(
        (item) => genderItemCounts.Female[item] || 0
      );

      // Create the bar chart with items on the x-axis
      window.stateChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: allItems, // Items purchased
          datasets: [
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
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Items Purchased",
              },
              ticks: {
                autoSkip: false, // Prevent skipping of item labels
                maxRotation: 90,
                minRotation: 70,
              },
            },
            y: {
              title: {
                display: true,
                text: "Frequency",
              },
              beginAtZero: true,
            },
          },
        },
      });
    } else if (chartType == "color") {
      // console.log("printing color");
      document.getElementById(
        "state-name"
      ).innerText = `Top Color Preferences in ${stateCodeToName[chosenState]}`;
      const colorCounts = {};
      // Clear previous chart if it exists
      if (window.stateChartInstance) {
        window.stateChartInstance.destroy();
      }

      // Count occurrences of each color
      data.forEach((item) => {
        const color = item.color;
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      });

      // Sort colors by frequency
      const sortedColors = Object.keys(colorCounts).sort(
        (a, b) => colorCounts[b] - colorCounts[a]
      );
      const sortedCounts = sortedColors.map((color) => colorCounts[color]);
      const colorPalette = sortedColors.map(
        (color) => colorMap[color] || "#CCCCCC"
      ); // Default to gray if color is not found

      // Generate the Chart.js bar chart
      const ctx = document.getElementById("stateChart").getContext("2d");
      window.stateChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: sortedColors,
          datasets: [
            {
              label: `Color Preferences in ${chosenState}`,
              data: sortedCounts,
              backgroundColor: colorPalette,
              borderColor: colorPalette.map((color) =>
                color.replace("0.6", "1")
              ), // Darker border
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.label}: ${context.raw}`;
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Color",
              },
              ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 45,
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Count",
              },
            },
          },
        },
      });
    } else if ((chartType = "frequency")) {
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

      // Clear previous chart if it exists
      if (window.stateChartInstance) {
        window.stateChartInstance.destroy();
      }

      // Prepare data for the chart
      const labels = Object.keys(frequencyCounts).map(
        (freq) => frequencyLabels[freq]
      );
      const dataCounts = Object.values(frequencyCounts).map(
        (entry) => entry.count
      );

      const ctx = document.getElementById("stateChart").getContext("2d");
      window.stateChartInstance = new Chart(ctx, {
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
    }

    // Scroll down to the chart container
    document
      .getElementById("chart-container")
      .scrollIntoView({ behavior: "smooth" });
  }
}
