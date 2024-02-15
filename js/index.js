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
var addedLayers = {};//自定义存储已添加的图层

loadBaseMap(satellite);// 加载底图
loadMapLayers()//加载图层
initEvent()// 首屏页面的事件注册

// 加载底图
function loadBaseMap(layer) {
    mapObj.removeLayer(satellite);
    mapObj.removeLayer(terrain);
    mapObj.removeLayer(image);
    mapObj.addLayer(layer);
}

//加载图层html模板
async function loadMapLayers() {
    $(".layer_wrap").append(template('layers-html', config))
    let activeLayerList = utils.getShowLayerList()
    $('.layer_seatch_input').attr('placeholder', `共加载${activeLayerList.length}个图层`)
    for (var i = 0; i < activeLayerList.length; i++) {
        // 使用 await 等待获取数量结果
        let data = await utils.getMapInfo(activeLayerList[i].url + '/' + activeLayerList[i].layerIndex);
        $('.layer_count:eq(' + i + ')').html("地块数量:<b>" + data.count + '</b>')
        $('.layer_area:eq(' + i + ')').html("图层面积:<b>" + data.totalArea + '</b>')
    }
}

// 搜索功能
$(".search_btn").click(function () {
    var keyword = $(".layer_seatch_input").val().trim();
    if (!keyword) {
        $('.empty_search_list').hide()
        $('.layer_item').show()
    } else {
        // 模糊搜索
        const filteredNames = [];
        utils.getShowLayerList().map(function (layer) {
            if (layer.name.indexOf(keyword) >= 0) {
                filteredNames.push(layer.id)
            }
        });
        if (filteredNames.length == 0) {
            $('.empty_search_list').show()
            $('.layer_item').hide()
        } else {
            // 更新图层列表
            $('.layer_item').each(function (item) {
                var dom = $('.layer_item:eq(' + item + ')')
                var id = dom.attr('data-id')
                if (filteredNames.indexOf(id) == -1) {
                    dom.hide()
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
        // 添加图层到layerGroup
        let selectLayer = L.esri.featureLayer({
            url: url,
            simplifyFactor: 0.35,
            precision: 5,
        }).addTo(layerGroup);

        //点击出现弹窗
        // selectLayer.bindPopup(function (layer) {
        //     return L.Util.template(
        //         template('popupForm', layer.feature.properties),
        //         layer.feature.properties
        //     );
        // });

        //获取图层的源数据
        selectLayer.metadata(function (error, metadata) {
            console.log(metadata);
        });

        //查询图层的边界
        // selectLayer.query().bounds(function (error, latlngbounds) {
        //     if (error) {
        //         console.log('Error running "Query" operation: ' + error);
        //     }
        //     mapObj.fitBounds(latlngbounds);
        // });

        let currentIndex = index;
        //查询要素的数量
        selectLayer.query().run((error, featureCollection) => {
            // 4. 统计要素数量
            var count = featureCollection.features.length;
            console.log('图层地块数量:', count);
            console.log(featureCollection);
            //生产环境需要修改
            if (currentIndex == 0) {
                renderTableShidi(featureCollection)
            }

        });




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
        mapObj.locate({ setView: true });
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


    //统计表 展开悬浮窗
    $('.table-container').on('click', function () {
        $('.table-content').toggle()
    })

    //统计图 展开悬浮窗
    $('.statistics-container').on('click', function () {
        $('.statistics-content').toggle()
    })
}
