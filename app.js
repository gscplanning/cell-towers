var map = L.map('map', {
  maxZoom: 19,
  minZoom: 12
}).setView([38.317236, -84.564147], 12);
  var info = L.control();
    
    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div','info');
      this.update();
      return this._div;
    };

    info.update = function (props) {
      this._div.innerHTML = (props ?
        '<h3>' + props.location + '</h3><br>' +
        '<b>Status: </b> ' + props.status2 + '<br>' +
        '<b>Owner: </b> ' + props.owner + '<br>' +
        '<b><a href="http://wireless2.fcc.gov/UlsApp/AsrSearch/asrRegistration.jsp?callingSystem=AS&amp;regKey=' + props.page + '" target="_blank">View Application</a></b><br>'
        : 'Click icon for more info'
        )
    }
    info.addTo(map);

    function clicky(e) {
      var layer = e.target;
      cellTowers.setStyle({
        color: '#fff'
      })
      layer.setStyle({
        color: 'yellow'
      })
      info.update(layer.feature.properties);
    }

    function onEachFeature(feature, layer) {
      layer.on({
        click: clicky
      })
    }

  function getColor(d) {
    return d=="C" ? '#4CAF50':
          d=="G" ? '#2196F3':
          d=="A" ? '#FFC107':
          d=="I" ? '#212121':
          d=="T" ? '#f44336':
          '#ecf0f1';
  }

  function style(feature){
    return getColor(feature.properties.status)
  }

  L.esri.tiledMapLayer({
    url: 'http://gis.gscplanning.com/arcgis/rest/services/basemaps/gscbase_streets/MapServer', 
    attribution: 'GSCPC',
    // Dealing with broken blank tiles: https://github.com/Esri/esri-leaflet/issues/759
    errorTileUrl: './errorTile256.png' 
  }).addTo(map);
  
  var cellTowers = L.esri.featureLayer({
    url: 'http://services1.arcgis.com/dpmGqj7FxlwlvK0y/arcgis/rest/services/Scott_County_Cell_Towers/FeatureServer/0',
    pointToLayer: function (geojson, latlng) {
      return L.circleMarker(latlng,{
        fillColor: style(geojson),
        fillOpacity: 1,
        color: '#fff',
        weight: 4,
        radius:10
      }
    )},
    onEachFeature: onEachFeature
  }).addTo(map);

  var tower = document.getElementById('appStatus');

  tower.addEventListener('change', function(){
    cellTowers.setWhere(tower.status);
  });
