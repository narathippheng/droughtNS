var rainfall7d = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:'https://landslide.gis-cdn.net/geoserver/droughtNS/wms?',
      params: {'LAYERS': 'droughtNS:Rainday7D', 'TILED': true},
      serverType: 'geoserver',
      crossOrigin: 'anonymous',
      layers: 'rainfall7',
      transition: 0
      }),
      visible: true,
      title: 'ปริมาณน้ำฝนสะสม 7 วัน',
      opacity: 0.7
    });

var Airtem = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:'https://landslide.gis-cdn.net/geoserver/droughtNS/wms?',
      params: {'LAYERS': 'droughtNS:A_TEM', 'TILED': true},
      serverType: 'geoserver',
      crossOrigin: 'anonymous',
      layers: 'Airtem',
      transition: 0
      }),
      visible: true,
      title: 'อุณหภูมิอากาศ',
      opacity: 1
    });

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
    

var basemap1 = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: true,
    layers: 'basemap',
    title: 'แผนที่ฐาน'}
    );


// The map
const view = new ol.View({
    center: [11140170.116488684,1769043.5804528007],
    zoom: 9,
  });
  
const map = new ol.Map({
    layers: [basemap1, rainfall7d, Airtem, AP_NS],
    target: 'weather-map',
    view: view,
 });
map.addControl(new ol.control.LayerSwitcher({ collapsed: true }))



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
  margin: 10,
  maxWidth: 300
});
var legendCtrl = new ol.control.Legend({
  legend: legend,
  collapsed: false
});
map.addControl(legendCtrl);

  // New legend associated with a layer
//var layerLegend = new ol.legend.Legend({ layer: droughtNS })
//layerLegend.addItem(new ol.legend.Image({
  //title: 'พื้นที่เสี่ยงภัยแล้ง',
  //src: "https://landslide.gis-cdn.net/geoserver/droughtNS/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=droughtNS:testdata"
//}))
//legend.addItem(layerLegend)

var layerLegend = new ol.legend.Legend({ layer: rainfall7d })
layerLegend.addItem(new ol.legend.Image({
title: 'ปริมาณน้ำฝน',
src: "https://landslide.gis-cdn.net/geoserver/droughtNS/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=droughtNS:Rainday7D"
}))
legend.addItem(layerLegend);

var layerLegend = new ol.legend.Legend({ layer: Airtem })
layerLegend.addItem(new ol.legend.Image({
title: 'อุณหภูมิอากาศ',
src: "https://landslide.gis-cdn.net/geoserver/droughtNS/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=droughtNS:A_TEM"
}))
legend.addItem(layerLegend);
