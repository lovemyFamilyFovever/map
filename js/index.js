$(document).ready(function () {
    document.title = config.projectName;
    $('.project_name span').text(config.projectName);

    sfs = new MapObj(config.mapOptions)  // 实例化地图对象
    loadMapLayers()//加载图层
    initEvent()// 首屏页面的事件注册
});

//加载图层列表html模板
async function loadMapLayers() {

    $(".layer_wrap").append(template('layers-html', config))

    const showLayerList = findShowTrueElements(config.layerList)
    // 使用Promise.all来处理多个并发请求
    Promise.all(showLayerList.map(layer => fetch(layer.url).then(response => response.json())))
        .then(dataArray => {
            dataArray.forEach((data, index) => {
                console.log(`Data from URL ${showLayerList[index].url}`);
                sfs.addGeoJSONToMap(data, showLayerList[index]);
            });
            new Statistics(); // 实例化统计面板
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// 首屏页面的事件注册
function initEvent() {

    //显示隐藏 图层列表
    $('.layer-container').on('click', function () {

        $('.statistics-content').removeClass('active')
        $('.statistics-container').removeClass('active')

        $('.layer-content').toggleClass('active')
        $('.layer-container').toggleClass('active');
    })

    //显示隐藏 属性查询
    $('.attribute-container').on('click', function () {
        if (sfs.layerStore.size == 0) return;
        var mapContainer = document.getElementById('map');
        if ($(this).hasClass('active')) {
            $('.attribute-container').removeClass('active')
            mapContainer.style.cursor = 'revert-layer';
        } else {
            $('.attribute-container').addClass('active')
            mapContainer.style.cursor = 'help';
        }
    })

    //隐藏 查询统计弹窗
    $('.statistics-container').on('click', function () {

        $('.layer-content').removeClass('active')
        $('.layer-container').removeClass('active')

        $('.statistics-content').toggleClass('active')
        $('.statistics-container').toggleClass('active')
    })

    //关闭图层列表
    $('.layer_content_close').on('click', function () {
        $('.layer-content').hide()
        $('.layer-container').toggleClass('active')
    })
    // 绑定change事件  切换图层的显示和隐藏
    $('.layer_switch input[type="checkbox"]').on('click', function () {
        const index = $(this).closest('.layer_switch').attr('data-index');
        const parentIndex = $(this).closest('.layer_switch').attr('data-parent');

        let objectData = null;
        if (parentIndex) {
            objectData = config.layerList[parentIndex].children[index]
        } else {
            objectData = config.layerList[index]
        }
        if ($(this).prop('checked')) {

            $(this).parent().hide();
            $(this).parent().prev().show()

            fetch(objectData.url)
                .then(response => response.json())
                .then(data => {

                    sfs.addGeoJSONToMap(data, objectData);
                    new Statistics(); // 实例化统计面板
                    $(this).closest('.layer_switch').prev().addClass('active')

                    $(this).parent().show();
                    $(this).parent().prev().hide()
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            // 从layerGroup中查找并删除图层
            sfs.removeLayerById(objectData.layerId)
            $(this).closest('.layer_switch').prev().removeClass('active')

            $(this).parent().show();
            $(this).parent().prev().hide()

            new Statistics(); // 实例化统计面板
        }
    });

    // //隐藏 属性查询弹窗
    // $('.attribute_content_close').on('click', function () {
    //     $('.attribute_content').hide();
    //     $('.attribute-container').removeClass('active')
    //     var mapContainer = document.getElementById('map');
    //     mapContainer.style.cursor = 'revert-layer';
    // })

    //隐藏 统计查询
    $('.statistics-content-close').on('click', function () {
        $('.statistics-content').toggleClass('active')
        $('.statistics-container').toggleClass('active')
    })

    //隐藏 统计表
    $('.table-content-close').on('click', function () {
        $('.table-content').hide()
    })

    //隐藏 统计图
    $('.chart-content-close').on('click', function () {
        $('.chart-content').hide()
    })

    //点击空白区域隐藏下拉框
    $(document).on('click', function (event) {
        var target = $(event.target);
        const clickDom = '.dropdown_list,.table_action_btn,.dropdown-input-container,.dropdown_input';
        // 检查点击的元素是否在 .table-content 内部，且不是 .dropdown_list 内部
        if (!target.closest(clickDom).length) {
            // 如果不在 .table-content 内部，隐藏  .dropdown_list
            $('.dropdown_list').hide();
        }
    });

    //点击图层显示 样式编辑弹窗
    $('.editLayerStyle').on('click', function () {
        //待补充
    });

}

//筛选出show为true的图层
function findShowTrueElements(layerList = config.layerList) {
    return layerList.reduce((acc, layer) => {
        if (layer.show) {
            acc.push(layer);
        }
        if (layer.children) {
            acc.push(...findShowTrueElements(layer.children));
        }
        return acc;
    }, []);
}
