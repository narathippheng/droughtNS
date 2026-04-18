var rainfall7d = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:'https://droughtnsru.com/geoserver/nsru_drought/wms?',
      params: {'LAYERS': "nsru_drought:Rainday7D", 'TILED': true,},
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
      url:'https://droughtnsru.com/geoserver/nsru_drought/wms?',
      params: {'LAYERS': 'nsru_drought:A_TEM', 'TILED': true},
      serverType: 'geoserver',
      crossOrigin: 'anonymous',
      layers: 'Airtem',
      transition: 0
      }),
      visible: false,
      title: 'อุณหภูมิอากาศ',
      opacity: 0.7
    });

var RH = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url:'https://droughtnsru.com/geoserver/nsru_drought/wms?',
      params: {'LAYERS': 'nsru_drought:RH', 'TILED': true},
      serverType: 'geoserver',
      crossOrigin: 'anonymous',
      layers: 'RH',
      transition: 0
      }),
      visible: false,
      title: 'ความชื้นสัมพัทธ์',
      opacity: 1
    });



var AP_NS = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'https://droughtnsru.com/geoserver/nsru_drought/wms?',
      params: {'LAYERS': 'nsru_drought:AP_NS', 'TILED': true},
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
    layers: [basemap1, rainfall7d, Airtem, RH, AP_NS],
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

var layerLegend = new ol.legend.Legend({ layer: rainfall7d })
layerLegend.addItem(new ol.legend.Image({
title: 'ปริมาณน้ำฝนสะสม 7 วัน',
src: "https://droughtnsru.com/geoserver/nsru_drought/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=nsru_drought:Rainday7D"
}))
legend.addItem(layerLegend);

var layerLegend = new ol.legend.Legend({ layer: Airtem })
layerLegend.addItem(new ol.legend.Image({
title: 'อุณหภูมิอากาศเฉลี่ยรายวัน',
src: "https://droughtnsru.com/geoserver/nsru_drought/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=nsru_drought:A_TEM"
}))
legend.addItem(layerLegend);

var layerLegend = new ol.legend.Legend({ layer: RH })
layerLegend.addItem(new ol.legend.Image({
title: 'ความชื้นสัมพัทธ์เฉลี่ยรายวัน',
src: "https://droughtnsru.com/geoserver/nsru_drought/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=nsru_drought:RH"
}))
legend.addItem(layerLegend);

// =========================
// Popup
// =========================
var popupContainer = document.createElement('div');
popupContainer.className = 'ol-popup';
popupContainer.style.background = 'white';
popupContainer.style.padding = '10px';
popupContainer.style.borderRadius = '8px';
popupContainer.style.border = '1px solid #ccc';
popupContainer.style.minWidth = '200px';

var popupContent = document.createElement('div');

popupContainer.appendChild(popupContent);
document.body.appendChild(popupContainer);

var overlay = new ol.Overlay({
  element: popupContainer,
  autoPan: true,
  autoPanAnimation: { duration: 250 }
});

map.addOverlay(overlay);

function getValue(layer, name, coord, resolution, projection) {
  return new Promise(function (resolve) {

    var url = layer.getSource().getFeatureInfoUrl(
      coord,
      resolution,
      projection,
      {
        'INFO_FORMAT': 'application/json',
        'FEATURE_COUNT': 1
      }
    );

    if (!url) {
      resolve(null);
      return;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {

        if (!data.features || data.features.length === 0) {
          resolve(name + ": ไม่มีข้อมูล");
          return;
        }

        var props = data.features[0].properties;
        var value = null;

        // รองรับหลายชื่อ field
        if (props.GRAY_INDEX !== undefined) value = props.GRAY_INDEX;
        else if (props.value !== undefined) value = props.value;
        else if (props.band_1 !== undefined) value = props.band_1;
        else {
          var key = Object.keys(props)[0];
          value = props[key];
        }

        if (value !== null) {
          value = parseFloat(value).toFixed(2);
          resolve(name + ": <b>" + value + "</b>");
        } else {
          resolve(name + ": ไม่มีข้อมูล");
        }

      })
      .catch(() => resolve(name + ": error"));
  });
}

map.on('singleclick', function (evt) {

  var coord = evt.coordinate;
  var resolution = map.getView().getResolution();
  var projection = map.getView().getProjection();

  var promises = [];

  // เช็คว่าเปิด layer ไหน
  if (rainfall7d.getVisible()) {
    promises.push(getValue(rainfall7d, "ฝน 7 วัน (mm)", coord, resolution, projection));
  }

  if (Airtem.getVisible()) {
    promises.push(getValue(Airtem, "อุณหภูมิ (°C)", coord, resolution, projection));
  }

  if (RH.getVisible()) {
    promises.push(getValue(RH, "ความชื้น (%)", coord, resolution, projection));
  }

  // ถ้าไม่มี layer เปิด
  if (promises.length === 0) {
    popupContent.innerHTML = "<b>ไม่มี layer เปิดอยู่</b>";
    overlay.setPosition(coord);
    return;
  }

  Promise.all(promises).then(function (results) {
    popupContent.innerHTML =
      "<b>ค่าจุดที่คลิก</b><br>" + results.join("<br>");
    overlay.setPosition(coord);
  });

});

// =========================
// Popup (มีปุ่มปิด)
// =========================
var popupContainer = document.createElement('div');
popupContainer.className = 'ol-popup';
popupContainer.style.position = 'absolute';
popupContainer.style.background = 'white';
popupContainer.style.padding = '10px';
popupContainer.style.borderRadius = '8px';
popupContainer.style.border = '1px solid #ccc';
popupContainer.style.minWidth = '220px';
popupContainer.style.boxShadow = '0 1px 4px rgba(0,0,0,0.2)';

// ปุ่มปิด ❌
var popupCloser = document.createElement('a');
popupCloser.innerHTML = '✖';
popupCloser.href = '#';
popupCloser.style.position = 'absolute';
popupCloser.style.top = '5px';
popupCloser.style.right = '8px';
popupCloser.style.textDecoration = 'none';
popupCloser.style.fontWeight = 'bold';
popupCloser.style.color = '#333';

// content
var popupContent = document.createElement('div');
popupContent.style.marginTop = '15px';

// append
popupContainer.appendChild(popupCloser);
popupContainer.appendChild(popupContent);
document.body.appendChild(popupContainer);

// overlay
var overlay = new ol.Overlay({
  element: popupContainer,
  autoPan: true,
  autoPanAnimation: { duration: 250 }
});

map.addOverlay(overlay);

popupCloser.onclick = function () {
  overlay.setPosition(undefined);  // 🔥 ซ่อน popup
  popupCloser.blur();
  return false;
};
