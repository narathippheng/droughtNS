var wms_layers = [];


        var lyr_OpenStreetMap_0 = new ol.layer.Tile({
            'title': 'OpenStreetMap',
            'type': 'base',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
    attributions: ' ',
                url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
        });
var lyr_Drought_NS2_1 = new ol.layer.Image({
                            opacity: 1,
                            title: "Drought_NS2",
                            
                            
                            source: new ol.source.ImageStatic({
                               url: "./layers/Drought_NS2_1.png",
    attributions: ' ',
                                projection: 'EPSG:3857',
                                alwaysInRange: true,
                                imageExtent: [11030216.978720, 1695271.136643, 11224580.809645, 1826814.224180]
                            })
                        });
var format_AP_NS_2 = new ol.format.GeoJSON();
var features_AP_NS_2 = format_AP_NS_2.readFeatures(json_AP_NS_2, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_AP_NS_2 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_AP_NS_2.addFeatures(features_AP_NS_2);
var lyr_AP_NS_2 = new ol.layer.Vector({
                declutter: true,
                source:jsonSource_AP_NS_2, 
                style: style_AP_NS_2,
                popuplayertitle: "AP_NS",
                interactive: true,
                title: '<img src="styles/legend/AP_NS_2.png" /> AP_NS'
            });

lyr_OpenStreetMap_0.setVisible(true);lyr_Drought_NS2_1.setVisible(true);lyr_AP_NS_2.setVisible(true);
var layersList = [lyr_OpenStreetMap_0,lyr_Drought_NS2_1,lyr_AP_NS_2];
lyr_AP_NS_2.set('fieldAliases', {'AP_IDN': 'AP_IDN', 'AP_CODE': 'AP_CODE', 'AP_TN': 'AP_TN', 'AP_EN': 'AP_EN', 'PV_IDN': 'PV_IDN', 'PV_CODE': 'PV_CODE', 'PV_TN': 'PV_TN', 'PV_EN': 'PV_EN', 'RE_NESDB': 'RE_NESDB', 'RE_ROYIN': 'RE_ROYIN', 'AreaShape': 'AreaShape', 'ADMIN_TYPE': 'ADMIN_TYPE', });
lyr_AP_NS_2.set('fieldImages', {'AP_IDN': 'Range', 'AP_CODE': 'TextEdit', 'AP_TN': 'TextEdit', 'AP_EN': 'TextEdit', 'PV_IDN': 'Range', 'PV_CODE': 'TextEdit', 'PV_TN': 'TextEdit', 'PV_EN': 'TextEdit', 'RE_NESDB': 'TextEdit', 'RE_ROYIN': 'TextEdit', 'AreaShape': 'TextEdit', 'ADMIN_TYPE': 'Range', });
lyr_AP_NS_2.set('fieldLabels', {'AP_IDN': 'no label', 'AP_CODE': 'no label', 'AP_TN': 'no label', 'AP_EN': 'no label', 'PV_IDN': 'no label', 'PV_CODE': 'no label', 'PV_TN': 'no label', 'PV_EN': 'no label', 'RE_NESDB': 'no label', 'RE_ROYIN': 'no label', 'AreaShape': 'no label', 'ADMIN_TYPE': 'no label', });
lyr_AP_NS_2.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});