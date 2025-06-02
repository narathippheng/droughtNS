var basemap = new ol.layer.Tile({
  source: new ol.source.OSM(),
  visible: true,
  layers: 'basemap',
  title: 'แผนที่ฐาน'});

var droughtNS = new ol.layer.Tile({
  source: new ol.source.TileWMS({
  url: 'https://landslide.gis-cdn.net/geoserver/droughtNS/wms?',
  params: {'LAYERS':'droughtNS:testdata', 'TILED': true},
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
  url: 'https://landslide.gis-cdn.net/geoserver/droughtNS/wms?',
  params: {'LAYERS':'droughtNS:Daily_Drought', 'TILED': true},
  serverType: 'geoserver',
  layers: 'drought_ns',
  transition: 0
  }),
  visible: true,
  title: 'พื้นที่เสี่ยงภัยแล้งวันนี้',
  opacity: 0.7
});

var FloodNS = new ol.layer.Tile({
  source: new ol.source.TileWMS({
  url: 'https://landslide.gis-cdn.net/geoserver/droughtNS/wms?',
  params: {'LAYERS':'droughtNS:sum_floodNS', 'TILED': true},
  serverType: 'geoserver',
  layers: 'flood_ns',
  transition: 0
  }),
  visible: false,
  title: 'พื้นที่เสี่ยงน้ำท่วม',
  opacity: 0.7
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

var TB_NS = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'https://landslide.gis-cdn.net/geoserver/droughtNS/wms?',
      params: {'LAYERS': 'droughtNS:TB_NS', 'TILED': true},
      serverType: 'geoserver',
      transition: 0,
      layers: 'TB_NS',
      }),
      visible: false,
      zIndex: 1,
      opacity: 1,
      title: 'ขอบเขตตำบล'
      });

// The map
var map = new ol.Map ({
  target: 'js-map',
  view: new ol.View ({
    zoom: 9,
    center: [11140170.116488684,1769043.5804528007]
  }),
  layers: [basemap,droughtNS,D_droughtNS,FloodNS,AP_NS,TB_NS]
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
  src: "https://landslide.gis-cdn.net/geoserver/droughtNS/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=droughtNS:testdata"
}))
legend.addItem(layerLegend)

  // New legend associated with a layer
var layerLegend = new ol.legend.Legend({ layer: D_droughtNS })
layerLegend.addItem(new ol.legend.Image({
  title: 'ภัยแล้งวันนี้',
  src: "https://landslide.gis-cdn.net/geoserver/droughtNS/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=droughtNS:Daily_Drought"
}))
legend.addItem(layerLegend)
