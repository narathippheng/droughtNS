var basemap = new ol.layer.Tile({
  source: new ol.source.OSM(),
  visible: true,
  layers: 'basemap',
  title: 'แผนที่ฐาน'});

var droughtNS = new ol.layer.Tile({
  source: new ol.source.TileWMS({
  url: 'https://droughtnsru.com/geoserver/nsru_drought/wms?',
  params: {'LAYERS':'nsru_drought:Drought', 'TILED': true,'FORMAT': 'image/png8'},
  serverType: 'geoserver',
  layers: 'drought_ns',
  transition: 0
  }),
  visible: false,
  title: 'พื้นที่เสี่ยงภัยแล้ง',
  opacity: 0.7
});

var D_droughtNS = new ol.layer.Tile({
  source: new ol.source.TileWMS({
  url: 'https://droughtnsru.com/geoserver/nsru_drought/wms?',
  params: {'LAYERS':'nsru_drought:Daily_Drought', 'TILED': true,'FORMAT': 'image/png8'},
  serverType: 'geoserver',
  layers: 'drought_ns',
  transition: 0
  }),
  visible: true,
  title: 'พื้นที่เสี่ยงภัยแล้งวันนี้',
  opacity: 0.7
});


var AP_NS = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: 'https://droughtnsru.com/geoserver/nsru_drought/wms?',
    params: {
      'LAYERS': 'nsru_drought:AP_NS',
      'TILED': true
    },
    serverType: 'geoserver',
    transition: 0
  }),
  visible: true,
  zIndex: 1,
  opacity: 1,
  title: 'ขอบเขตอำเภอ'
});


// The map
var map = new ol.Map ({
  target: 'js-map',
  view: new ol.View ({
    zoom: 9,
    center: [11140170.116488684,1769043.5804528007]
  }),
  layers: [basemap,droughtNS,D_droughtNS,AP_NS]
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
var layerLegend = new ol.legend.Legend({ layer: droughtNS })
layerLegend.addItem(new ol.legend.Image({
  title: 'ภาพรวมภัยแล้งตลอดปี',
  src: "https://droughtnsru.com/geoserver/nsru_drought/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=nsru_drought:Drought"
}))
legend.addItem(layerLegend)

  // New legend associated with a layer
var layerLegend = new ol.legend.Legend({ layer: D_droughtNS })
layerLegend.addItem(new ol.legend.Image({
  title: 'ภัยแล้งวันนี้',
  src: "https://droughtnsru.com/geoserver/nsru_drought/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=nsru_drought:Daily_Drought"
}))
legend.addItem(layerLegend)