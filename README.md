徐州项目地图网页demo

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




2024年3月8日 17:36:13
1. 新增保存时的名称设置
2. 新增图表自定义查询逻辑fields
3. 新增图表切换功能
4. 调整表格序号 从0开始
