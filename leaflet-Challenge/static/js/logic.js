//Set URL
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url).then(function(data){
    console.log (data.features)
    createMarkers(data.features)
});

//Create Markers for earthquakes
function createMarkers (earthquakeData) {
    
    let earthquakeMarkers = L.geoJson(earthquakeData, {
        pointToLayer: function (feature,latlng) {
            return L.circleMarker(latlng,{
                radius: chooseRadius(feature),
                color:"white",
                fillColor: chooseColor(feature),
                fillOpacity: 0.5,
                weight: 1
            })
        },
        onEachFeature: function(feature,layer) {
            layer.bindPopup(`<h1>Earthquake Info</h1><p>Time: ${new Date(feature.properties.time)}</p>
            <p>Magnitude: ${feature.properties.mag}</p>
            <p>Depth : ${feature.geometry.coordinates[2]}</p>
            <p>Location: ${feature.properties.place}</p>
            <p>Details: <a href=${feature.properties.url}>Click Here</a></p>`
            )
        }
    });

    buildMap(earthquakeMarkers)
};

//Choose size of earthquake markers based on magnitude
function chooseRadius (earthquake) {
    if (earthquake.properties.mag >= 8)
        return 20
    else if (earthquake.properties.mag >=6)
        return 15
    else if (earthquake.properties.mag >=4)
        return 10
    else if (earthquake.properties.mag >= 2)
        return 5
    else
        return 2.5
};

//Choose color of earthquake markers based on depth
function chooseColor (earthquake) {
    if (earthquake.geometry.coordinates[2] >= 100)
        return "red"
    else if (earthquake.geometry.coordinates[2] >= 75)
        return "orange"
    else if (earthquake.geometry.coordinates[2] >= 50)
        return "yellow"
    else
        return "green"
};

//Create Map for earthquakes
function buildMap(earthquakeMarkers) {
    
    //Set tile layer variables
    let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});

    let topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        });

    //Set base maps variable
    let baseMaps = {
        "Street Map": streetMap,
        "Topographical Map": topoMap
    };

    //Set overlay maps variable
    let overlayMaps = {
        "Earthquakes" : earthquakeMarkers
    };

    //Set map at default view around KCK
    let myMap = L.map("map", {
        center: [39.106667,-94.676392],
        zoom: 5,
        layers: [streetMap,earthquakeMarkers]
    });

    //Set Control Layer
    L.control.layers(baseMaps,overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    //Set Legend
    L.control.Legend({
        position: "bottomright",
        collapsed: false,
        legends: [{
            label: "Depth Over 100",
            type: "circle",
            color: "white",
            fillColor: "red"},
            {label: "Depth Between 50 and 75",
            type: "circle",
            color: "white",
            fillColor: "orange"},
            {label: "Depth Between 50 and 75",
            type: "circle",
            color: "white",
            fillColor: "yellow"},
            {label: "Depth Below 50",
            type: "circle",
            color: "white",
            fillColor: "green"
        }]
    }).addTo(myMap);
}