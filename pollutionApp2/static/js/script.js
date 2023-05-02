/****** EVENT LISTENERS FOR CONTROL PANEL *******/
// year_select listener for map, linechart, stacked bar chart and scatter plot
document.getElementById('year_select').addEventListener('change', function() {
    var selectedCity = document.getElementById('city_select').value;
    var selectedYear = parseInt(this.value);
    drawLineChart(selectedCity, selectedYear);
    drawGeoChart(selectedYear); // Add this line to update the map markers
    drawStackedBarChart(selectedYear);
    var selectedPollutant = document.getElementById('pollutant_select').value;
    drawScatterPlot(selectedYear, selectedPollutant);
    var pm25Filter = document.getElementById('pm25-range-filter').value;
    var selectedMonth = parseInt(document.getElementById('month_select').value);
    //var selectedDay = parseInt(document.getElementById('day_select').value);
    drawGeoChart(selectedYear, pm25Filter,selectedMonth);
});

// pm25-range-filter listener for pm2.5 filtering on map
document.getElementById('pm25-range-filter').addEventListener('change', function() {
    var selectedYear = parseInt(document.getElementById('year_select').value);
    var pm25Filter = this.value;
    var selectedMonth = parseInt(document.getElementById('month_select').value);
    //var selectedDay = parseInt(document.getElementById('day_select').value);
    drawGeoChart(selectedYear, pm25Filter,selectedMonth);
});

// month_select listener for month filtering on map
document.getElementById('month_select').addEventListener('change', function() {
    var selectedYear = parseInt(document.getElementById('year_select').value);
    var aqiFilter = document.getElementById('pm25-range-filter').value;
    var selectedMonth = parseInt(document.getElementById('month_select').value);
    //var selectedDay = parseInt(document.getElementById('day_select').value);
    drawGeoChart(selectedYear, aqiFilter,selectedMonth);
});

// day_select listener for day filtering on map
// document.getElementById('day_select').addEventListener('change', function() {
//     var selectedYear = parseInt(document.getElementById('year_select').value);
//     var pm25Filter = document.getElementById('pm25-range-filter').value;
//     var selectedMonth = parseInt(document.getElementById('month_select').value);
//     var selectedDay = parseInt(document.getElementById('day_select').value);
//     drawGeoChart(selectedYear, pm25Filter,selectedMonth, selectedDay);
// });

// city_select listener for line chart
document.getElementById('city_select').addEventListener('change', function() {
    var selectedCity = this.value;
    var selectedYear = parseInt(document.getElementById('year_select').value);
    drawLineChart(selectedCity, selectedYear);
});

function drawMap() {
    // dimension of themap
    const width = 960, height = 600;

    const projection = d3.geoAlbersUsa().scale(1280).translate([width / 2, height / 2]);
    const path = d3.geoPath().projection(projection);

    const svg = d3.select("#map");

    d3.json("https://unpkg.com/us-atlas@3/states-10m.json").then((us) => {
        svg.append("g")
            .attr("fill", "#ddd")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .join("path")
            .attr("d", path)
            .attr("stroke", "#fff")
            .attr("stroke-width", 1);
    });

    // zooming functionality
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', function (event) {
            svg.selectAll('path').attr('transform', event.transform);
            svg.selectAll('.marker').attr('transform', event.transform);
        });

    svg.call(zoom);
}
// Calling drawMap
drawMap();

function drawMapLegend() {
    const legendData = [
        {label: "Good (0-50)", color: "green"},
        {label: "Moderate (51-100)", color: "yellow"},
        {label: "Unhealthy for Sensitive Groups (101-150)", color: "orange"},
        {label: "Unhealthy (151-200)", color: "red"},
        {label: "Very Unhealthy (201-300)", color: "purple"},
        {label: "Hazardous (301-500)", color: "maroon"}
    ];

    const legend = d3.select("#legend")

    legend.selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("y", (d, i) => i * 25)
        .attr("fill", (d) => d.color);

    legend.selectAll("text")
        .data(legendData)
        .enter()
        .append("text")
        .attr("x", 25)
        .attr("y", (d, i) => i * 25 + 15)
        .text((d) => d.label);
}
// Calling drawLegend
drawMapLegend();

