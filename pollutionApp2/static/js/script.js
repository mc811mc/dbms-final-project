/****** EVENT LISTENERS FOR CONTROL PANEL *******/
document.getElementById('year_select').addEventListener('change', function() {
    var selectedCity = document.getElementById('city_select').value;
    var selectedYear = parseInt(this.value);
    drawLineChart(selectedCity, selectedYear);
    drawGeoChart(selectedYear); // Add this line to update the map markers
    drawStackedBarChart(selectedYear);
});

// event listeners for drop down menus of the line chart
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
        {label: "Good (0-12)", color: "green"},
        {label: "Moderate (12.1-35.4)", color: "yellow"},
        {label: "Unhealthy for Sensitive Groups (35.5-55.4)", color: "orange"},
        {label: "Unhealthy (55.5-150.4)", color: "red"},
        {label: "Very Unhealthy (150.5-250.4)", color: "purple"},
        {label: "Hazardous (250.5+)", color: "maroon"}
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

// helper for color scheme on map
function pm25ColorScale(value) {
    if (value <= 12) {
        return "green";
    } else if (value <= 35.4) {
        return "yellow";
    } else if (value <= 55.4) {
        return "orange";
    } else if (value <= 150.4) {
        return "red";
    } else if (value <= 250.4) {
        return "purple";
    } else {
        return "maroon";
    }
}

function drawGeoChart(selectedYear) {
    const width = 960,
        height = 600;

    const projection = d3.geoAlbersUsa().scale(1280).translate([width / 2, height / 2]);

    const svg = d3.select("#map");
    svg.selectAll(".marker").remove();

    const filteredLocations = locations.filter(function (location) {
        var locationYear = new Date(location.Date).getFullYear();
        return locationYear === selectedYear;
    });

    svg.append("g")
        .selectAll(".marker")
        .data(filteredLocations)
        .join("circle")
        .attr("class", "marker")
        .attr("cx", (d) => projection([d.longitude, d.latitude])[0])
        .attr("cy", (d) => projection([d.longitude, d.latitude])[1])
        .attr("r", 3) // Adjust the marker size
        .attr("fill", (d) => pm25ColorScale(d.pm25_median)); // Adjust the marker color based on the pm2.5 logic defined
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
  const width = 800 - margin.left - margin.right;
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

  svg
    .append("g")
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
            .attr("transform", `translate(${width - 150}, ${20 + 20 * index})`);

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

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 800 - margin.left - margin.right;
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
      .padding(0.1);
  
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
        .attr("class", "legend").attr("transform", `translate(${width - 120}, ${10})`);
  
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