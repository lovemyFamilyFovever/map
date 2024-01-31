
动态地图 https://services.arcgisonline.com/arcgis/rest/services/Specialty/Soil_Survey_Map/MapServer

切片地图 https://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer

要素图层 
```
L.esri.featureLayer({
    url: '.../ArcGIS/rest/services/BloomfieldHillsMichigan/LandusePlanning/FeatureServer/0'
})
 
L.esri.featureLayer({
    url: '.../ArcGIS/rest/services/Demographics/ESRI_Population_World/MapServer/0'
})
```

https://services.arcgisonline.com/ArcGIS/rest/services/BloomfieldHillsMichigan/LandusePlanning/FeatureServer/0