// helper for color scheme for markers on map
function aqiColorScale(value) {
    console.log("pm color scale value: ", value);
    if (value <= 50) {
        return "green";
    } else if (value <= 100) {
        return "yellow";
    } else if (value <= 150) {
        return "orange";
    } else if (value <= 200) {
        return "red";
    } else if (value <= 300) {
        return "purple";
    } else {
        return "maroon";
    }
}

// helper for hide/display logic of markers on map
function aqiFilterRange(filter) {
    switch (filter) {
        case "good":
            return [0, 50];
        case "moderate":
            return [51, 100];
        case "unhealthy-for-sg":
            return [101, 150];
        case "unhealthy":
            return [151, 200];
        case "very-unhealthy":
            return [201, 300];
        case "hazardous":
            return [301, 500];
        default:
            return [0, 500];
    }
}

function drawGeoChart(selectedYear, aqiFilter, selectedMonth) {
    const width = 960,
        height = 600;

    const projection = d3.geoAlbersUsa().scale(1280).translate([width / 2, height / 2]);

    const svg = d3.select("#map");
    svg.selectAll(".marker").remove();

    // filter by year, month, and day
    const filteredLocations = locations.filter(function (location) {
        var locationDate = new Date(location.Date);
        var locationYear = locationDate.getFullYear();
        var locationMonth = locationDate.getMonth() + 1;
        // var locationDay = locationDate.getDate();
        // return locationYear === selectedYear && locationMonth === selectedMonth && locationDay === selectedDay;
        return locationYear === selectedYear && locationMonth === selectedMonth;
    });

    const selectedAqiRange = aqiFilterRange(aqiFilter);

    const filteredYearAQI = filteredLocations.filter(d => {
        const avgAQI = Math.max(d.o3_median, d.pm25_median, d.no2_median, d.co_median, d.so2_median);
        return avgAQI >= selectedAqiRange[0] && 
        avgAQI <= selectedAqiRange[1];
    });

    svg.append("g")
        .selectAll(".marker")
        .data(filteredYearAQI)
        .join("circle")
        .attr("class", "marker")
        .attr("cx", (d) => projection([d.longitude, d.latitude])[0])
        .attr("cy", (d) => projection([d.longitude, d.latitude])[1])
        .attr("r", 6) // Adjusts marker size
        .attr("fill", (d) => aqiColorScale(Math.max(d.o3_median, d.pm25_median, d.no2_median, d.co_median, d.so2_median)));
}

// ******* LINE CHART ****** //

// helper to compute monthly averages for the year selection
function calculateMonthlyAverages(filteredLocations) {
    const monthlyTotals = Array(12).fill(null).map((_, index) => ({
        month: index + 1,
        pm25: 0,
        o3: 0,
        no2: 0,
        co: 0,
        so2: 0,
        count: 0,
    }));

    filteredLocations.forEach(location => {
        const monthIndex = new Date(location.Date).getMonth();
        const monthlyTotal = monthlyTotals[monthIndex];

        monthlyTotal.pm25 += location.pm25_median || 0;
        monthlyTotal.o3 += location.o3_median || 0;
        monthlyTotal.no2 += location.no2_median || 0;
        monthlyTotal.co += location.co_median || 0;
        monthlyTotal.so2 += location.so2_median || 0;
        monthlyTotal.count += 1;
    });

    const monthlyAverages = monthlyTotals.map(total => ({
        month: total.month,
        pm25: total.pm25 / total.count || 0,
        o3: total.o3 / total.count || 0,
        no2: total.no2 / total.count || 0,
        co: total.co / total.count || 0,
        so2: total.so2 / total.count || 0,
    }));
    return monthlyAverages;
}

