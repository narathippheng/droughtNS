// =========================
// Base map
// =========================
var basemap = new ol.layer.Tile({
  source: new ol.source.OSM(),
  visible: true,
  layers: 'basemap',
  title: 'แผนที่ฐาน'
});

// =========================
// NDWI layer
// =========================
var NDWI = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: 'https://droughtnsru.com/geoserver/nsru_drought/wms?',
    params: {
      'LAYERS': 'nsru_drought:NDWI',
      'TILED': true,
      'FORMAT': 'image/png8'
    },
    serverType: 'geoserver',
    transition: 0
  }),
  visible: false,
  title: 'ดัชนี NDWI',
  opacity: 1
});

// =========================
// NDVI layer
// =========================
var NDVI = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: 'https://droughtnsru.com/geoserver/nsru_drought/wms?',
    params: {
      'LAYERS': 'nsru_drought:NDVI',
      'TILED': true,
      'FORMAT': 'image/png8'
    },
    serverType: 'geoserver',
    transition: 0
  }),
  visible: true,
  title: 'ดัชนี NDVI',
  opacity: 1
});

// =========================
// District boundary
// =========================
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

// =========================
// Map
// =========================
var map = new ol.Map({
  target: 'VI-map',
  view: new ol.View({
    zoom: 9,
    center: [11140170.116488684, 1769043.5804528007]
  }),
  layers: [basemap, NDWI, NDVI, AP_NS]
});

// =========================
// Layer Switcher
// =========================
map.addControl(new ol.control.LayerSwitcher({
  collapsed: false
}));

// =========================
// User location layer
// =========================
const source = new ol.source.Vector();

const layer = new ol.layer.Vector({
  source: source,
  title: 'ตำแหน่งของฉัน'
});

map.addLayer(layer);

// =========================
// Geolocation
// =========================
navigator.geolocation.watchPosition(
  function (pos) {
    const coords = [pos.coords.longitude, pos.coords.latitude];
    const accuracy = ol.geom.Polygon.circular(coords, pos.coords.accuracy);

    source.clear(true);
    source.addFeatures([
      new ol.Feature(
        accuracy.transform('EPSG:4326', map.getView().getProjection())
      ),
      new ol.Feature(
        new ol.geom.Point(ol.proj.fromLonLat(coords))
      )
    ]);
  },
  function (error) {
    alert('ERROR: ' + error.message);
  },
  {
    enableHighAccuracy: true
  }
);

// =========================
// Locate button
// =========================
const locate = document.createElement('div');
locate.className = 'ol-control ol-unselectable locate';
locate.innerHTML = '<button title="Locate me">◎</button>';

locate.addEventListener('click', function () {
  if (!source.isEmpty()) {
    map.getView().fit(source.getExtent(), {
      maxZoom: 12,
      duration: 1000
    });
  }
});

map.addControl(new ol.control.Control({
  element: locate
}));

// =========================
// Legend
// =========================
var legend = new ol.legend.Legend({
  margin: 10,
  maxWidth: 300
});

var legendCtrl = new ol.control.Legend({
  legend: legend,
  collapsed: false
});

map.addControl(legendCtrl);

// Legend NDWI
var layerLegendNDWI = new ol.legend.Legend({ layer: NDWI });
layerLegendNDWI.addItem(new ol.legend.Image({
  title: 'ดัชนีความชื้น NDWI',
  src: 'https://droughtnsru.com/geoserver/nsru_drought/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=nsru_drought:NDWI'
}));
legend.addItem(layerLegendNDWI);

// Legend NDVI
var layerLegendNDVI = new ol.legend.Legend({ layer: NDVI });
layerLegendNDVI.addItem(new ol.legend.Image({
  title: 'ดัชนีพืชพรรณ NDVI',
  src: 'https://droughtnsru.com/geoserver/nsru_drought/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=nsru_drought:NDVI'
}));
legend.addItem(layerLegendNDVI);

