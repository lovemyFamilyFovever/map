var config = {
    defaultCatalog: 'PC',
    version: "0.35",
    projectName: "徐州经济技术开发区工业企业低效用地分析系统",

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
        toolList: {
            rotateMode: false,          // 不显示旋转模式工具
            drawMarker: false,          // 不显示绘制点的工具
            drawPolygon: true,          // 显示绘制多边形的工具
            drawPolyline: true,         // 显示绘制线段的工具
            drawCircle: true,           // 不显示绘制圆的工具
            drawCircleMarker: false,    // 不显示绘制圆形标记的工具
            drawPolyline: false,        // 显示绘制线段的工具
            editMode: false,            // 显示编辑模式工具
            dragMode: true,             // 不显示拖拽模式工具
            cutPolygon: false,          // 不显示剪切多边形的工具
            removalMode: true,          // 显示删除工具
            drawText: false,            // 隐藏插入文本的控件
        }

    },
    center: [33.523079, 116.477051],

    "矢量底图": 'http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=94062428027398766a1d0f3000b5dc6c',
    "矢量底图注记": 'http://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=94062428027398766a1d0f3000b5dc6c',

    "影像地图": 'http://t{s}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=94062428027398766a1d0f3000b5dc6c',
    "影像地图注记": 'http://t0.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=94062428027398766a1d0f3000b5dc6c',

    "地形地图": 'http://t0.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=94062428027398766a1d0f3000b5dc6c',
    "地形地图注记": 'http://t0.tianditu.gov.cn/DataServer?T=cta_w&x={x}&y={y}&l={z}&tk=94062428027398766a1d0f3000b5dc6c',

    layerList: [{
        layerId: "XZQ",
        layerName: "行政区",
        url: "http://150.158.76.25:5000/load_shp?file_path=XZQ",
        show: false,
        style: {
            color: "red",
            weight: 2,
            opacity: 0.8
        },
        children: [{
            layerId: "CJXZQ",
            layerName: "村级行政区",
            url: "http://150.158.76.25:5000/load_shp?file_path=CJXZQ",
            show: false,
            style: {
                color: "#BBFFFF",
                weight: 2,
                opacity: 0.8
            }
        }, {
            layerId: "ZJXZQ",
            layerName: "镇级行政区",
            url: "http://150.158.76.25:5000/load_shp?file_path=ZJXZQ",
            show: false,
            style: {
                color: "#D81159",
                weight: 2,
                opacity: 0.8
            }
        }]
    }, {
        layerId: "XZJT",
        layerName: "交通",
        url: "http://150.158.76.25:5000/load_shp?file_path=XZJT",
        show: true,
        style: {
            color: "#804d36",
            weight: 2,
            opacity: 0.8
        }
    }, {
        layerId: "GYYD",
        layerName: "工业用地",
        url: "http://150.158.76.25:5000/load_shp?file_path=GYYD",
        show: false,
        style: {
            color: "blue",
            weight: 2,
            opacity: 0.8
        },
        children: [{
            layerId: "DXGYYD",
            layerName: "低效工业用地",
            url: "http://150.158.76.25:5000/load_shp?file_path=低效工业用地",
            show: false,
            style: {
                color: "#4FB0C6",
                weight: 2,
                opacity: 0.8
            }
        }, {
            layerId: "PQPHDK",
            layerName: "片区盘活地块",
            url: "http://150.158.76.25:5000/load_shp?file_path=片区盘活地块",
            show: false,
            style: {
                color: "#0000FF",
                weight: 2,
                opacity: 0.8
            }
        }]
    }, {
        layerId: "PQFW",
        layerName: "片区范围",
        url: "http://150.158.76.25:5000/load_shp?file_path=片区范围",
        show: false,
        style: {
            color: "#00FA9A",
            weight: 2,
            opacity: 0.8
        }
    }, {
        layerId: "QYWZ",
        layerName: "企业位置",
        url: "http://150.158.76.25:5000/load_shp?file_path=QYWZ",
        show: true,
        style: {
            color: "#4169E1",
            weight: 2,
            opacity: 0.8
        }
    }],
    statisticsItems: [
        { column: "所在乡镇", text: "所在乡镇", type: "string" },
        // { column: "土地使用权人", text: "土地使用权人", type: "string" },
        { column: "土地面积", text: "土地面积(亩)", type: "number" },
        { column: "建设状况", text: "建设状况", type: "string" },
        { column: "是否一地多企", text: "是否一地多企", type: "string" },
        { column: "是否规上企业用地", text: "是否规上企业用地", type: "string" },
        { column: "是否低效用地", text: "是否低效用地", type: "string" },
        { column: "盘活方式", text: "盘活方式", type: "string" },
        { column: "实施时间", text: "实施时间", type: "string" },
        { column: "规划用途", text: "规划用途", type: "string" },
        // { column: "使用期限", text: "使用权限", type: "string" },
    ]
}

