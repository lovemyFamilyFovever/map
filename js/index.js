
// 实例化使用
const sfs = new MapObj(config.mapOptions)
const mapObj = sfs.mapObj

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

var layerGroup = L.layerGroup().addTo(mapObj);
var addedLayers = [];//自定义存储已添加的图层

window.targetCoord = null

$(document).ready(function () {
    loadBaseMap(satellite);// 加载底图
    loadMapLayers()//加载企业用地图层
    initEvent()// 首屏页面的事件注册
});

// 加载底图
function loadBaseMap(layer) {
    mapObj.removeLayer(satellite);
    mapObj.removeLayer(terrain);
    mapObj.removeLayer(image);
    mapObj.addLayer(layer);
}

//现在只加载一张地图数据
function loadMapLayers() {
    fetch('http://150.158.76.25:5000/load_shp?file_path=工业用地')//村级行政区
        .then(response => response.json())
        .then(data => {
            console.log(data)
            sfs.addGeoJSONToMap(data)
        })
        .catch(error => {
            console.error('Error:加载企业用地数据失败，原因：', error);
        });
}

// 首屏页面的事件注册
function initEvent() {

    // 搜索功能
    $(".search_btn").click(function () {
        var keyword = $(".layer_seatch_input").val().trim();
        var emptySearchList = $('.empty_search_list');
        var layerItem = $('.layer_item');
        if (!keyword) {
            emptySearchList.hide()
            layerItem.show()
        } else {
            // 模糊搜索
            const filteredNames = utils.getShowLayerList()
                .filter(layer => layer.name.includes(keyword))
                .map(layer => layer.id);

            if (filteredNames.length == 0) {
                emptySearchList.css('display', 'flex')
                layerItem.hide()
            } else {
                emptySearchList.hide()
                layerItem.show()
                // 更新图层列表

                $('.layer-item[data-index="' + filteredNames + '"]');

                layerItem.each(function (index, element) {
                    var id = $(element).attr('data-index')
                    if (filteredNames.indexOf(id) === -1) {
                        $(element).hide()
                    } else {
                        $(element).show()
                    }
                })
            }
        }
        const visibleDivCount = $(".layer_item").not(":hidden").length;
        $('.layer_seatch_input').attr('placeholder', `共加载${visibleDivCount}个图层`)
    });
    // 添加键盘事件
    $(".layer_seatch_input").keydown(function (event) {
        if (event.keyCode === 13) {
            // 执行搜索功能
            $(".search_btn").click();
        }
    });

    // 绑定change事件  切换图层的显示和隐藏
    $('.layer_switch input[type="checkbox"]').on('click', function () {
        let index = $(this).parent().parent().attr('data-index')
        let url = config.layerList[index].url + '/' + config.layerList[index].layerIndex + '/query'

        if ($(this).prop('checked')) {
            $('.layer_item[data-index=' + index + ']').addClass('active')


            //渲染表格+图表
            // new CustomTable(featureCollection, config.layerList[index]["name"], index, config.layerList[index]["outFields"])

            // new CustomChart('main-echart', featureCollection, config.layerList[index]["name"])

            new CustomTable([], config.layerList[index]["name"], index, config.layerList[index]["outFields"])

            // if (targetCoord == null) {
            //     window.targetCoord = new CustomTable([], config.layerList[index]["name"], index, config.layerList[index]["outFields"])
            //     console.log(targetCoord);
            // } else {
            //     targetCoord.initTable(config.layerList[index]["name"])
            // }


            new CustomChart('main-echart', [], config.layerList[index]["name"])

            // 添加图层到layerGroup
            // let selectLayer = L.esri.featureLayer({
            //     url: url,
            //     simplifyFactor: 0.35,
            //     precision: 5,
            // }).addTo(layerGroup);

            // addedLayers[index] = selectLayer; // 存储图层

            //点击出现弹窗
            // selectLayer.bindPopup(function (layer) {
            //     return L.Util.template(
            //         template('popupForm', layer.feature.properties),
            //         layer.feature.properties
            //     );
            // });

            //获取图层的源数据
            // selectLayer.metadata(function (error, metadata) {
            //     console.log(metadata);
            // });

            //查询图层的边界
            // selectLayer.query().bounds(function (error, latlngbounds) {
            //     if (error) {
            //         console.log('Error running "Query" operation: ' + error);
            //     }
            //     mapObj.fitBounds(latlngbounds);
            // });

            //查询要素的数量
            // selectLayer.query()
            //     .where("1=1")
            //     .fields(utils.getOutFieldsKey(index))
            //     .run((error, featureCollection) => {
            //         //统计要素数量
            //         if (featureCollection)
            //             var count = featureCollection.features.length;

            //         config.layerList[index]["data"] = featureCollection

            //         //渲染表格+图表
            //         new CustomTable(featureCollection, config.layerList[index]["name"], index, config.layerList[index]["outFields"])

            //         new CustomChart('main-echart', featureCollection, config.layerList[index]["name"])
            //     });

            // 使用 eachLayer 方法迭代所有图层
            // selectLayer.eachLayer(function (layer) {
            //     var markerCoord = layer.getLatLng();
            //     if (markerCoord.lat === targetCoord[0] && markerCoord.lng === targetCoord[1]) {
            //         // 高亮样式（可以根据需求修改）
            //         layer.setIcon(L.divIcon({ className: 'highlighted-marker' }));
            //     }
            // });

            //鼠标滑过图层  样式发生变化
            // let oldId;
            // selectLayer.on("mouseout", function (e) {
            //     selectLayer.resetStyle(oldId);
            // });
            // selectLayer.on("mouseover", function (e) {
            //     oldId = e.layer.feature.id;
            //     selectLayer.setFeatureStyle(e.layer.feature.id, {
            //         color: "red",
            //         weight: 3,
            //         opacity: 1
            //     });
            // });
        } else {

            $('.layer_item[data-index=' + index + ']').removeClass('active')
            // 从layerGroup中查找并删除图层
            let layerToRemove = addedLayers[index]
            if (layerToRemove) {
                layerGroup.removeLayer(layerToRemove)
                delete addedLayers[index]; // 从对象中移除图层
            }

            if ($('.layer_switch input[type="checkbox"]:checked').length == 0) {
                $('.table-content').hide()
                $('.chart-content').hide()
            }
        }
    });


    // 添加定位按钮点击事件
    $('.located_btn').on('click', function () {
        // 使用 Leaflet 的 locate 方法获取用户当前位置
        mapObj.locate({ setView: true })
    });

    // 阻止图层面板点击事件冒泡
    $('.layer-pop').on('click', function () {
        return false
    }).on('mouseover', function () {
        return false
    });

    //显示隐藏 图层列表dom
    $('.switchmlayer-container').on('click', function () {
        $('.layer_content').toggle()
    })
    //展开 切换地图页面
    $('.baselayer_btn.tool_btn').on('click', function () {
        $('.common-panel.layer-pop').show()
    })
    //关闭 切换底图页面
    $('.common-panel.layer-pop .close').on('click', function () {
        $('.common-panel.layer-pop').hide()
    })

    // 图层底图选择
    $('.layer-items a').on('click', function (e) {
        $(this).siblings().removeClass('active')
        $(this).addClass('active')
        const id = $(this).attr('id')
        // 切换地图类型
        if (id == 'vec_type') {//矢量
            loadBaseMap(satellite)
        } else if (id == 'img_type') {//卫星
            loadBaseMap(image)
        } else if (id === 'ter_type') {//地形
            loadBaseMap(terrain)
        }
    });

    //关闭图层列表
    $('.layer_content_close.close_btn').on('click', function () {
        $('.layer_content').hide()
    })

    //统计表 点击左侧按钮 展开悬浮窗
    $('.table-container').on('click', function () {
        if ($('.layer_switch input[type="checkbox"]:checked').length > 0) {
            $('.table-content').toggle()
        }
    })
    //统计图 点击左侧按钮 展开悬浮窗
    $('.chart-container').on('click', function () {
        if ($('.layer_switch input[type="checkbox"]:checked').length > 0) {
            $('.chart-content').toggle()
        }
    })

    //点击空白区域隐藏下拉框
    $(document).on('click', function (event) {
        var target = $(event.target);
        // 检查点击的元素是否在 .table-content 内部，且不是 .dropdown_list 内部
        if (!target.closest('.dropdown_list,.dropdown_list_filter,.table_download_btn').length) {
            // 如果不在 .table-content 内部，隐藏  .dropdown_list
            $('.table-content .dropdown_list').hide();
            $('.dropdown_list_filter').hide();
        }
    });

    //隐藏表格
    $('.table-content-close').on('click', function () {
        $('.table-content').hide()
    })

}
