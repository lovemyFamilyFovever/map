var config = {
    defaultCatalog: 'PC',
    version: "Leaflet-1.7.1",

    mapOptions: {
        minZoom: 1, //最小缩放值
        maxZoom: 18, //最大缩放值
        zoom: 7, //初始缩放值
        attributionControl: false, //是否启用地图属性控件
        zoomControl: true, //是否启用地图缩放控件
        scaleControl: true,//是否启用比例尺控件 
        toolListControl: true, //是否启用地图测量工具
        initTooltips: true,//是否初始化右上角的工具栏
        mousemoveLatlng: true,//是否显示鼠标滑动的坐标
        // crs: L.CRS.EPSG3857, //坐标参考系统
    },
    center: [33.523079, 116.477051],

    "矢量底图": 'http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=94062428027398766a1d0f3000b5dc6c',
    "矢量底图注记": 'http://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=94062428027398766a1d0f3000b5dc6c',

    "影像地图": 'http://t{s}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=94062428027398766a1d0f3000b5dc6c',
    "影像地图注记": 'http://t0.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=94062428027398766a1d0f3000b5dc6c',

    "地形地图": 'http://t0.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=94062428027398766a1d0f3000b5dc6c',
    "地形地图注记": 'http://t0.tianditu.gov.cn/DataServer?T=cta_w&x={x}&y={y}&l={z}&tk=94062428027398766a1d0f3000b5dc6c',

    // layerList: [{
    //     id: "0",
    //     name: "大黄山街道",
    //     // url: "https://mapservice.tdtah.cn/server1/rest/services/shidi/MapServer",
    //     url: "http://gisserver.tianditu.gov.cn/TDTService/wfs",
    //     layerIndex: 0,
    //     showStatus: 1,
    //     type: "Feature Layer",
    //     description: "请在这里添加图层描述内容",
    //     tags: ["湿地", "郊区"],
    //     thumbnail: "/info/thumbnail/thumbnail.png",
    //     outFields: {
    //         "所在乡镇": "所在乡镇",
    //         "建设情况": "建设情况",
    //         "规划用途": "规划用途",
    //         "分类": "分类",
    //         "面积_公顷": "面积(公顷)",
    //         // "占比": "占比",
    //         "宗地数_宗": "宗地数(宗)",
    //         // "涉及企业数": "涉及企业数(家)",
    //         "亩": "亩",
    //         "备注": "备注",
    //     },
    //     count: "",
    //     area: "",
    //     data: null
    // }],
}

