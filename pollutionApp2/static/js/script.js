document.getElementById('year_select').addEventListener('change', function() {
    var selectedCity = document.getElementById('city_select').value;
    var selectedYear = parseInt(this.value);
    drawLineChart(selectedCity, selectedYear);
    drawGeoChart(selectedYear); // Add this line to update the map markers
});

// event listeners for drop down menus of the line chart
document.getElementById('city_select').addEventListener('change', function() {
    var selectedCity = this.value;
    var selectedYear = parseInt(document.getElementById('year_select').value);
    drawLineChart(selectedCity, selectedYear);
});


// helper method that will compute the monthly averages for the selections
function calculateMonthlyAverages(filteredLocations) {
    // var monthlyAverages = [];

    // for (var month = 1; month <= 12; month++) {
    //     var monthData = filteredLocations.filter(function(location) {
    //         return new Date(location.Date).getMonth() + 1 === month;
    //     });

    //     var monthlyTotal = {
    //         pm25: 0,
    //         count: monthData.length
    //     };

    //     monthData.forEach(function(location) {
            
    //         monthlyTotal.pm25 += location.pm25_median ? location.pm25_median : 0;
    //     });

    //     // makes sure that if monthlyAverages has NaN in pm25 we replace that with 0 (happened when using a small dataset)
    //     var averagePm25 = monthlyTotal.pm25 / monthlyTotal.count;
    //     averagePm25 = isNaN(averagePm25) ? 0 : averagePm25;

    //     monthlyAverages.push({
    //         month: month,
    //         pm25: averagePm25
    //     });
    // }
    // return monthlyAverages;


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

// Calling the drawMap function
drawMap();

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

function drawLegend() {
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

// Calling the drawLegend function
drawLegend();

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

  // Create a line generator
//   const line = d3
//     .line()
//     .x((d) => xScale(d.month))
//     .y((d) => yScale(d.pm25));

  // Draw the line
//   svg.append("path")
//     .datum(monthlyAverages)
//     .attr("class", "line")
//     .attr("d", line)
//     .attr("fill", "none")
//     .attr("stroke", "steelblue")
//     .attr("stroke-width", 1.5);

  // Legend
//   const legend = svg.append("g")
//         .attr("transform", `translate(${width - 150}, ${20})`); // moving values in translate can help adjust the position of the legend

//     legend.append("circle")
//         .attr("cx", 10)
//         .attr("cy", 10)
//         .attr("r", 5)
//         .style("fill", "steelblue");

//     legend.append("text")
//         .attr("x", 20)
//         .attr("y", 15)
//         .text("PM2.5")
//         .style("font-size", "12px");

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