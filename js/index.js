
const mapObj = {

    InitMap: function () {
        // 创建地图
        let osm = L.tileLayer(config.defaultService + "&tk=" + config.token, config.mapOptions);
        let map = L.map("map", config.mapOptions).setView(config.center).addLayer(osm);

        //添加矢量标记
        L.tileLayer(config.mapbox_Vector_label + "&tk=" + config.token, config.tileLayerOptions).addTo(map)

        //添加右下角放大缩小控件
        zoomControl = L.control.zoom({
            position: 'bottomright',
            // 自定义title
            zoomInTitle: '放大',
            zoomOutTitle: '缩小'
        }).addTo(map);

        //初始化比例尺控件对象
        scale = L.control.scale().addTo(map);

        //初始化右上角绘制测量工具栏
        map.pm.addControls({
            position: 'topright',
            drawCircleMarker: false,
            rotateMode: false,
        });
        //设置中文
        map.pm.setLang("zh");

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

        return map
    }
}
const map = mapObj.InitMap() //初始化地图
initEvent(map) //注册事件

console.log(map);

// 首屏页面的事件注册
function initEvent() {

    // 添加定位按钮点击事件
    $('.located_btn').on('click', function () {
        // 使用 Leaflet 的 locate 方法获取用户当前位置
        map.locate({ setView: true });
    });

    //实例化右下角的放大缩小组件
    new mdui.Tooltip('.leaflet-control-zoom-in', { content: '放大', position: 'left' });
    new mdui.Tooltip('.leaflet-control-zoom-out', { content: '缩小', position: 'left' });
    //放大
    $('.zoomInTool').on('click', function () {
        map.zoomIn()
    })
    //缩小
    $('.zoomOutTool').on('click', function () {
        map.zoomOut()
    })
    //增加标注
    $('.markerTool').on('click', function () {
        if (handler) handler.close();
        handler = new T.MarkTool(map, { follow: true });
        handler.open();
    })
    // 多边形工具
    $('.polygonTool').on('click', function () {
        if (handler) handler.close();
        handler = new T.PolygonTool(map);
        handler.open();
    })
    // 线段工具
    $('.polylineTool').on('click', function () {
        if (handler) handler.close();
        handler = new T.PolylineTool(map);
        handler.open();
    })
    // 方形工具
    $('.rectangleTool').on('click', function () {
        if (handler) handler.close();
        handler = new T.RectangleTool(map, { follow: true });
        handler.open();
    })
    // 圆形工具
    $('.circleTool').on('click', function () {
        if (handler) handler.close();
        handler = new T.CircleTool(map, { follow: true });
        handler.open();
    })
    // 清除所有
    $('.clearTool').on('click', function () {
        map.clearOverLays()
    })

    //底图切换
    $('.baselayer_btn').on('click', function () {
        $('.common-panel.layer-pop').show()
    })
    // 阻止图层面板点击事件冒泡
    $('.layer-pop').on('click', function () {
        return false;
    }).on('mouseover', function () {
        return false;
    });

    // 图层面板关闭事件
    $('.layer-pop .close').on('click', function () {
        $(this).parent().hide();
    })
    // 图层底图选择
    $('.layer-items a').on('click', function () {
        var $this = $(this);
        $this.siblings().removeClass('active');
        $this.addClass('active');



        // 默认矢量底图
        var normalMap = L.tileLayer(config.mapbox_Vector + '&tk=' + config.token, { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] });

        // 地形底图
        var terrainMap = L.tileLayer(config.SYS_DEM_MAPSERVER_PATH + '&tk=' + config.token, { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] });

        // 卫星底图  
        var satelliteMap = L.tileLayer(config.SYS_IMG_MAPSERVER_PATH + '&tk=' + config.token, { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] });


        // 切换地图类型
        if ($this.attr('id') == 'vec_type') {//矢量
            map.removeLayer(terrainMap);
            map.removeLayer(satelliteMap);
            map.addLayer(normalMap);

        } else if ($this.attr('id') == 'img_type') {//卫星
            map.removeLayer(terrainMap);
            map.addLayer(satelliteMap);
            map.removeLayer(normalMap);
        } else {//地形
            map.addLayer(terrainMap);
            map.removeLayer(satelliteMap);
            map.removeLayer(normalMap);
        }
    });

    //打开图层弹窗
    $('.switchmlayer-container').on('click', function () {

    })


    //统计图 展开悬浮窗
    $('.statistics-container').on('click', function () {
        $('.statistics-content .title').html('某地区面积图表')

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main-echart'));

        // 指定图表的配置项和数据
        var option = {
            grid: {
                left: '45px',
                top: '40px',
                right: '10px',
                bottom: '100px'
            },
            legend: {
                position: "bottom"
            },
            toolbox: {
                show: true,
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                feature: {
                    saveAsImage: {}
                }
            },
            title: {
                text: ''
            },
            xAxis: {
                type: 'category',
                data: ['A', 'B', 'C', 'D', 'E', 'F']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: "面积",
                    data: [4019.2, 1544.2, 52.59, 45.32, 145.2, 1370],
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    }
                },
                {
                    name: "数量",
                    data: [4019.2, 1544.2, 52.59, 45.32, 145.2, 1370],
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    }
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        $('.statistics-content').show()
    })
    //统计图 关闭悬浮窗
    $('.statistics-content .material-icons').on('click', function () {
        $('.statistics-content').hide()
    })

    //统计表 关闭悬浮窗
    $('.table-container').on('click', function () {

        $('.table-content').show()
    })
    //统计表 关闭悬浮窗
    $('.table-content .material-icons').on('click', function () {
        $('.table-content').hide()
    })


}
