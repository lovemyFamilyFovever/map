InitMap()//初始化地图
initEvent()//注册事件

function InitMap() {
    //初始化地图对象
    map = new T.Map('map');
    //设置显示地图的中心点和级别
    map.centerAndZoom(new T.LngLat(116.40769, 39.89945), 12);

    //创建缩放平移控件对象
    control = new T.Control.Zoom();
    control.setPosition(T_ANCHOR_BOTTOM_RIGHT)
    //添加缩放平移控件
    map.addControl(control);

    //允许鼠标滚轮缩放地图
    map.enableScrollWheelZoom();
    //创建比例尺控件对象
    var scale = new T.Control.Scale();
    //添加比例尺控件
    map.addControl(scale);

    //创建对象
    var ctrl = new T.Control.MapType();
    //添加控件
    map.addControl(ctrl);

    //添加鼠标在地图划过时触发的事件
    // map.addEventListener("mousemove", function () {
    //     document.getElementById("info").value = e.lnglat.getLng().toFixed(6) + "," + e.lnglat.getLat().toFixed(6)
    // });

    map.clearOverLays()
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
        if ($(this).hasClass('special')) {
            $('.classify-list.active').removeClass('active')
            $(this).addClass('active')

            $('.content-item.active').removeClass('active')
        } else {

        }



    })




}

