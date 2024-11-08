// Function to load CSV files
let globalData = null;

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
      console.log(
        `Number of rows: ${numRows}, Number of columns: ${numColumns}`
      );

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
});

// Handle state click
function showStateData(stateAbbr) {
  //   console.log(stateCodeToName[stateAbbr]);
  const data = globalData[stateCodeToName[stateAbbr]];
  if (data) {
    console.log("viualizing data");
    // Display the chart container
    document.getElementById("chart-container").style.display = "block";
    document.getElementById("state-name").innerText = `Data for ${stateAbbr}`;

    // Clear previous chart if it exists
    if (window.stateChartInstance) {
      window.stateChartInstance.destroy();
    }

    // Generate the chart
    const ctx = document.getElementById("stateChart").getContext("2d");
    window.stateChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Metric 1",
          "Metric 2",
          "Metric 3",
          "Metric 4",
          "Metric 5",
          "Metric 6",
        ],
        datasets: [
          {
            label: `${stateAbbr} Data`,
            data: data,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
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
