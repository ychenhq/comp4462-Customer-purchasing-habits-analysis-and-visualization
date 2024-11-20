// ridgeline.js
class RidgelinePlot {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.width = options.width || 800;
    this.height = options.height || 400;
    this.data = options.data;
    this.margin = { top: 20, right: 30, bottom: 30, left: 40 };
    this.distributions = [
      { name: "Purchase Amount", field: "purchase_amount", color: "#60a5fa" },
      { name: "Category", field: "category", color: "#3b82f6" },
      { name: "Discount Applied", field: "discount_applied", color: "#93c5fd" },
      { name: "Payment Method", field: "payment_method", color: "#93c5fd" },
    ];

    this.init();
  }

  generateData() {
    const monthtoindex = ["Spring", "Summer", "Autumn", "Winter"];
    let datas = {
      "Purchase Amount": [0, 0, 0, 0],
      Category: {},
      "Discount Applied": [],
      "Payment Method": {},
    };
    this.data.forEach((item) => {
      datas["Purchase Amount"][monthtoindex.indexOf(item.season)] +=
        item.purchase_amount;
      if (!datas["Category"][item.category]) {
        datas["Category"][item.category] = [0, 0, 0, 0];
      }
      datas["Category"][item.category][monthtoindex.indexOf(item.season)] += 1;
      datas["Discount Applied"][monthtoindex.indexOf(item.season)] +=
        item.discout_applied == "Yes";
      if (!datas["Payment Method"][item.payment_method]) {
        datas["Payment Method"][item.payment_method] = [0, 0, 0, 0];
      }
      datas["Payment Method"][item.payment_method][
        monthtoindex.indexOf(item.season)
      ] += 1;
    });
    console.log("datas");
    console.log(datas);
    return datas;
  }

  createSVG() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("width", this.width);
    this.svg.setAttribute("height", this.height);
    this.svg.style.overflow = "visible";
    this.container.appendChild(this.svg);

    // Add definitions for gradients
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    this.distributions.forEach((dist, i) => {
      const gradient = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "linearGradient"
      );
      gradient.setAttribute("id", `gradient-${i}`);
      gradient.setAttribute("x1", "0");
      gradient.setAttribute("y1", "0");
      gradient.setAttribute("x2", "0");
      gradient.setAttribute("y2", "1");

      const stop1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "stop"
      );
      stop1.setAttribute("offset", "0%");
      stop1.setAttribute("stop-color", dist.color);
      stop1.setAttribute("stop-opacity", "0.8");

      const stop2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "stop"
      );
      stop2.setAttribute("offset", "100%");
      stop2.setAttribute("stop-color", dist.color);
      stop2.setAttribute("stop-opacity", "0.2");

      gradient.appendChild(stop1);
      gradient.appendChild(stop2);
      defs.appendChild(gradient);
    });
    this.svg.appendChild(defs);
  }

  createAxes() {
    // Create X-axis
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "g");
    xAxis.setAttribute(
      "transform",
      `translate(0,${this.height - this.margin.bottom})`
    );

    // Add x-axis line
    const xLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    xLine.setAttribute("x1", this.margin.left);
    xLine.setAttribute("x2", this.width - this.margin.right);
    xLine.setAttribute("stroke", "#000");
    xAxis.appendChild(xLine);

    // Add x-axis ticks and labels
    for (let x = 0; x < 4; x++) {
      const xPos = this.xScale(x);

      const tick = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      tick.setAttribute("x1", xPos);
      tick.setAttribute("x2", xPos);
      tick.setAttribute("y1", 0);
      tick.setAttribute("y2", 6);
      tick.setAttribute("stroke", "#000");

      const label = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      label.setAttribute("x", xPos);
      label.setAttribute("y", 20);
      label.setAttribute("text-anchor", "middle");
      label.textContent = x;

      xAxis.appendChild(tick);
      xAxis.appendChild(label);
    }

    this.svg.appendChild(xAxis);
  }

  createTooltip() {
    this.tooltip = document.createElement("div");
    this.tooltip.style.position = "absolute";
    this.tooltip.style.display = "none";
    this.tooltip.style.backgroundColor = "white";
    this.tooltip.style.padding = "8px";
    this.tooltip.style.border = "1px solid #ccc";
    this.tooltip.style.borderRadius = "4px";
    this.tooltip.style.pointerEvents = "none";
    this.container.appendChild(this.tooltip);
  }

  showTooltip(event, data) {
    const rect = this.container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.tooltip.style.display = "block";
    this.tooltip.style.left = `${x + 10}px`;
    this.tooltip.style.top = `${y + 10}px`;
    this.tooltip.innerHTML = `
		<div style="font-weight: 500">${data.name}</div>
		<div>Value: ${data.x.toFixed(2)}</div>
	  `;
  }

  hideTooltip() {
    this.tooltip.style.display = "none";
  }

  xScale(x) {
    return (
      this.margin.left +
      ((x + 4) * (this.width - this.margin.left - this.margin.right)) / 8
    );
  }

  yScale(y, offset) {
    return this.height - this.margin.bottom - y - offset * 50;
  }

  createArea(points, index) {
    const offset = index * 0.5;
    let d = `M ${this.xScale(points[0].x)} ${this.yScale(0, index)}`;

    // Add points
    points.forEach((point) => {
      d += ` L ${this.xScale(point.x)} ${this.yScale(point.y, index)}`;
    });

    // Close the path
    d += ` L ${this.xScale(points[points.length - 1].x)} ${this.yScale(
      0,
      index
    )} Z`;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", `url(#gradient-${index})`);
    path.setAttribute("stroke", this.distributions[index].color);
    path.style.transition = "opacity 0.3s ease";

    return path;
  }

  createLegend() {
    const legend = document.createElement("div");
    legend.style.display = "flex";
    legend.style.gap = "1rem";
    legend.style.marginTop = "1rem";

    this.distributions.forEach((dist, index) => {
      const item = document.createElement("div");
      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.gap = "0.5rem";
      item.style.cursor = "pointer";

      const color = document.createElement("div");
      color.style.width = "16px";
      color.style.height = "16px";
      color.style.backgroundColor = dist.color;
      color.style.borderRadius = "4px";

      const label = document.createElement("span");
      label.textContent = dist.name;

      item.appendChild(color);
      item.appendChild(label);

      // Add hover interactions
      item.addEventListener("mouseenter", () =>
        this.highlightDistribution(index)
      );
      item.addEventListener("mouseleave", () => this.resetHighlight());

      legend.appendChild(item);
    });

    this.container.appendChild(legend);
  }

  highlightDistribution(index) {
    const paths = this.svg.querySelectorAll("path");
    paths.forEach((path, i) => {
      path.style.opacity = i === index ? 1 : 0.3;
    });
  }

  resetHighlight() {
    const paths = this.svg.querySelectorAll("path");
    paths.forEach((path) => {
      path.style.opacity = 1;
    });
  }

  init() {
    // Create container styles
    this.container.style.position = "relative";

    // Create SVG
    this.createSVG();

    // Create tooltip
    this.createTooltip();

    // Generate and add distributions
    this.distributions.forEach((dist, index) => {
      const points = this.generateData();
      const path = this.createArea(points, index);

      // Add hover interactions
      path.addEventListener("mouseenter", () =>
        this.highlightDistribution(index)
      );
      path.addEventListener("mouseleave", () => this.resetHighlight());

      // Add tooltip interactions
      points.forEach((point) => {
        path.addEventListener("mousemove", (e) =>
          this.showTooltip(e, { ...point, name: dist.name })
        );
        path.addEventListener("mouseleave", () => this.hideTooltip());
      });

      this.svg.appendChild(path);
    });

    // Create axes
    this.createAxes();

    // Create legend
    this.createLegend();
  }
}

//const ridgelinePlot = new RidgelinePlot("ridgeline-container", {
// width: 800,
//  height: 400,
//  data: rawData,
// });

// Generate the data and render the plot

//ridgelinePlot.init(rawData);
