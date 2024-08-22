
// map.js
const getMapModule = (function () {
    class MapObj {
        constructor(options) {
            this.mapObj = null;
            this.options = this.getMergedOptions(options);
            this.initMap()
        }

        initMap() {
            // 创建地图
            this.mapObj = L.map("map", config.mapOptions).setView(config.center);

            // 添加控件
            this.addControls();
        }
        addControls() {
            if (this.options.zoomControl) {
                // 添加缩放控件
                L.control.zoom({ position: 'bottomright' }).addTo(this.mapObj);
            }
            if (this.options.scaleControl) {
                // 添加比例尺控件 
                L.control.scale().addTo(this.mapObj);
            }
            if (this.options.toolListControl) {
                // 添加绘制控件 初始化右上角绘制测量工具栏
                this.mapObj.pm.addControls({
                    position: 'topright',
                    drawCircleMarker: false,
                    rotateMode: false,
                });
                // 设置语言
                this.mapObj.pm.setLang('zh');
            }
            if (this.options.mousemoveLatlng) {

                // 定义一个变量存储坐标信息
                var coords = L.control();
                // 添加一个div来显示坐标  
                coords.onAdd = function () {
                    let _this = this;
                    _this._div = L.DomUtil.create('div', 'coords');
                    return _this._div;
                };
                coords.update = function (evt) {
                    coords._div.innerHTML =
                        '经度:' + evt.latlng.lng + '<br>' +
                        '纬度:' + evt.latlng.lat;
                };

                this.mapObj.on('mousemove', coords.update);

                // 添加控件到地图
                coords.addTo(this.mapObj)
                coords.setPosition('bottomleft')
            }
        }

        getMergedOptions(options) {
            const defaultOptions = {
                toolListControl: false,
                zoomControl: true,
                scaleControl: false
            };
            return $.extend({}, defaultOptions, options);
        }

        // 添加解析后的 GeoJSON 到地图上
        addGeoJSONToMap(geoJson) {

            proj4.defs("EPSG:4539", "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=39500000 +y_0=0 +datum=CGCS2000 +units=m +no_defs"); // CGCS2000_3_Degree_GK_Zone_39

            proj4.defs("EPSG:3857", "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"); // Web Mercator
            proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs"); // WGS84 经纬度
            // 转换 GeoJSON 坐标
            var transformedGeoJson = JSON.parse(JSON.stringify(geoJson));
            const geoJsonLayer = L.geoJSON(transformedGeoJson, {
                coordsToLatLng: function (coords) {

                    // Convert CGCS2000 coordinates to EPSG:3857
                    const fromProj = proj4("EPSG:4539");
                    const toProj = proj4("EPSG:3857");

                    // Convert coordinates
                    const point = proj4(fromProj, toProj, [coords[0], coords[1]]);
                    return L.CRS.EPSG3857.unproject(L.point(point[0], point[1]));
                },
                style: function (feature) {
                    return {
                        color: "#ff7800",
                        weight: 2,
                        opacity: 0.65
                    };
                }
            }).addTo(this.mapObj);

            // 自动调整视图到图层范围
            this.mapObj.once('layeradd', function () {
                if (geoJsonLayer) {
                    var center = geoJsonLayer.getBounds().getCenter();
                    // 设置地图视图到图层中心点，并设置一个合适的缩放级别
                    this.mapObj.setView(center, 12); // 14 是示例缩放级别，您需要根据实际情况调整

                }
            }.bind(this));
        }

        get
            getMap() {
            return this.mapObj
        }
    }

    return {
        MapObj: MapObj
    };

})();

// 获取 Map 类
const MapObj = getMapModule.MapObj;