function drawLineChart(city, year) {
    // Set up the SVG and dimensions for the line chart
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 650 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select("#line_chart svg").remove();

    const svg = d3
        .select("#line_chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Creating and setting up x and y scales, might play around witht this to adjust according to data values we have
    const xScale = d3.scaleLinear().domain([1, 12]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 80]).range([height, 0]); // Adjust the domain based on your data range

    // Draw the axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    svg.append("g").attr("class", "y axis").call(yAxis);

    // Prepare the data
    const filteredLocations = locations.filter(
    (location) =>
        location.City === city &&
        new Date(location.Date).getFullYear() === year
    );

    const monthlyAverages = calculateMonthlyAverages(filteredLocations);
//  console.log('filtered locations: ', filteredLocations);
//  console.log('monthly avgs: ', monthlyAverages);

    const pollutants = [
        { key: "pm25", color: "steelblue", label: "PM2.5" },
        { key: "o3", color: "red", label: "O3" },
        { key: "no2", color: "green", label: "NO2" },
        { key: "co", color: "purple", label: "CO" },
        { key: "so2", color: "orange", label: "SO2" },
    ];

    pollutants.forEach(({ key, color, label }, index) => {
        const lineGenerator = d3.line()
            .x(d => xScale(d.month))
            .y(d => yScale(d[key]));

        svg.append("path")
            .datum(monthlyAverages)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("d", lineGenerator);

        // Add legend
        const legend = svg.append("g")
            .attr("transform", `translate(${width - 80}, ${20 + 20 * index})`);

        legend.append("circle")
            .attr("cx", 10)
            .attr("cy", 10)
            .attr("r", 5)
            .style("fill", color);

        legend.append("text")
            .attr("x", 20)
            .attr("y", 15)
            .text(`${label}`)
            .style("font-size", "12px");
    });

    // X axis label
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + margin.top + 20)
    .text("Month");

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
        .attr("x", -margin.top)
        .text("Pollutant AQI")

}


// ******* STACKED BAR CHART ****** //

