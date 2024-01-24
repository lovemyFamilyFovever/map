InitMap() //初始化地图
initEvent() //注册事件


var map, zoom = 12, handler

function InitMap() {
    //初始化地图对象
    map = new T.Map('map');
    //设置显示地图的中心点和级别
    map.centerAndZoom(new T.LngLat(117.28274, 34.203), 12);

    //创建缩放平移控件对象
    control = new T.Control.Zoom();
    control.setPosition(T_ANCHOR_BOTTOM_RIGHT)

    //允许鼠标滚轮缩放地图
    map.enableScrollWheelZoom();
    //创建比例尺控件对象
    var scale = new T.Control.Scale();
    //添加比例尺控件
    map.addControl(scale);
}

// 首屏页面的事件注册
function initEvent() {
    // 点击左侧面板
    $('.left-tool .menu_display').on('click', function () {
        if ($('.show-status').length == 0) {
            // 点击的是菜单按钮,展开树形菜单
            $('.left-down').addClass('show-status')
        } else {
            // 点击的是向上收缩按钮，收缩左侧面板树
            $('.left-down.show-status').removeClass('show-status')
        }
    });
    //切换专题、地名搜索
    $('.classify-list').on('click', function () {
        $('.special').toggleClass('active')
        $('.place').toggleClass('active')

        $('.layer-content').toggleClass('active')
        $('.search-content').toggleClass('active')
    })

    //重置按钮
    $('.layer-content .resetBtn').on('click', function () {
        $('.layer-content  input[type="checkbox"]').prop('checked', false);
    })

    $('.search-content .resetBtn').on('click', function () {
        $('.search-content .mdui-textfield-input').val("")
    })

    //关闭左侧面板
    $('.down-up').on('click', function () {
        $('.left-down.show-status').removeClass('show-status')
    })

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
    $('.switchmap-container').on('click', function () {
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
        // 切换地图类型
        if ($this.attr('id') == 'vec_type') {//矢量
            map.setMapType(window.TMAP_NORMAL_MAP);
        } else if ($this.attr('id') == 'img_type') {//卫星
            map.setMapType(window.TMAP_HYBRID_MAP);
        } else {//地形
            map.setMapType(window.TMAP_TERRAIN_HYBRID_MAP);
        }
    });

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