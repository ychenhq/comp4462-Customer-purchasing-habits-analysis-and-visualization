// Function to load CSV files
let rawData = null;
let globalData = null;
let chosenState = null;

function viewSankeyChart(bool) {
  const original = document.querySelectorAll(".chart-container-3d");
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

function getColorForAmount(amount, minAmount, maxAmount) {
  const intensity = Math.floor((amount - minAmount) / (maxAmount - minAmount) * 255); // Scale intensity between 0 and 255
  return `rgb(0, 0, ${255 - intensity})`; // Darker blue with higher amounts
}

// Update heatmap legend (color scale)
function updateHeatmapLegend(minAmount, maxAmount) {
  const minIntensity = Math.floor((minAmount - minAmount) / (maxAmount - minAmount) * 255);
  const maxIntensity = Math.floor((maxAmount - minAmount) / (maxAmount - minAmount) * 255);
  const minColor = `rgb(0, 0, ${255 - minIntensity})`;
  const maxColor = `rgb(0, 0, ${255 - maxIntensity})`;

  // Create a linear gradient for the heatmap legend
  const gradient = `linear-gradient(to bottom, ${minColor}, ${maxColor})`;

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
    const color = getColorForAmount(amount, minAmount, maxAmount);
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

function showTopColors(data, season = "All") {
  // Count occurrences of each color
  const colorCounts = {};

  data.forEach((item) => {
    const color = item.color;
    const itemSeason = item.season;

    // Filter by season if needed
    if (season === "All" || itemSeason === season) {
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    }
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
    document.getElementById("chart-container").style.display = "block";
    const ctx = document.getElementById("stateChartDetails").getContext("2d");
    const frequency = document
      .getElementById("stateChartFrequency")
      .getContext("2d");

    document.getElementById(
      "state-name"
    ).innerText = `Top Items Purchased in ${stateCodeToName[chosenState]}`;

    // Aggregate data for gender and season
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
      if (Chart.getChart("stateChartDetails") != undefined) {
        Chart.getChart("stateChartDetails").destroy();
      }
      if (Chart.getChart("stateChartFrequency") != undefined) {
        Chart.getChart("stateChartFrequency").destroy();
      }
    
      // Prepare item counts for male and female, by season
      const maleItemCounts = allItems.map((item) => {
        if (season === "All") {
          return genderItemCounts.Male[item] || 0; // Total male count for the item
        } else {
          return data.filter(entry => entry.gender === "Male" && entry.item_purchased === item && entry.season === season).length; // Male count for selected season
        }
      });
    
      const femaleItemCounts = allItems.map((item) => {
        if (season === "All") {
          return genderItemCounts.Female[item] || 0; // Total female count for the item
        } else {
          return data.filter(entry => entry.gender === "Female" && entry.item_purchased === item && entry.season === season).length; // Female count for selected season
        }
      });
    
      // Create the dataset for each gender, depending on the season
      const datasets = [
        {
          label: "Male",
          data: maleItemCounts,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
        {
          label: "Female",
          data: femaleItemCounts,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ];
    
      // Update the bar chart
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: allItems,
          datasets: datasets,
        },
        options: {
          responsive: true,
          scales: {
            x: {
              stacked: false, // Disable stacking to separate each gender
            },
            y: {
              stacked: false, // Disable stacking on the y-axis as well
            },
          },
        },
      });
    
      // Update top colors
      showTopColors(data, season);
    
      // Update purchase frequency chart
      updateFrequencyChart(data, season);
    
      // Scroll down to the chart container
      document
        .getElementById("chart-container")
        .scrollIntoView({ behavior: "smooth" });
    }
    
    function updateFrequencyChart(data, season) {
      const frequencyCounts = {};

      data.forEach((item) => {
        if (season !== "All" && item.season !== season) return;
        const frequency = item.frequency_of_purchases;
        if (!frequencyCounts[frequency]) {
          frequencyCounts[frequency] = 0;
        }
        frequencyCounts[frequency]++;
      });

      const labels = Object.keys(frequencyCounts);
      const counts = Object.values(frequencyCounts);

      new Chart(frequency, {
        type: "polarArea",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Purchase Frequency",
              data: counts,
              backgroundColor: [
                "#003049",
                "#d62828",
                "#f77f00",
                "#fcbf49",
                "#eae2b7",
                "#2a9d8f",
                "#6a4c93",
              ],
            },
          ],
        },
        options: { responsive: true },
      });
    }

    // Initial chart load
    updateChart("All");

    // Add event listener for season filter
    document.getElementById("seasonFilter").addEventListener("change", (e) => {
      updateChart(e.target.value);
    });
  }
}
