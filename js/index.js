

// 实例化使用
const sfs = new Map(config.mapOptions)
const map = sfs.map

//卫星
const mapA = L.tileLayer(config["矢量底图"], { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] })
const mapA_T = L.tileLayer(config["矢量底图注记"], { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] })
let satellite = L.layerGroup([mapA, mapA_T]);

//影像
const mapB = L.tileLayer(config["影像地图"], { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] })
const mapB_T = L.tileLayer(config["影像地图注记"], { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] })
let image = L.layerGroup([mapB, mapB_T]);

//地形
const mapC = L.tileLayer(config["地形地图"], { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] })
const mapC_T = L.tileLayer(config["地形地图注记"], { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] })
let terrain = L.layerGroup([mapC, mapC_T]);

var layerGroup = L.layerGroup().addTo(map);
var addedLayers = {};//自定义存储已添加的图层


loadBaseMap(satellite);// 加载底图
loadMapLayers()//加载图层
initEvent()// 首屏页面的事件注册

// 加载底图
function loadBaseMap(layer) {
    map.removeLayer(satellite);
    map.removeLayer(terrain);
    map.removeLayer(image);
    map.addLayer(layer);
}

//加载图层html模板
function loadMapLayers() {
    $(".layer_wrap").html(template('layers-html', config))
}

// 绑定change事件  切换图层的显示和隐藏
$('.layer_switch input[type="checkbox"]').on('click', function () {

    let index = $(this).parent().parent().attr('data-index')
    let url = config.layerList[index].url + '/' + config.layerList[index].layers[0]

    if ($(this).prop('checked')) {
        // 添加图层到layerGroup
        let selectLayer = L.esri.featureLayer({ url: url }).addTo(layerGroup);
        selectLayer.bindPopup(function (layer) {
            return L.Util.template(
                template('popupForm', layer.feature.properties),
                layer.feature.properties
            );
        });
        addedLayers[index] = selectLayer; // 存储图层
    } else {
        // 从layerGroup中查找并删除图层
        let layerToRemove = addedLayers[index];
        if (layerToRemove) {
            layerGroup.removeLayer(layerToRemove);
            delete addedLayers[index]; // 从对象中移除图层
        }
    }
});


// 首屏页面的事件注册
function initEvent() {
    // 添加定位按钮点击事件
    $('.located_btn').on('click', function () {
        // 使用 Leaflet 的 locate 方法获取用户当前位置
        map.locate({ setView: true });
    });

    // 阻止图层面板点击事件冒泡
    $('.layer-pop').on('click', function () {
        return false;
    }).on('mouseover', function () {
        return false;
    });

    // 图层底图选择
    $('.layer-items a').on('click', function (e) {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        const id = $(this).attr('id');
        // 切换地图类型
        if (id == 'vec_type') {//矢量
            loadBaseMap(satellite)
        } else if (id == 'img_type') {//卫星
            loadBaseMap(image)
        } else if (id === 'ter_type') {//地形
            loadBaseMap(terrain)
        }
    });


    //统计表 关闭悬浮窗
    $('.table-container').on('click', function () {
        $('.table-content').show()
    })
    //统计表 关闭悬浮窗
    $('.table-content .material-icons').on('click', function () {
        $('.table-content').hide()
    })
    //统计图 关闭悬浮窗
    $('.statistics-content .material-icons').on('click', function () {
        $('.statistics-content').hide()
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
}
