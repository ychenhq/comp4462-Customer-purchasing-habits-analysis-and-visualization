# Customer Purchasing Behaviors Analysis

## Overview
This project explores and visualizes customer purchasing behaviors using a Kaggle dataset and enhances the initial data analysis by combining it with an additional dataset on customer age demographics. The goal is to identify key trends, segment customers, and gain insights into factors influencing purchasing habits.

## Datasets
Primary Dataset
<a name="first-dataset">Customer Purchasing Behaviors Dataset</a>: Contains data on customer demographics, income, purchase frequency, loyalty scores, and purchase amounts. Key fields include:
Age: Customer age group
Region: Customer's regional segment
Annual Income: Customer’s yearly income
Purchase Frequency: How often purchases are made
Loyalty Score: Customer loyalty metric
Purchase Amount: Amount spent per purchase
## Enhancement Dataset
<a name="second-dataset">Customer Shopping Trends Dataset</a>: This dataset provides additional insights into customer age demographics, allowing us to refine our segmentation and conduct age-based analyses.

[https://www.kaggle.com/datasets/hanaksoy/customer-purchasing-behaviors](#first-dataset)
[https://www.kaggle.com/datasets/iamsouravbanerjee/customer-shopping-trends-dataset](#second-dataset)

## Project Workflow
1. Data Visualization
Initial visualizations helped uncover patterns and trends in purchasing behaviors:

***Scatter plot***: This simple chart displays the demographics for age, income distributions as opposed to purchase amount.
![Age and income distribution](https://github.com/ychenhq/comp4471/images/age_to_income.png)
***Loyalty Trends***: Heatmaps to highlight age with loyalty patterns.
![Age to loyalty distribution](https://github.com/ychenhq/comp4471/images/loyalty_to_age.png)
These visualizations provided a preliminary understanding of customer segments and potential factors influencing purchases.

2. Data Enhancement
To gain further insights, we merged the primary dataset with age-based data:

***Enhanced Age Segmentation***: Enabled a more detailed analysis of purchasing trends across different age groups.
Age-Related Purchasing Insights: Improved understanding of age-specific behaviors, combining with data that includes more fields such as:
Location: 1 of the 55 states
Category: Footwear, Clothing etc.
Season: Spring, Summer, Fall, Winter
Color: Color of the item purchased
Item Purchased: Jeans, Glasses, Sweater, Blouse etc.

***Enhanced Visualizations**: With geopgrahic location, we can expand the visualization with geographs. Along with age data, we visualized age-income correlations, loyalty score distributions, gender and purchasing habits across different states.

3. Advanced Visualization and Insights
The combined data enabled us to produce more granular insights:

Age-Income Correlations: Analysis of income levels and purchasing trends by age group.
Loyalty Trends: Comparative visualizations showing loyalty scores across different age demographics.
Regional and Age-Based Purchasing Behaviors: Detailed comparisons of regional purchasing behaviors segmented by age.
Key Findings
Income and Frequency Correlation: Positive correlation in certain age groups between income and purchase frequency.
Regional Trends by Age: Insights into regional shopping patterns for different age demographics.
Loyalty Scores by Age Group: Differences in brand loyalty scores based on age, indicating age-related tendencies in customer loyalty.
Conclusion
This project provides an in-depth exploration of customer purchasing behaviors by merging multiple datasets for comprehensive analysis. The insights gained from combining these datasets can guide marketing strategies and improve customer targeting.

## Future Work
Potential improvements include:

***Additional Data Sources***: Adding datasets related to customer preferences and buying behaviors.

## Predictive Modeling: Using machine learning models to predict purchasing behaviors based on demographic information.

## Getting Started
Prerequisites
Python 3.7+
Jupyter Notebook
Libraries: pandas, matplotlib, seaborn, numpy
Installation
Clone this repository:
`git clone https://github.com/yourusername/customer-purchasing-analysis.git`
Download the datasets from Kaggle and place them in the data/ folder.
Install required libraries:
`pip install -r requirements.txt`

Open Customer_Purchasing_Analysis.ipynb in Jupyter Notebook.
Run each cell to load, visualize, and analyze the data.
License
This project is licensed under the MIT License. See the LICENSE file for details.

