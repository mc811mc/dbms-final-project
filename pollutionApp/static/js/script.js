var selectedRange = null; // this will keep track of the currently selected legend item
// var locations;
function initMap() {
    //locations = JSON.parse('{{ locations|tojson|safe }}');
    // var attribute_names = JSON.parse('{{ attribute_names|tojson|safe }}');
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: new google.maps.LatLng(locations[0].latitude, locations[0].longitude)
    });
    var markerCluster;

    // Adding the legend
    var legend = document.getElementById('legend');
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(legend);

    var markers = [];

    // Encoding data points into markers and tooltip boxes
    locations.forEach(function(location) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(location.latitude, location.longitude),
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE, // here is where we set the marker in shape of circel
                scale: 9,
                fillColor: getColorByPM25(location.pm25_median),
                fillOpacity: 1.0,
                strokeWeight: 0.8
            },
            pm25_median: location.pm25_median
        });

        markers.push(marker)

        var infoWindowContent = '<div>';
        attribute_names.forEach(function(name) {
            infoWindowContent += '<p>' + name + ': ' + location[name] + '</p>';
        });
        infoWindowContent += '</div>';

        var infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent
        });

        marker.addListener('mouseover', function() {
            infoWindow.open(map, marker);
        });

        marker.addListener('mouseout', function() {
            infoWindow.close();
        });
    });

    // initializing the marker Cluster
    markerCluster = new MarkerClusterer(map, markers, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    });

    // Event listener for the change event on the dropdown menu
    document.getElementById('pm25-range-filter').addEventListener('change', function() {
            var selectedOption = this.value;
            var minPM25, maxPM25;
            switch (selectedOption) {
                case 'good':
                    minPM25 = 0;
                    maxPM25 = 12;
                    break;
                case 'moderate':
                    minPM25 = 12.1;
                    maxPM25 = 35.4;
                    break;
                case 'sensitive':
                    minPM25 = 35.5;
                    maxPM25 = 55.4;
                    break;
                case 'unhealthy':
                    minPM25 = 55.5;
                    maxPM25 = 150.4;
                    break;
                case 'very-unhealthy':
                    minPM25 = 150.5;
                    maxPM25 = 250.4;
                    break;
                case 'hazardous':
                    minPM25 = 250.5;
                    maxPM25 = Infinity;
                    break;
                default: // 'all'
                    minPM25 = -Infinity;
                    maxPM25 = Infinity;
            }
            filterMarkers(minPM25, maxPM25, markerCluster);
        });
}

// Color scheme getter for pm2.5 values
function getColorByPM25(pm25) {
    if (pm25 <= 12) {
        return '#00E400'; // Good (Green)
    } else if (pm25 <= 35.4) {
        return '#FFFF00'; // Moderate (Yellow)
    } else if (pm25 <= 55.4) {
        return '#FF7E00'; // Unhealthy for Sensitive Groups (Orange)
    } else if (pm25 <= 150.4) {
        return '#FF0000'; // Unhealthy (Red)
    } else if (pm25 <= 250.4) {
        return '#8F3F97'; // Very Unhealthy (Purple)
    } else {
        return '#7E0023'; // Hazardous (Maroon)
    }
}

function setAllMarkersVisible(visible, markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setVisible(visible);
    }
}

// Marker filter
function filterMarkers(minPM25, maxPM25, markerCluster) {
    var markers = markerCluster.getMarkers();

    if (selectedRange && selectedRange[0] === minPM25 && selectedRange[1] === maxPM25) {
        selectedRange = null;
        setAllMarkersVisible(true, markers);
    } else {
        if (selectedRange)
            setAllMarkersVisible(true, markers);

        selectedRange = [minPM25, maxPM25];
        for (var i = 0; i < markers.length; i++) {
            var markerPM25 = parseFloat(markers[i].pm25_median);
            if (markerPM25 >= minPM25 && markerPM25 <= maxPM25) {
                markers[i].setVisible(true);
            } else {
                markers[i].setVisible(false);
            }
        }
    }
    markerCluster.repaint(); // Refresh the clusters after filtering
}

// Google Charts functions
google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(function() {
    // setting an initial default set of values
    drawChart('All', new Date().getFullYear());
});

// event listeners for drop down menus of the line chart the outer function makes sure that the event listeners are attached only after the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', function() {
    // event listeners for drop down menus of the line chart
    document.getElementById('city_select').addEventListener('change', function() {
        var selectedCity = this.value;
        var selectedYear = parseInt(document.getElementById('year_select').value);
        drawChart(selectedCity, selectedYear);
    });

    document.getElementById('year_select').addEventListener('change', function() {
        var selectedCity = document.getElementById('city_select').value;
        var selectedYear = parseInt(this.value);
        drawChart(selectedCity, selectedYear);
    });
});

// helper method that will compute the monthly averages for the selections
function calculateMonthlyAverages(filteredLocations) {
    var monthlyAverages = [];

    for (var month = 1; month <= 12; month++) {
        var monthData = filteredLocations.filter(function(location) {
            return new Date(location.Date).getMonth() + 1 === month;
        });

        var monthlyTotal = {
            pm25: 0,
            o3: 0,
            no2: 0,
            co: 0,
            so2: 0,
            count: monthData.length
        };

        monthData.forEach(function(location) {
            monthlyTotal.pm25 += location.pm25_median || 0;
            monthlyTotal.o3 += location.o3_median || 0;
            monthlyTotal.no2 += location.no2_median || 0;
            monthlyTotal.co += location.co_median || 0;
            monthlyTotal.so2 += location.so2_median || 0;
        });

        monthlyAverages.push([
            month,
            monthlyTotal.pm25 / monthlyTotal.count,
            monthlyTotal.o3 / monthlyTotal.count,
            monthlyTotal.no2 / monthlyTotal.count,
            monthlyTotal.co / monthlyTotal.count,
            monthlyTotal.so2 / monthlyTotal.count,
        ]);
    }
    return monthlyAverages;
}

function drawChart(city, year) {

    // filtering based on selection
    var filteredLocations = locations;
    if (city !== 'All') {
        filteredLocations = filteredLocations.filter(function(location) {
            return location.City === city;
        });
    }

    filteredLocations = filteredLocations.filter(function(location) {
        var locationYear = new Date(location.Date).getFullYear();
        return locationYear === year;
    });

    // If filteredLocations is empty, display a message and return
    if (filteredLocations.length === 0) {
        var chartDiv = document.getElementById('line_chart');
        chartDiv.innerHTML = "<p>No data available for the selected city and year.</p>";
        return;
    }

    // get the monthly pollutant average levels for the locations
    var monthlyAverages = calculateMonthlyAverages(filteredLocations);

    var data = google.visualization.arrayToDataTable([
        ['Month', 'PM2.5', 'O3', 'NO2', 'CO', 'SO2'],
        ...monthlyAverages
    ]);

    var options = {
        title: 'Pollutant Levels by Month',
        curveType: 'function',
        legend: {position: 'bottom'}
    };

    var chart = new google.visualization.LineChart(document.getElementById('line_chart'));
    chart.draw(data, options);
}