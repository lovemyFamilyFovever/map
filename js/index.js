$(document).ready(function () {

    document.title = config.projectName;
    $('.project_name span').text(config.projectName)

    customTable = new CustomTable();//实例化自定义图表

    sfs = new MapObj(config.mapOptions)  // 实例化地图对象
    loadMapLayers()//加载图层
    initEvent()// 首屏页面的事件注册
});

//加载图层列表html模板
async function loadMapLayers() {

    $(".layer_wrap").append(template('layers-html', config))

    const showLayerList = config.layerList.filter(layer => layer.show === true);
    // 使用Promise.all来处理多个并发请求
    Promise.all(showLayerList.map(layer => fetch(layer.url).then(response => response.json())))
        .then(dataArray => {
            dataArray.forEach((data, index) => {
                console.log(`Data from URL ${showLayerList[index].url}`);
                sfs.addGeoJSONToMap(data, showLayerList[index].layerId, showLayerList[index].style);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });

    //格式化滚动条
    new PerfectScrollbar('.layer_wrap');
}

// 首屏页面的事件注册
function initEvent() {

    //显示隐藏 图层列表
    $('.switchlayer-container').on('click', function () {
        $('.layer_content').toggle()
        $('.switchlayer-container').toggleClass('active')
    })

    //隐藏 属性查询弹窗
    $('.attribute_content_close').on('click', function () {
        $('.right-tool').hide()
    })

    //显示隐藏 统计表
    $('.table-container').on('click', function () {
        $('.table-content').toggle()
        $('.table-container').toggleClass('active')
    })

    //显示隐藏 统计图 
    $('.chart-container').on('click', function () {
        $('.chart-content').toggle()
        $('.chart-container').toggleClass('active')
    })

    //关闭图层列表
    $('.layer_content_close').on('click', function () {
        $('.layer_content').hide()
        $('.switchlayer-container').toggleClass('active')
    })
    // 绑定change事件  切换图层的显示和隐藏
    $('.layer_switch input[type="checkbox"]').on('click', function () {
        const index = $(this).closest('.layer_switch').attr('data-index');
        const parentIndex = $(this).closest('.layer_switch').attr('data-parent');
        let url = null;
        let layerId = null;
        let style = null;

        if (parentIndex) {
            url = config.layerList[parentIndex].children[index].url;
            layerId = config.layerList[parentIndex].children[index].layerId;
            style = config.layerList[parentIndex].children[index].style
        } else {
            url = config.layerList[index].url;
            layerId = config.layerList[index].layerId;
            style = config.layerList[index].style
        }
        if ($(this).prop('checked')) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    sfs.addGeoJSONToMap(data, layerId, style);
                    new CustomChart('main-echart', [], "模拟图表")
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            // 从layerGroup中查找并删除图层
            sfs.removeLayerById(layerId)
        }
    });

    //隐藏 统计查询
    $('.statistics-content-close').on('click', function () {
        $('.statistics-content').hide()
        $('.statistics-container').toggleClass('active')
    })

    //隐藏 统计表
    $('.table-content-close').on('click', function () {
        $('.table-content').hide()
        $('.table-container').toggleClass('active')
    })

    //隐藏 统计图
    $('.chart-content-close').on('click', function () {
        $('.chart-content').hide()
        $('.chart-container').toggleClass('active')
    })

    // 添加定位按钮点击事件
    $('.located_btn').on('click', function () {
        // 使用 Leaflet 的 locate 方法获取用户当前位置
        sfs.mapObj.locate({ setView: true })
    });

    // 阻止图层面板点击事件冒泡
    $('.layer-pop').on('click', function () {
        return false
    }).on('mouseover', function () {
        return false
    });
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
            sfs.switchLayers(satellite)
        } else if (id == 'img_type') {//卫星
            sfs.switchLayers(image)
        } else if (id === 'ter_type') {//地形
            sfs.switchLayers(terrain)
        }
    });



    //点击空白区域隐藏下拉框
    $(document).on('click', function (event) {
        var target = $(event.target);
        // 检查点击的元素是否在 .table-content 内部，且不是 .dropdown_list 内部
        if (!target.closest('.dropdown_list,.table_action_btn,.stastic-item-input').length) {
            // 如果不在 .table-content 内部，隐藏  .dropdown_list
            $('.dropdown_list').hide();
        }

    });
}
