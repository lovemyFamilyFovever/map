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
1. [x] 新增保存文件时的名称弹窗
2. [ ] 新增图表自定义查询逻辑fields  待完善
3. [X] 新增数据查询为空的时候的提示
4. [X] 新增图表切换功能
5. [x] 调整表格序号 从0开始
6. [X] 优化业务代码
7. [ ] 新增图层列表拖动排序功能
8. [ ] 新增一个feature   选中图层显示的时候，展示loading  防止快速点击后 数据加载不同步
