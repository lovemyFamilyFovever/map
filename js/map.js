
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
                //修改右上角工具栏的默认属性
                this.initTooltips();
            }
        }
        initTooltips() {
            //修改右上角工具栏的默认属性
            $('.control-icon').attr('title', "")
            new mdui.Tooltip('.leaflet-pm-icon-marker', { content: '绘制标记', position: 'left' });
            new mdui.Tooltip('.leaflet-pm-icon-polyline', { content: '绘制线段', position: 'left' });
            new mdui.Tooltip('.leaflet-pm-icon-rectangle', { content: '绘制长方形', position: 'left' });
            new mdui.Tooltip('.leaflet-pm-icon-polygon', { content: '绘制多边形', position: 'left' });
            new mdui.Tooltip('.leaflet-pm-icon-circle', { content: '绘制圆形', position: 'left' });
            new mdui.Tooltip('.leaflet-pm-icon-text', { content: '添加文本', position: 'left' });

            new mdui.Tooltip('.leaflet-pm-icon-edit', { content: '编辑图层', position: 'left' });
            new mdui.Tooltip('.leaflet-pm-icon-drag', { content: '拖拽图层', position: 'left' });
            new mdui.Tooltip('.leaflet-pm-icon-cut', { content: '剪切图层', position: 'left' });
            new mdui.Tooltip('.leaflet-pm-icon-delete', { content: '删除图层', position: 'left' });
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