

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

loadBaseMap(satellite);// 加载底图
loadLayers()
loadLayerThumbnail()//加载缩略图
initEvent()// 首屏页面的事件注册

// 加载底图
function loadBaseMap(layer) {
    map.removeLayer(satellite);
    map.removeLayer(terrain);
    map.removeLayer(image);
    map.addLayer(layer);
}

//加载图层
function loadLayers() {
    var html = '';
    let layer = config.layerList;
    for (let i = 0; i < layer.length; i++) {
        html += '<div class="layer_item">';
        html += '    <div class="layer_thumbnail">';

        var url = `${layer[i].url}/export?bbox=${map.getBounds().toBBoxString()}&size=512,512&format=png&f=image`

        html += `        <img src="${url}" alt="" class="thumbImg" />`
        html += `        <p class="layer_type" title="地块类型">${layer[i].type}</p>`;
        html += '    </div>';
        html += '    <div class="layer_info">';
        html += `        <p class="layer_name" title="地块名称">${layer[i].name}</p>`;
        html += '        <p class="layer_desc" title="这是一个展示城市地图的服务,包含了道路、建筑和公共设施的信息。">';
        html += `            ${layer[i].description}`;
        html += '        </p>';
        html += '        <div class="layer_info_line">';
        html += '            <div class="layer_tags" title="地块标签">';
        for (var j = 0; j < layer[i].tags.length; j++) {
            html += `        <label>${layer[i].tags[j].tag}</label>`;
        }
        html += '            </div>';
        html += `            <div class="layer_type" title="地块数量">${layer[i].layers.length}</div>`;
        html += `            <div class="layer_area" title="地块面积">123123</div>`;
        html += '        </div>';
        html += '        <div class="layer_switch">';
        html += '            <label class="switch">';
        html += '                <input type="checkbox" />';
        html += '                <span class="slider"></span>';
        html += '            </label>';
        html += '        </div>';
        html += '    </div>';
        html += '</div>';
    }
    $('.layer_wrap').html(html)
}

//加载缩略图
function loadLayerThumbnail() {

    // var layer = L.esri.featureLayer({
    //     url: "https://mapservice.tdtah.cn/server1/rest/services/shidi/MapServer/0",
    // });
    // layer.addTo(map)

    // $.ajax({
    //     url: 'https://mapservice.tdtah.cn/server1/rest/services/rootline/MapServer/export',
    //     data: {
    //         bbox: map.getBounds().toBBoxString(),
    //         size: '512,512',
    //         format: 'png',
    //         f: 'json'
    //     },
    //     success: function (data) {
    //         // 将缩略图添加到地图上
    //         $('.thumbImg').attr('src', data.href);

    //     }
    // });

}


// 首屏页面的事件注册
function initEvent() {
    // 添加定位按钮点击事件
    $('.located_btn').on('click', function () {
        // 使用 Leaflet 的 locate 方法获取用户当前位置
        map.locate({ setView: true });
    });
    //底图面板打开事件
    $('.baselayer_btn').on('click', function () {
        $('.common-panel.layer-pop').show()
    })
    // 底图面板关闭事件
    $('.layer-pop .close').on('click', function () {
        $('.common-panel.layer-pop').hide()
    })
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
    //打开图层弹窗
    $('.switchmlayer-container').on('click', function () {

    })


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
