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
            drawRectangle: false,        // 不显示绘制矩形的工具
            drawPolygon: false,          // 显示绘制多边形的工具
            drawPolyline: false,         // 显示绘制线段的工具
            drawCircle: false,           // 不显示绘制圆的工具
            drawCircleMarker: false,    // 不显示绘制圆形标记的工具
            drawPolyline: false,        // 显示绘制线段的工具
            editMode: false,            // 显示编辑模式工具
            dragMode: true,             // 不显示拖拽模式工具
            cutPolygon: false,          // 不显示剪切多边形的工具
            removalMode: false,          // 显示删除工具
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
        subtitle: "XZQMC",
        url: "http://150.158.76.25:5000/load_shp?file_path=XZQ",
        show: true,
        style: {
            color: "red",
            weight: 2,
            opacity: 0.8
        },
        columns: [
            //column: 表格列名，field: 数据库字段名，statistics: 是否统计
            { column: "行政区名称", field: "XZQMC", statistics: true },
            { column: "长度", field: "Shape_Length", statistics: true },
            { column: "面积", field: "Shape_Area", statistics: false },
        ],
        children: [{
            layerId: "ZJXZQ",
            layerName: "镇级行政区",
            subtitle: "XZQMC",
            url: "http://150.158.76.25:5000/load_shp?file_path=ZJXZQ",
            show: false,
            style: {
                color: "#D81159",
                weight: 2,
                opacity: 0.8
            },
            columns: [
                //column: 表格列名，field: 数据库字段名，statistics: 是否统计
                { column: "行政区名称", field: "XZQMC", statistics: true },
                { column: "导出面积", field: "DCMJ", statistics: false },
                { column: "建设面积", field: "JSMJ", statistics: false },
                { column: "县区代码", field: "县区代码", statistics: true },
            ],
        }, {
            layerId: "CJXZQ",
            layerName: "村级行政区",
            subtitle: "ZLDWMC",
            url: "http://150.158.76.25:5000/load_shp?file_path=CJXZQ",
            show: false,
            style: {
                color: "#BBFFFF",
                weight: 2,
                opacity: 0.8
            },
            columns: [
                //column: 表格列名，field: 数据库字段名，statistics: 是否统计
                { column: "地均单位名称", field: "DJDWMC", statistics: true },
                { column: "导出面积", field: "DCMJ", statistics: false },
                { column: "建设面积", field: "JSMJ", statistics: false },
                { column: "县区代码", field: "县区代码", statistics: true },
            ],
        }]
    }, {
        layerId: "XZJT",
        layerName: "交通",
        subtitle: "用地类型",
        url: "http://150.158.76.25:5000/load_shp?file_path=XZJT",
        show: true,
        style: {
            color: "#804d36",
            weight: 2,
            opacity: 0.8
        }, columns: [
            //column: 表格列名，field: 数据库字段名，statistics: 是否统计
            { column: "用地类型", field: "用地类型", statistics: true },
            { column: "名称", field: "MC", statistics: true },
            { column: "备注", field: "备注", statistics: false },
            { column: "原名称备份", field: "原名称备份", statistics: false },
        ],
    }, {
        layerId: "GYYD",
        layerName: "工业用地",
        subtitle: "TDSYQR",
        url: "http://150.158.76.25:5000/load_shp?file_path=GYYD",
        show: false,
        style: {
            color: "blue",
            weight: 2,
            opacity: 0.8
        },
        columns: [
            //column: 表格列名，field: 数据库字段名，statistics: 是否统计
            { column: "所在乡镇", field: "所在乡镇", statistics: true },
            { column: "土地使用权人", field: "土地使用权人", statistics: true },
            { column: "土地面积", field: "土地面积(亩)", statistics: false },
            { column: "建设状况", field: "建设状况", statistics: true },
            { column: "是否一地多企", field: "是否一地多企", statistics: true },
            { column: "是否规上企业用地", field: "是否规上企业用地", statistics: true },
            { column: "是否低效用地", field: "是否低效用地", statistics: true },
            { column: "盘活方式", field: "盘活方式", statistics: true },
            { column: "实施时间", field: "实施时间", statistics: true },
            { column: "规划用途", field: "规划用途", statistics: true },
            { column: "使用期限", field: "使用权限", statistics: true },
        ],
        children: [{
            layerId: "低效工业用地",
            layerName: "低效工业用地",
            subtitle: "PHPQMC",
            url: "http://150.158.76.25:5000/load_shp?file_path=低效工业用地",
            show: false,
            style: {
                color: "#4FB0C6",
                weight: 2,
                opacity: 0.8
            },
            columns: [
                //column: 表格列名，field: 数据库字段名，statistics: 是否统计
                { column: "行政村", field: "SZC", statistics: true },
                { column: "TDSYQR", field: "TDSYQR", statistics: true },
                { column: "用地单位", field: "YDDW", statistics: false },
                { column: "规划用途", field: "GHYT", statistics: true },
                { column: "土地面积", field: "TDMJ", statistics: false },
            ],
        }, {
            layerId: "片区盘活地块",
            layerName: "片区盘活地块",
            subtitle: "PHPQMC",
            url: "http://150.158.76.25:5000/load_shp?file_path=片区盘活地块",
            show: false,
            style: {
                color: "#0000FF",
                weight: 2,
                opacity: 0.8
            },
            columns: [
                //column: 表格列名，field: 数据库字段名，statistics: 是否统计
                { column: "行政村", field: "SZC", statistics: true },
                { column: "所在乡镇", field: "SZXZ", statistics: true },
            ],
        }]
    }, {
        layerId: "片区范围",
        layerName: "片区范围",
        subtitle: "盘活片区名",
        url: "http://150.158.76.25:5000/load_shp?file_path=片区范围",
        show: false,
        style: {
            color: "#00FA9A",
            weight: 2,
            opacity: 0.8
        },
        columns: [
            //column: 表格列名，field: 数据库字段名，statistics: 是否统计
            { column: "盘活片区名", field: "盘活片区名", statistics: true },
            { column: "行政区名称", field: "行政区名称", statistics: false },
        ]
    }, {
        layerId: "QYWZ",
        layerName: "企业位置",
        subtitle: "YDDWMC",
        url: "http://150.158.76.25:5000/load_shp?file_path=QYWZ",
        show: false,
        style: {
            color: "#4169E1",
            weight: 2,
            opacity: 0.8
        },
        columns: [
            //column: 表格列名，field: 数据库字段名，statistics: 是否统计
            { column: "所在县", field: "SZX", statistics: true },
            { column: "所在村", field: "SZC", statistics: true },
            { column: "所在乡镇", field: "SZXZ", statistics: true },
            { column: "建设状况", field: "JSZK", statistics: true },
            { column: "是否规上企业", field: "SFGSQY", statistics: true },
            { column: "是否租用厂", field: "SFZYC", statistics: true },
            { column: "土地使用权人", field: "TDSYQR", statistics: true },
            { column: "是否高新技术产业", field: "SFGXJSQY", statistics: true },
            { column: "是否低效用地企业", field: "SFDX", statistics: true },
            { column: "上缴税费2021", field: "SJSF2021", statistics: false },
            { column: "上缴税费2022", field: "SJSF2022", statistics: false },
            { column: "上缴税费2023", field: "SJSF2023", statistics: false },
            { column: "行业类别", field: "HYLB", statistics: true },
        ]
    }],

}

