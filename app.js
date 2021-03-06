var map = L.map('map', {
    maxZoom: 19,
    minZoom: 11
}).setView([38.317236, -84.564147], 12);

var info = L.control();

info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function(props) {
    this._div.innerHTML = (props ?
        '<div id="info-title"><h3>' + props.location + '</h3></div>' +
        '<div id="info-content"><b>Status: </b> ' + props.status2 + '<br>' +
        '<b>Owner: </b> ' + props.owner + '<br>' +
        '<b>Height: </b>' + props.height_agl + '&#39;<br>' +
        '<b><a href="http://wireless2.fcc.gov/UlsApp/AsrSearch/asrRegistration.jsp?callingSystem=AS&amp;regKey=' + props.page + '" target="_blank">View Application</a></b></div>' :
        '<div id="info-prompt">Click icon for more info</div>'
    );
};
info.addTo(map);

function clicky(e) {
    var layer = e.target;
    cellTowers.setStyle({
        color: '#fff'
    });
    layer.setStyle({
        color: 'yellow'
    });
    info.update(layer.feature.properties);
}

function onEachFeature(feature, layer) {
    layer.on({
        click: clicky
    });
}

function getColor(d) {
    return d == "C" ? '#4CAF50' :
        d == "G" ? '#2196F3' :
        d == "A" ? '#FFC107' :
        d == "I" ? '#212121' :
        d == "T" ? '#f44336' :
        '#ecf0f1';
}

function style(feature) {
    return getColor(feature.properties.status);
}

L.esri.tiledMapLayer({
    url: 'http://gis.gscplanning.com/arcgis/rest/services/basemaps/gscbase_streets/MapServer',
    attribution: "<a href='http://gis.gscplanning.com/arcgis/rest/' target='_blank'>GSCPC GIS</a>",
    // Dealing with broken blank tiles: https://github.com/Esri/esri-leaflet/issues/759
    errorTileUrl: './errorTile256.png'
}).addTo(map);

var cellTowers = L.esri.Cluster.clusteredFeatureLayer({
    url: 'https://services1.arcgis.com/dpmGqj7FxlwlvK0y/arcgis/rest/services/Scott_County_Cell_Towers/FeatureServer/0',
    pointToLayer: function(geojson, latlng) {
        return L.circleMarker(latlng, {
            fillColor: style(geojson),
            fillOpacity: 1,
            color: '#fff',
            weight: 4,
            radius: 10
        });
    },
    attribution: "<a href='http://wireless2.fcc.gov/UlsApp/AsrSearch/asrRegistrationSearch.jsp' target='_blank'>FCC</a>",
    onEachFeature: onEachFeature
}).addTo(map);

cellTowers.query().bounds(function (error, latlngbounds) {
    map.fitBounds(latlngbounds);
});

var tower = document.getElementById('app-status');

tower.addEventListener('change', function() {
    cellTowers.setWhere(tower.value);
});
