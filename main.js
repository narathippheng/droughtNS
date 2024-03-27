const map = new ol.Map({
  view: new ol.View({
    center: [11140170.116488684,1769043.5804528007],
    zoom: 9,
    maxZoom: 20,
    minZoom: 3
  }),

//กำหนดชั้นข้อมูลแผนที่ที่ต้องการนำมาแสดงเป็นแผนที่ฐานโดยกำหนดให้ทำการแสดงผลโดยปริยาย
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
      visible: true,
      title: 'แผนที่ฐาน'
    }),
    new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: 'https://landslide.gis-cdn.net/geoserver/droughtNS/wms?',
        params: {'LAYERS':'droughtNS:testdata', 'TILED': true},
        serverType: 'geoserver',
        transition: 0
        }),
        visible: true,
        title: 'พื้นที่เสี่ยงภัยแล้ง',
        opacity: 0.7
    }),
    new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url:'https://landslide.gis-cdn.net/geoserver/droughtNS/wms?',
        params: {'LAYERS': 'droughtNS:Rainday7D', 'TILED': true},
        serverType: 'geoserver',
        transition: 0
        }),
        visible: false,
        title: 'ปริมาณน้ำฝนสะสม 7 วัน',
        opacity: 0.6
    }),
    
    new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: 'https://landslide.gis-cdn.net/geoserver/droughtNS/wms?',
        params: {'LAYERS': 'droughtNS:AP_NS', 'TILED': true},
        serverType: 'geoserver',
        transition: 0,
        }),
        visible: true,
        zIndex: 1,
        opacity: 1,
        title: 'ขอบเขตอำเภอ'
    })
  ],
//จุดมุ่งหมายคือเชื่อมโยงกับjs-mapในไฟล์index.html
  target: 'js-map'
})

const scaleLineControl = new ol.control.ScaleLine({
  units: 'metric',
  minWidth: 100,
  bar: true,
  text: true,
})
map.addControl(scaleLineControl)

const source = new ol.source.Vector();
  const layer = new ol.layer.Vector({
    source: source,
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
      maxZoom: 18,
      duration: 500
     });}
    });
map.addControl(new ol.control.Control({element: locate}));

var layerSwitcher = new ol.control.LayerSwitcher({
  activationMode: 'click',
  starActive: false,
  groupSelectStyle: 'group'
});
map.addControl(layerSwitcher)