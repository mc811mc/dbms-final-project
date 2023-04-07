# Visualizing Environmental Pollution : Air, Water Pollution Visualization Map

## 1. Using the API/ Website to fetch the data
Download Air pollution Data from here: <br> 
https://www.kaggle.com/datasets/mayukh18/deap-deciphering-environmental-air-pollution <br> 

Download Water pollution Data from here: <br> 
https://www.waterqualitydata.us/ <br> 
<br>
Parameters used while downloading the data : <br> 
Site type: Facility (nowise, storet)<br>
Data Source: Nwis, stewards, wax<br>
Date range: 01-01-2019 and 12-11-2020<br>
Sample media: water(nowise, stewards, storet)<br>
Characteristic group: microbiological, biological, physical, (inorganic, major, metals), (inorganic, major, non-metals)<br>
Data Profiles: Sample Results (Physical/chemical metadata)<br> 

User guide for this database can be found here: <br>
https://www.waterqualitydata.us/portal_userguide/

## 2. Creating Database from the downloaded data
At first we clean the downloaded file and remove any records that is missing data for specific fields. <br>
Also we remove the fields that is not relevant to the analysis or has too many missing values. <br>

