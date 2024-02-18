
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
        }

        getMergedOptions(options) {
            const defaultOptions = {
                toolListControl: false,
                zoomControl: true,
                scaleControl: false
            };
            return $.extend({}, defaultOptions, options);
        }

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