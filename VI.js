var basemap = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: true,
    layers: 'basemap',
    title: 'แผนที่ฐาน'});
  
  var NDWI = new ol.layer.Tile({
    source: new ol.source.TileWMS({
    url: 'https://landslide.gis-cdn.net/geoserver/droughtNS/wms?',
    params: {'LAYERS':'droughtNS:NDWI', 'TILED': true},
    serverType: 'geoserver',
    layers: 'NDWI',
    transition: 0
    }),
    visible: true,
    title: 'ดัชนี NDWI',
    opacity: 1
  });

var NDVI = new ol.layer.Tile({
    source: new ol.source.TileWMS({
    url: 'https://landslide.gis-cdn.net/geoserver/droughtNS/wms?',
    params: {'LAYERS':'droughtNS:NDVI', 'TILED': true},
    serverType: 'geoserver',
    layers: 'NDVI',
    transition: 0
    }),
    visible: true,
    title: 'ดัชนี NDVI',
    opacity: 1
  }); 
  
  //
  
  var AP_NS = new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: 'https://landslide.gis-cdn.net/geoserver/droughtNS/wms?',
        params: {'LAYERS': 'droughtNS:AP_NS', 'TILED': true},
        serverType: 'geoserver',
        transition: 0,
        layers: 'AP_NS',
        }),
        visible: true,
        zIndex: 1,
        opacity: 1,
        title: 'ขอบเขตอำเภอ'
      });
  
  // The map
  var map = new ol.Map ({
    target: 'VI-map',
    view: new ol.View ({
      zoom: 9,
      center: [11140170.116488684,1769043.5804528007]
    }),
    layers: [basemap,NDWI,NDVI,AP_NS,]
  });
  
  map.addControl(new ol.control.LayerSwitcher({ collapsed: false }))
  
  
  
  const source = new ol.source.Vector();
    const layer = new ol.layer.Vector({
      source: source,
      title: 'ตำแหน่งของฉัน'
    });
  map.addLayer(layer)
  
  navigator.geolocation.watchPosition(
    function (pos) {
      const coords = [pos.coords.longitude, pos.coords.latitude];
      const accuracy = ol.geom.Polygon.circular (coords, pos.coords.accuracy);
      source.clear(true);
      source.addFeatures([
        new ol.Feature(
          accuracy.transform('EPSG:4326', map.getView().getProjection())
          ),
          new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat(coords))),
        ]);
      },
      function (error) {
        alert(`ERROR: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
      });
  
  const locate = document.createElement('div');
  locate.className = 'ol-control ol-unselectable locate';
  locate.innerHTML = '<button title="Locate me">◎</button>';
  locate.addEventListener('click', function() {
    if (!source.isEmpty()) {
      map.getView().fit(source.getExtent(), {
        maxZoom: 12,
        duration: 1000
       });}
      });
  map.addControl(new ol.control.Control({element: locate}));
  
  // Define a new legend
  var legend = new ol.legend.Legend({ 
    title: 'สัญลักษณ์แผนที่',
    margin: 10,
    maxWidth: 300
  });
  var legendCtrl = new ol.control.Legend({
    legend: legend,
    collapsed: false
  });
  map.addControl(legendCtrl);
  
    // New legend associated with a layer
  var layerLegend = new ol.legend.Legend({ layer: NDWI })
  layerLegend.addItem(new ol.legend.Image({
    title: 'ดัชนีความชื้น NDWI',
    src: "https://landslide.gis-cdn.net/geoserver/droughtNS/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=droughtNS:NDWI"
  }))
  legend.addItem(layerLegend)

  var layerLegend = new ol.legend.Legend({ layer: NDVI })
  layerLegend.addItem(new ol.legend.Image({
    title: 'ดัชนีความชื้น NDVI',
    src: "https://landslide.gis-cdn.net/geoserver/droughtNS/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=droughtNS:NDVI"
  }))
  legend.addItem(layerLegend)