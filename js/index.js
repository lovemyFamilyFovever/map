$(document).ready(function () {

    document.title = config.projectName;
    $('.project_name .project_name_text').text(config.projectName);

    sfs = new MapObj(config.mapOptions)  // 实例化地图对象

    renderLayerList(); // 渲染图层列表页面
    initEvent()// 首屏页面的事件注册

    statisticsObj = new Statistics(); // 实例化统计面板
});

// 渲染图层列表页面
function renderLayerList(list) {
    var sb = "";
    sb += '<div class="layer_items">';
    config.layerList.forEach((item, i) => {
        sb += `<div class="layer_item">`;
        sb += `    <div class="layer_info">`;
        sb += `        <p class="layer_name" title="地块名称">${item.layerName}</p>`;
        sb += `        <div class="layer_switch">`;
        sb += `            <div class="layer_loading loader"></div>`;
        sb += `            <label class="switch">`;
        if (item.show) {
            const leafletID = sfs.addGeoJSONToMap(item);
            sb += `        <input type="checkbox" data-index="${i}" data-leafletid="${leafletID}" checked />`;
        } else {
            sb += `        <input type="checkbox" data-index="${i}" />`;
        }
        sb += `                <span class="slider"></span>`;
        sb += `            </label>`;
        sb += `        </div>`;
        sb += `    </div>`;
        sb += `</div>`;
        if (item.children) {
            item.children.forEach((child, j) => {
                sb += `<div class="layer_item layer_item_child">`;
                sb += `    <div class="layer_info">`;
                sb += `        <p class="layer_name" title="地块名称">${child.layerName}</p>`;
                sb += `        <div class="layer_switch">`;
                sb += `            <div class="layer_loading loader"></div>`;
                sb += `            <label class="switch">`;
                if (child.show) {
                    const leafletID = sfs.addGeoJSONToMap(child);
                    sb += `        <input type="checkbox" data-parent="${i}" data-index="${j}" data-leafletid="${leafletID}" checked />`;
                } else {
                    sb += `        <input type="checkbox" data-parent="${i}" data-index="${j}" />`;
                }
                sb += `                <span class="slider"></span>`;
                sb += `            </label>`;
                sb += `        </div>`;
                sb += `    </div>`;
                sb += `</div>`;
            })
        }
    });
    sb += '</div>';
    $(".layer_wrap").append(sb)
}

// 首屏页面的事件注册
function initEvent() {
    var that = this;
    //显示隐藏 图层列表
    $('.layer-container').on('click', function () {

        $('.statistics-content').removeClass('active')
        $('.statistics-container').removeClass('active')

        $('.layer-content').toggleClass('active')
        $('.layer-container').toggleClass('active');
    })

    //显示隐藏 属性查询
    $('.attribute-container').on('click', function () {
        if (sfs.layerGroup.length == 0) return;
        if ($(this).hasClass('active')) {
            $('.attribute-container').removeClass('active')

            // 移除悬浮的文本
            $('#hover-text').remove();
            $(document).off('mousemove.hoverText'); // 取消鼠标移动事件
        } else {
            $('.attribute-container').addClass('active')

            // 创建悬浮文本的 div
            var hoverText = $('<div id="hover-text">点击获取图斑属性</div>');
            $('body').append(hoverText);

            // 监听鼠标移动事件，让文本跟随鼠标
            $(document).on('mousemove.hoverText', function (e) {
                hoverText.css({
                    top: e.clientY + 10 + 'px',  // 距离鼠标光标下方 10 像素
                    left: e.clientX + 10 + 'px'  // 距离鼠标光标右侧 10 像素
                });
            });
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
        const index = $(this).attr('data-index');
        const parentIndex = $(this).attr('data-parent');

        let objectData = null;
        if (parentIndex) {
            objectData = config.layerList[parentIndex].children[index]
        } else {
            objectData = config.layerList[index]
        }
        if ($(this).prop('checked')) {

            $(this).parent().hide();
            $(this).parent().prev().show()

            const leafletID = sfs.addGeoJSONToMap(objectData);
            $(this).attr('data-leafletid', leafletID)

            $(this).closest('.layer_switch').prev().addClass('active')
            $(this).parent().show();
            $(this).parent().prev().hide()

        } else {
            const leafletID = $(this).attr('data-leafletid');
            // 从layerGroup中查找并删除图层
            sfs.removeLayerById(leafletID)

            $(this).closest('.layer_switch').prev().removeClass('active')
            $(this).parent().show();
            $(this).parent().prev().hide()
        }
        that.statisticsObj.renderTitle(); // 重新渲染统计面板标题
    });

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
}