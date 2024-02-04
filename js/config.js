var config = {
    defaultCatalog: '移动端',
    version: "Leaflet-1.7.1",
    defaultService: "http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}",
    token: "94062428027398766a1d0f3000b5dc6c",

    //矢量底图	
    mapbox_Vector: 'http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}',
    //矢量注记
    mapbox_Vector_label: 'http://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}',

    // 卫星地图
    SYS_IMG_MAPSERVER_PATH: 'http://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}',
    // 卫星注记
    SYS_IMG_LABEL_MAPSERVER_PATH: 'http://t0.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}',


    // 地形地图
    SYS_DEM_MAPSERVER_PATH: 'http://t0.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}',
    // 地形注记
    SYS_DEM_LABELS_MAPSERVER_PATH: 'http://t0.tianditu.gov.cn/DataServer?T=cta_w&x={x}&y={y}&l={z}',

    tileLayerOptions: {
        minZoom: 1, //最小缩放值
        maxZoom: 18, //最大缩放值
    },
    mapOptions: {
        zoom: 7, //初始缩放值
        zoomControl: false, //是否启用地图缩放控件
        attributionControl: false, //是否启用地图属性控件
    },
    center: [33.523079, 116.477051],

    //地图工具初始化
    toolLIst: {

    }

}