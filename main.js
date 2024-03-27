window.onload = init;
//สร้างฟังก์ชันเริ่มต้นสำหรับการทำงาน
function init(){
//ทำการกำหนดตัวแผนที่ กำหนดมุมมองแผนที่ ศูนย์กลางแผนที่ ระยะการขายแผนที่ ระยะสูงสุดในการขยายแผนที่ และระยะตำสุดในการขยายแผนที่
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
  

  //กำหนดชั้นข้อมูลพื้นที่เสี่ยงภัยแล้ง จังหวัดนครสวรรค์ โดยดึง URL และชั้นข้อมูลมาจาก geosever ทำการกำหนดให้ชั้นข้อมูลพื้นที่เสี่ยงภัยดินถล่มแสดงข้อมูลโดยปริยาย
  ///const droughtNS = new ol.layer.Tile({
    //source: new ol.source.TileWMS({
      //url: 'https://landslide.gis-cdn.net/geoserver/droughtNS/wms?',
      //params: {'LAYERS':'droughtNS:testdata', 'TILED': true},
      //serverType: 'geoserver',
      //transition: 0
      //}),
      //visible: true,
      //title: 'Drought',
    //  opacity: 0.7
  //});


  // กำหนดชั้นข้อมูลพื้นที่เสี่ยงภัยดินถล่มในระดับรายวันที่จะแสดงผลผ่านแผนที่ โดยดึง URL และชั้นข้อมูลมาจาก geosever ทำการกำหนดให้ชั้นข้อมูลพื้นที่เสี่ยงภัยดินถล่มในระดับรายวันแสดงผลเมื่อมีการคลิก
  //const rainfall_7day = new ol.layer.Tile({
    //source: new ol.source.TileWMS({
      //url:'https://landslide.gis-cdn.net/geoserver/droughtNS/wms?',
      //params: {'LAYERS': 'droughtNS:Rainday7D', 'TILED': true},
      //serverType: 'geoserver',
      //transition: 0
      //}),
      //visible: false,
      //title: 'rainfall_7day'
  //})

  // กำหนดชั้นข้อมูลปริมาณน้ำฝนในระดับรายวันที่จะแสดงผลผ่านแผนที่ โดยดึง URL และชั้นข้อมูลมาจาก geosever ทำการกำหนดให้ชั้นข้อมูลปริมาณน้ำฝนในระดับรายวันแสดงผลเมื่อมีการคลิก
  //const Rain_daily = new ol.layer.Tile({
    //source: new ol.source.TileWMS({
      //url: 'https://landslide.gis-cdn.net/geoserver/Landslide/wms?',
      //params: {'LAYERS':'Landslide:Rain_Day', 'TILED': true},
      //serverType: 'geoserver',
      //transition: 0
      //}),
      //visible: false,
      //title: 'Rain_day'
  //})

 // กำหนดชั้นข้อมูลทั้งสามชั้นเป็นข้อมูลกลุ่มเดียวกัน คือชั้นข้อมูลฐาน หลักจากนั้นสั่งเพิ่มชั้นข้อมูลลงไปในหน้าเว็บ
  //const baseLayerGroup = new ol.layer.Group({
    //layers: [droughtNS, rainfall_7day, Rain_daily]
  //})
  //map.addLayer(baseLayerGroup);

  //map controls
  const scaleLineControl = new ol.control.ScaleLine({
    units: 'metric',
    minWidth: 100,
    bar: true,
    text: true,
  })
  map.addControl(scaleLineControl)



  navigator.geolocation.watchPosition(function(pos) {
    const coords = [pos.coords.longitude, pos.coords.latitude];
    const accuracy = ol.geom.Polygon.circular(coords, pos.coords.accuracy);
  }, function(error) {
    alert(`ERROR: ${error.message}`);
  }, {
    enableHighAccuracy: true
  });

  const locate = document.createElement('js-map');
  locate.className = 'ol-control ol-unselectable locate';
  locate.innerHTML = '<button title="Locate me">◎</button>';
  locate.addEventListener('click', function () {});
  map.addControl(new ol.control.Control({element: locate}));



    // สร้าง layer swithcer
    var layerSwitcher = new ol.control.LayerSwitcher({
      activationMode: 'click',
      starActive: false,
      groupSelectStyle: 'group'
    });
    map.addControl(layerSwitcher)



  


  // layer switcher ให้สามารถเปิดปิด ข้อมูลหนึ่งเมื่อเลือกไปยังข้อมูลหนึ่ง
  const baseLayerElements = document.querySelectorAll('.sidebar > input[type=radio]')
  for(let baseLayerElement of baseLayerElements){
    baseLayerElement.addEventListener('change', function(){
     let baseLayerElementValue = this.value;
     baseLayerGroup.getLayers().forEach(function(element, index, array){
       let baseLayerName = element.get('title');
       element.setVisible(baseLayerName === baseLayerElementValue)
     })
     })
  }

  //กำหนดชั้นข้อมูลขอบเขตจังหวัดที่จะะแสดงผลผ่านแผนที่ โดยดึง URL และชั้นข้อมูลมาจาก geosever ทำการกำหนดให้ชั้นข้อมูลขอบแขตจังหวัดแสดงผลโดยปริยาย
  const PV = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'https://landslide.gis-cdn.net/geoserver/Landslide/wms?',
      params: {'LAYERS': 'Landslide:North', 'TILED': true},
      serverType: 'geoserver',
      transition: 0,
      }),
      visible: true,
      zIndex: 1,
      title: 'PV'
  })

  //กำหนดชั้นข้อมูลขอบเขตอำเภอที่จะะแสดงผลผ่านแผนที่ โดยดึง URL และชั้นข้อมูลมาจาก geosever ทำการกำหนดให้ชั้นข้อมูลขอบแขตอำเภอเมื่อมีการคลิกเปิด หรือปิดชั้นข้อมูล
  const AP = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'https://landslide.gis-cdn.net/geoserver/droughtNS/wms?',
      params: {'LAYERS': 'droughtNS:AP_NS', 'TILED': true},
      serverType: 'geoserver',
      transition: 0,
      }),
      visible: true,
      zIndex: 1,
      opacity: 1,
      title: 'AP'
  })

  

  const TN = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'https://landslide.gis-cdn.net/geoserver/Landslide/wms?',
      params: {'LAYERS': 'Landslide:TN_North', 'TILED': true},
      serverType: 'geoserver',
      transition: 0,
      }),
      visible: false,
      zIndex: 1,
      opacity: 1,
      title: 'TN'
  })


  // กำหนดทั้งสองชั้นข้อมูลเป็นข้อมูลกลุ่มเดียวกัน
  const Administrative = new ol.layer.Group({
    layers:[
      PV, AP, TN
    ]
  })
  map.addLayer(Administrative);

  // กำหนดให้สามาถเลือกที่เปิดปิดชั้นข้อมูลทีละชั้นข้อมูลหรือพร้อมกันได้
  const tileRasterLayerElements = document.querySelectorAll('.sidebar > input[type=checkbox]');
  for(let tileRasterLayerElement of tileRasterLayerElements){
    tileRasterLayerElement.addEventListener('change', function(){
      let tileRasterLayerElementValue = this.value;
      let tileRasterLayer;

      Administrative.getLayers().forEach(function(element, index, array){
        if(tileRasterLayerElementValue === element.get('title')){
          tileRasterLayer = element;
        }
      })
      this.checked ? tileRasterLayer.setVisible(true) : tileRasterLayer.setVisible(false)
    })
  }}