// =========================
// Popup element
// =========================
var popupContainer = document.createElement('div');
popupContainer.id = 'popup';
popupContainer.className = 'ol-popup';
popupContainer.style.position = 'absolute';
popupContainer.style.backgroundColor = 'white';
popupContainer.style.padding = '10px';
popupContainer.style.border = '1px solid #cccccc';
popupContainer.style.borderRadius = '8px';
popupContainer.style.minWidth = '220px';
popupContainer.style.boxShadow = '0 1px 4px rgba(0,0,0,0.2)';

var popupCloser = document.createElement('a');
popupCloser.href = '#';
popupCloser.innerHTML = '✖';
popupCloser.style.position = 'absolute';
popupCloser.style.top = '5px';
popupCloser.style.right = '8px';
popupCloser.style.textDecoration = 'none';
popupCloser.style.color = '#333';

var popupContent = document.createElement('div');
popupContent.id = 'popup-content';
popupContent.style.marginTop = '20px';

popupContainer.appendChild(popupCloser);
popupContainer.appendChild(popupContent);
document.body.appendChild(popupContainer);

var overlay = new ol.Overlay({
  element: popupContainer,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
});

map.addOverlay(overlay);

popupCloser.onclick = function () {
  overlay.setPosition(undefined);
  popupCloser.blur();
  return false;
};

// =========================
// Function for reading raster value from GetFeatureInfo
// =========================
function fetchLayerValue(layerObj, layerNameThai, coordinate, viewResolution, projection) {
  return new Promise(function (resolve) {
    var url = layerObj.getSource().getFeatureInfoUrl(
      coordinate,
      viewResolution,
      projection,
      {
        'INFO_FORMAT': 'application/json',
        'QUERY_LAYERS': layerObj.getSource().getParams().LAYERS,
        'FEATURE_COUNT': 1
      }
    );

    if (!url) {
      resolve('<div>' + layerNameThai + ': ไม่พบ URL</div>');
      return;
    }

    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.features && data.features.length > 0) {
          var props = data.features[0].properties;
          var value = null;

          if (props.GRAY_INDEX !== undefined) {
            value = props.GRAY_INDEX;
          } else if (props.value !== undefined) {
            value = props.value;
          } else if (props.band_1 !== undefined) {
            value = props.band_1;
          } else if (props.Band_1 !== undefined) {
            value = props.Band_1;
          } else {
            var keys = Object.keys(props);
            if (keys.length > 0) {
              value = props[keys[0]];
            }
          }

          if (value === null || value === undefined || value === '') {
            resolve('<div>' + layerNameThai + ': ไม่มีข้อมูล</div>');
          } else {
            var num = parseFloat(value);
            if (!isNaN(num)) {
              value = num.toFixed(4);
            }
            resolve('<div>' + layerNameThai + ': <b>' + value + '</b></div>');
          }
        } else {
          resolve('<div>' + layerNameThai + ': ไม่มีข้อมูล</div>');
        }
      })
      .catch(function (error) {
        console.error('GetFeatureInfo error for ' + layerNameThai + ':', error);
        resolve('<div>' + layerNameThai + ': อ่านค่าไม่ได้</div>');
      });
  });
}

// =========================
// Click map to show NDVI / NDWI values
// =========================
map.on('singleclick', function (evt) {
  var coordinate = evt.coordinate;
  var viewResolution = map.getView().getResolution();
  var projection = map.getView().getProjection();

  var promises = [];

  if (NDVI.getVisible()) {
    promises.push(fetchLayerValue(NDVI, 'NDVI', coordinate, viewResolution, projection));
  }

  if (NDWI.getVisible()) {
    promises.push(fetchLayerValue(NDWI, 'NDWI', coordinate, viewResolution, projection));
  }

  if (promises.length === 0) {
    popupContent.innerHTML = '<b>ไม่มี layer NDVI หรือ NDWI ที่เปิดอยู่</b>';
    overlay.setPosition(coordinate);
    return;
  }

  Promise.all(promises).then(function (results) {
    popupContent.innerHTML =
      '<b>ค่าดัชนี ณ จุดที่คลิก</b><br>' +
      results.join('');
    overlay.setPosition(coordinate);
  });
});

// =========================
// Change mouse cursor on map hover
// =========================
map.on('pointermove', function (evt) {
  map.getTargetElement().style.cursor = 'pointer';
});