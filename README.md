# Customer Purchasing Behaviors Analysis

## Overview
This project explores and visualizes customer purchasing behaviors based on a Kaggle dataset. The initial data analysis is enhanced by combining it with an additional dataset, adding several new fields and more precision on some existing fields. The goal is to identify key trends, segment customers, and gain insights into factors influencing purchasing habits.

## Datasets

### Primary Dataset
[Customer Purchasing Behaviors Dataset](https://www.kaggle.com/datasets/hanaksoy/customer-purchasing-behaviors): Contains data on customer demographics, income, purchase frequency, loyalty scores, and purchase amounts. Key fields include:
- **Age**: Customer age group
- **Region**: Customer's regional segment
- **Annual Income**: Customer’s yearly income
- **Purchase Frequency**: How often purchases are made
- **Loyalty Score**: Customer loyalty metric
- **Purchase Amount**: Amount spent per purchase

### Enhancement Dataset
[Customer Shopping Trends Dataset](https://www.kaggle.com/datasets/iamsouravbanerjee/customer-shopping-trends-dataset): This dataset provides additional fields of data about customer demographics and similar fields with more precise information, allowing us to refine our segmentation and analyses.

---

## Project Workflow

### Phase 1: Data Visualization with Primary Dataset
Initial visualizations helped uncover patterns and trends in purchasing behaviors:

#### Scatter Plot
Displays the demographics for age and income distributions as related to purchase amount.

![age_to_income](https://github.com/ychenhq/comp4471/blob/main/images/age_to_income.png)

#### Loyalty Trends
Heatmaps to highlight age-related loyalty patterns.

![loyalty_to_age](https://github.com/ychenhq/comp4471/blob/main/images/loyalty_to_age.png)

These visualizations provided a preliminary understanding of customer segments and potential factors influencing purchases.

---

### Phase 2: Enhanced Analysis with Merged Dataset
To gain further insights, we merged the primary dataset with age-based data:

#### Enhanced Age Segmentation
Enabled a more detailed analysis of purchasing trends across different age groups. The enlarged dataset improved our behavior analysis, combining fields such as:
- **Location**: One of the 55 states
- **Category**: Footwear, Clothing, etc.
- **Season**: Spring, Summer, Fall, Winter
- **Color**: Color of the item purchased
- **Item Purchased**: Jeans, Glasses, Sweater, Blouse, etc.

#### Enhanced Visualizations
With more precise geographic locations, we expanded the visualization with a choropleth map. We presented an overall view over the whole country, as well as refined views for each state, showing purchasing trends across seasons.

![heatmap](https://github.com/ychenhq/comp4471/blob/main/images/heatmap.png)

#### State Details on Click
Clicking a state provides detailed insights on purchasing trends.

![data_overview](https://github.com/ychenhq/comp4471/blob/main/images/data_overview.png)

#### Data Overview with Sankey Diagram
A Sankey Diagram visualizes the correlation within color, item category, and season. The interactive responsiveness of the nodes allows us to visualize the connections between different categories.

![sankey_chart](https://github.com/ychenhq/comp4471/blob/main/images/sankey_chart.png)

#### Advanced Insights with PCA
The combined data allowed for granular insights, especially through Principle Component Analysis (PCA), reducing high dimensionality and enabling better conclusions.

![pca_analysis](https://github.com/ychenhq/comp4471/blob/main/images/pca_analysis.png)

---

## Key Findings

- **Income and Frequency Correlation**: Positive correlation in certain age groups between income and purchase frequency.
- **Regional Trends by Age**: Insights into regional shopping patterns for different age demographics.
- **High-Intensity States**: States with strong customer engagement and high purchase amounts reflect loyalty and familiarity.
- **Low-Intensity States**: States with lower engagement suggest untapped potential or market challenges.

---

## Conclusion
This project provides an in-depth visualization of customer purchasing behaviors by merging two datasets for comprehensive data analysis. The visualization dataset can guide marketing strategies and improve customer targeting.

---

## Future Work
Potential improvements include:

- **Additional Data Sources**: Adding datasets related to customer preferences and buying behaviors.
- **Predictive Modeling**: Using machine learning models to predict purchasing behaviors based on demographic information.

---

## Getting Started

### Prerequisites
- Python 3.7+
- Jupyter Notebook
- Libraries: `pandas`, `matplotlib`, `seaborn`, `numpy`

### Usage

Open file `main.html` to view all charts

### Installation

Clone this repository:

```bash
git clone https://github.com/yourusername/customer-purchasing-analysis.git

