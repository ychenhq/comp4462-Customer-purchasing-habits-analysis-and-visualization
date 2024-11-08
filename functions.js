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
    document.getElementById(
      "state-name"
    ).innerText = `Data for ${stateCodeToName[stateAbbr]}`;

    // Clear previous chart if it exists
    if (window.stateChartInstance) {
      window.stateChartInstance.destroy();
    }

    // Generate the chart
    const ctx = document.getElementById("stateChart").getContext("2d");

    // Separate data by gender
    const maleData = data.filter((item) => item.gender === "Male");
    const femaleData = data.filter((item) => item.gender === "Female");

    // Function to get age counts by gender
    function getAgeCounts(ages) {
      const ageBins = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70]; // Bin edges
      const ageCounts = Array(ageBins.length - 1).fill(0);

      // Count number of people in each bin
      ages.forEach((age) => {
        for (let i = 0; i < ageBins.length - 1; i++) {
          if (age >= ageBins[i] && age < ageBins[i + 1]) {
            ageCounts[i]++;
          }
        }
      });

      return ageCounts;
    }

    // Get age counts for male and female data
    const maleAges = maleData.map((item) => parseInt(item.age));
    const femaleAges = femaleData.map((item) => parseInt(item.age));

    const maleAgeCounts = getAgeCounts(maleAges);
    const femaleAgeCounts = getAgeCounts(femaleAges);

    // Chart.js Histogram (Bar chart)
    window.stateChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "20-25",
          "25-30",
          "30-35",
          "35-40",
          "40-45",
          "45-50",
          "50-55",
          "55-60",
          "60-65",
          "65-70",
        ], // Age Range labels
        datasets: [
          {
            label: "Male",
            data: maleAgeCounts,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Female",
            data: femaleAgeCounts,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: "Age Range",
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

    // Scroll down to the chart container
    document
      .getElementById("chart-container")
      .scrollIntoView({ behavior: "smooth" });
  }
}
