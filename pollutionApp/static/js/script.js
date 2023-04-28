var selectedRange = null; // keeps track of range selected in pm2.5
var minPM25 = -Infinity; // keeps track of min PM2.5 selected
var maxPM25 = Infinity; // keeps track of max PM 2.5 selected

// Initializing Google Maps visualization
var markerCluster;
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: new google.maps.LatLng(locations[0].latitude, locations[0].longitude)
    });

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
            pm25_median: location.pm25_median // will be used at marker clustering
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
        calculator: function(markers, numStyles) {
            var pm25Sum = 0;
            for (var i = 0; i < markers.length; i++) {
                pm25Sum += markers[i].pm25_median;
            }
            var pm25Avg = pm25Sum / markers.length;
            var index = Math.min(
                Math.floor((pm25Avg - 0) / (250.5 - 0) * numStyles),
                numStyles - 1
            );
            var iconUrl = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' + (index + 1) + '.png';
            return {
                text: markers.length,
                index: index,
                title: markers.length + ' markers with average PM2.5 value of ' + pm25Avg,
                icon: {
                    url: iconUrl
                }
            };
        }
    });

    // Event listener for the marker cluster click event
    google.maps.event.addListener(markerCluster, 'click', function(cluster) {
        var markers = cluster.getMarkers();
    
        var infoWindowContent = '<div>';
        var color = null;
        var pm25_sum = 0;
        var count = markers.length;
    
        markers.forEach(function(marker) {
            color = getColorByPM25(marker.pm25_median);
            infoWindowContent += '<div style="display: flex; align-items: center;">';
            infoWindowContent += '<div style="width: 20px; height: 20px; margin-right: 5px; background-color: ' + color + ';"></div>';
            infoWindowContent += '<p>' + marker.pm25_median + '</p>';
            infoWindowContent += '</div>';
            pm25_sum += marker.pm25_median;
        });
    
        var pm25_avg = (pm25_sum / count).toFixed(2);
        infoWindowContent += '<p>PM2.5 Average: ' + pm25_avg + '</p>';
        infoWindowContent += '<p>Count: ' + count + '</p>';
        infoWindowContent += '</div>';
    
        var infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent
        });
    
        infoWindow.setPosition(cluster.getCenter());
        infoWindow.open(map);
    });

    // Event listener for the change event on the dropdown menu
    document.getElementById('pm25-range-filter').addEventListener('change', function() {
            var selectedOption = this.value;
            var selectedYear = parseInt(document.getElementById('year_select').value);
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
            filterMarkers(minPM25, maxPM25, markerCluster, selectedYear);
    });
}

// Helper method to retrieve color classification based on pm25
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

// Marker filter
function filterMarkers(minPM25, maxPM25, markerCluster, year) {
    var markers = markerCluster.getMarkers();

    if (selectedRange && selectedRange[0] === minPM25 && selectedRange[1] === maxPM25) {
        selectedRange = null;
        selectedYear = null
        setAllMarkersVisible(true, markers);
    } else {
        if (selectedRange)
            setAllMarkersVisible(true, markers);

        selectedRange = [minPM25, maxPM25];
        selectedYear = year;
        for (var i = 0; i < markers.length; i++) {
            var markerPM25 = parseFloat(markers[i].pm25_median);
            var markerYear = new Date(markers[i].Date).getFullYear() + 1;
            if (markerPM25 >= minPM25 && markerPM25 <= maxPM25 && markerYear === year) {
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

document.getElementById('year_select').addEventListener('change', function() {
    var selectedCity = document.getElementById('city_select').value;
    var selectedYear = parseInt(this.value);
    drawChart(selectedCity, selectedYear);
    filterMarkers(minPM25, maxPM25, markerCluster, selectedYear);
});

// event listeners for drop down menus of the line chart
document.getElementById('city_select').addEventListener('change', function() {
    var selectedCity = this.value;
    var selectedYear = parseInt(document.getElementById('year_select').value);
    drawChart(selectedCity, selectedYear);
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
        var locationYear = new Date(location.Date).getFullYear() + 1;
        return locationYear === year;
    });

    // If filteredLocations is empty, display a message and return
    if (filteredLocations.length === 0) {
        var chartDiv = document.getElementById('line_chart');
        chartDiv.innerHTML = "<p>No data available for the selected city and year.</p>";
        return;
    }

    // get the monthly pollutant average levels for the locations of the selected city
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