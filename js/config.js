var config = {
    defaultCatalog: '移动端',
    version: "Leaflet-1.7.1",

    defaultDomin: 'https://mapservice.tdtah.cn/server1/rest/services',

    "矢量底图": 'http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=94062428027398766a1d0f3000b5dc6c',
    "矢量底图注记": 'http://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=94062428027398766a1d0f3000b5dc6c',

    "影像地图": 'http://t{s}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=94062428027398766a1d0f3000b5dc6c',
    "影像地图注记": 'http://t0.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=94062428027398766a1d0f3000b5dc6c',

    "地形地图": 'http://t0.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=94062428027398766a1d0f3000b5dc6c',
    "地形地图注记": 'http://t0.tianditu.gov.cn/DataServer?T=cta_w&x={x}&y={y}&l={z}&tk=94062428027398766a1d0f3000b5dc6c',

    layerList: [{
        id: "0",
        showStatus: 1,
        url: "https://mapservice.tdtah.cn/server1/rest/services/shidi/MapServer",
        layerIndex: 0,
        name: "湿地tm",
        type: "Feature Layer",
        description: "这是一个图层描述",
        tags: ["湿地", "郊区"],
        thumbnail: "/info/thumbnail/thumbnail.png",
        count: "",
        area: ""
    }, {
        id: "1",
        showStatus: 1,
        url: "https://mapservice.tdtah.cn/server1/rest/services/AHDISA/MapServer",
        layerIndex: 0,
        name: "行政区划_市",
        type: "Feature Layer",
        description: "",
        tags: ["郊区", "城市"],
        thumbnail: "/info/thumbnail/thumbnail.png",
        count: "",
        area: ""
    }, {
        id: "2",
        showStatus: 1,
        url: "https://mapservice.tdtah.cn/server1/rest/services/rootline/MapServer",
        layerIndex: 0,
        name: "rootline",
        type: "Feature Layer",
        description: "这是一个图层描述",
        tags: ["水体", "郊区", "道路"],
        thumbnail: "/info/thumbnail/thumbnail.png",
        count: "",
        area: ""
    }, {
        id: "3",
        showStatus: 0,
        url: "https://mapservice.tdtah.cn/server1/rest/services/Water07/MapServer",
        layerIndex: 0,
        name: "水体202007",
        type: "Feature Layer",
        description: "",
        tags: ["水体", "郊区"],
        thumbnail: "/info/thumbnail/thumbnail.png",
        count: "",
        area: ""
    }, {
        id: "4",
        showStatus: 0,
        url: "https://mapservice.tdtah.cn/server1/rest/services/HF2012/MapServer",
        layerIndex: 0,
        name: "范围2000",
        type: "Feature Layer",
        description: "",
        tags: ["城市", "建筑"],
        thumbnail: "/info/thumbnail/thumbnail.png",
        count: "",
        area: ""
    }, {
        id: "5",
        url: "https://mapservice.tdtah.cn/server1/rest/services/AHSZJZ/MapServer",
        layerIndex: 0,
        name: "1万图幅号",
        type: "Feature Layer",
        description: "",
        tags: ["城市", "建筑"],
        thumbnail: "/info/thumbnail/thumbnail.png",
        count: "",
        area: ""
    }, {
        id: "6",
        url: "https://mapservice.tdtah.cn/server1/rest/services/AHSZJZ/MapServer",
        layerIndex: [1],
        name: "县（安徽）",
        type: "Feature Layer",
        description: "",
        tags: ["城市", "建筑"],
        thumbnail: "/info/thumbnail/thumbnail.png",
        count: "",
        area: ""
    }, {
        id: "7",
        url: "https://mapservice.tdtah.cn/server1/rest/services/AHSZJZ/MapServer",
        layerIndex: [2],
        name: "市（安徽）",
        type: "Feature Layer",
        description: "",
        tags: ["城市", "建筑"],
        thumbnail: "/info/thumbnail/thumbnail.png",
        count: "",
        area: "",
        area: ""
    }],

    mapOptions: {
        minZoom: 1, //最小缩放值
        maxZoom: 18, //最大缩放值
        zoom: 7, //初始缩放值
        attributionControl: false, //是否启用地图属性控件
        zoomControl: true, //是否启用地图缩放控件
        scaleControl: true,//是否启用比例尺控件 
        toolListControl: true, //是否启用地图测量工具
        initTooltips: true,//是否初始化右上角的工具栏
    },
    center: [33.523079, 116.477051],

}

