const map = new ol.Map({
  view: new ol.View({
    center: [11140170.116488684,1769043.5804528007],
    zoom: 9,
    maxZoom: 20,
    minZoom: 3
  }),

//กำหนดชั้นข้อมูลแผนที่ที่ต้องการนำมาแสดงเป็นแผนที่ฐาน โดยกำหนดให้ทำการแสดงผลโดยปริยาย
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
        transition: 0.7
        }),
        visible: false,
        title: 'ปริมาณน้ำฝนสะสม 7 วัน'
    }),
  ],
//จุดมุ่งหมายคือเชื่อมโยงกับ js-map ในไฟล์ index.html
  target: 'js-map'
})