// helper to compute pollutant average for the year selection
function calculateCountyAverages(filteredData) {
    // Create an empty object to store the county data
    const countyData = {};

    // Loop through the filtered data to calculate sums and counts for each pollutant
    filteredData.forEach((row) => {
        const county = row.County;

        // If the county is not in the countyData object, initialize it
        if (!countyData[county]) {
            countyData[county] = {
                county: county,
                pm25_sum: 0,
                o3_sum: 0,
                no2_sum: 0,
                co_sum: 0,
                so2_sum: 0,
                count: 0,
            };
        }

        // Update the sums and counts for each pollutant
        countyData[county].pm25_sum += row.pm25_median || 0;
        countyData[county].o3_sum += row.o3_median || 0;
        countyData[county].no2_sum += row.no2_median || 0;
        countyData[county].co_sum += row.co_median || 0;
        countyData[county].so2_sum += row.so2_median || 0;
        countyData[county].count += 1;
    });

    // Calculate the averages for each pollutant and the total average for each county
    const countyAverages = Object.values(countyData).map((data) => {
        const pm25_avg = data.pm25_sum / data.count;
        const o3_avg = data.o3_sum / data.count;
        const no2_avg = data.no2_sum / data.count;
        const co_avg = data.co_sum / data.count;
        const so2_avg = data.so2_sum / data.count;

        return {
            county: data.county,
            pm25: pm25_avg,
            o3: o3_avg,
            no2: no2_avg,
            co: co_avg,
            so2: so2_avg,
            total: pm25_avg + o3_avg + no2_avg + co_avg + so2_avg,
        };
    });

    return countyAverages;
}
function drawStackedBarChart(selectedYear) {
    // Filter data for the selected year
    const filteredData = locations.filter(function (location) {
        var locationYear = new Date(location.Date).getFullYear();
        return locationYear === selectedYear;
    });

    // Calculate the sum and average of pollutants for each county
    const countyData = calculateCountyAverages(filteredData);
  
    // Sort by the sum of all the averaged pollutants and slice to the top 5 based on 'total'
    const top5Counties = countyData.sort((a, b) => b.total - a.total).slice(0, 5);

    const margin = { top: 20, right: 20, bottom: 30, left: 30 };
    const width = 550 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select("#stacked_bar_chart svg").remove();
  
    const svg = d3
      .select("#stacked_bar_chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    const xScale = d3
      .scaleBand()
      .domain(top5Counties.map((d) => d.county))
      .range([0, width])
      .padding(0.3);
  
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(top5Counties, (d) => d.total)])
      .range([height, 0]);
  
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
  
    svg.append("g").attr("class", "x axis").attr("transform", `translate(0, ${height})`).call(xAxis);
    svg.append("g").attr("class", "y axis").call(yAxis);
  
    const pollutants = [
      { key: "pm25", color: "steelblue", label: "PM2.5" },
      { key: "o3", color: "red", label: "O3" },
      { key: "no2", color: "green", label: "NO2" },
      { key: "co", color: "purple", label: "CO" },
      { key: "so2", color: "orange", label: "SO2" },
    ];
  
    const stack = d3.stack().keys(pollutants.map((p) => p.key));
    const stackedData = stack(top5Counties);
  
    stackedData.forEach((pollutant, i) => {
      svg
        .selectAll(`.pollutant-${i}`)
        .data(pollutant)
        .enter()
        .append("rect")
        .attr("class", `pollutant-${i}`)
        .attr("x", (d) => xScale(d.data.county))
        .attr("y", (d) => yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
        .style("fill", pollutants[i].color);
    });
    
    // Add legend
    const legend = svg.append("g")
        .attr("class", "legend").attr("transform", `translate(${width - 80}, ${2})`);
  
    pollutants.forEach((pollutant, i) => {
      const legendItem = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
  
      legendItem.append("circle")
        .attr("cx", 10)
        .attr("cy", 10)
        .attr("r", 5)
        .style("fill", pollutant.color);
  
      legendItem.append("text")
        .attr("x", 20)
        .attr("y", 15)
        .text(pollutant.label)
        .style("font-size", "12px");
    });
}


// ******* SCATTER PLOT ****** //
document.getElementById("pollutant_select").addEventListener("change", function () {
    const selectedPollutant = this.value;
    const selectedYear = parseInt(document.getElementById("year_select").value);
    drawScatterPlot(selectedYear, selectedPollutant);
  });


function drawScatterPlot(selectedYear, selectedPollutant) {
    // Filter data for the selected year and pollutant
    const filteredData = locations.filter(function (location) {
      const locationYear = new Date(location.Date).getFullYear();
      return locationYear === selectedYear && location[selectedPollutant] !== null;
    });

    // Map the filtered data to extract the month and the selected pollutant value
    const mappedData = filteredData.reduce(function(acc, location) {
        const date = new Date(location.Date);
        const month = date.getMonth();
        const value = location[selectedPollutant];
        
        if (acc[month]) {
            acc[month].sum += value;
            acc[month].count += 1;
        } else {
            acc[month] = {
            month: month,
            value: 0,
            sum: value,
            count: 1
            };
        }
        return acc;
    }, []).map(function (d) {
        d.value = d.sum / d.count;
        delete d.sum;
        delete d.count;
        return d;
    });

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 550 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Define the x and y scales
    const xScale = d3.scaleLinear().domain([0, 11]).range([50, 500 - margin.right]);
    const yScale = d3.scaleLinear().domain([0, d3.max(mappedData, (d) => d.value)]).range([250, 50]);
  
    // Append the scatter plot points
    d3.select("#scatter_plot svg").remove(); // acts as refresher of the visualization
  
    const svg = d3.select("#scatter_plot").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    svg
      .selectAll("circle")
      .data(mappedData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.month))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 5)
      .style("fill", "steelblue");

    // Append the x-axis
    svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).tickFormat((d) => d + 1));

    // Append the y-axis
    svg.append("g").attr("transform", "translate(50,-10)").call(d3.axisLeft(yScale));
  }