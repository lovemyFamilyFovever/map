const preUrl = "http://192.168.1.2:6080/arcgis/rest/services/低效用地/"
var config = {
    defaultCatalog: 'PC',
    version: "0.35",
    projectName: "徐州经济技术开发区工业企业低效用地分析系统",
    // preUrl: "http://localhost:6080/arcgis/rest/services/低效用地/",
    mapOptions: {
        center: [34.283876502969214, 117.37861633300783],
        minZoom: 1, //最小缩放值
        maxZoom: 18, //最大缩放值
        zoom: 13, //初始缩放值
        zoomControl: true, //是否启用地图缩放控件
        // scaleControl: true,//是否启用比例尺控件 
        toolListControl: true, //是否启用地图测量工具
        initTooltips: true,//是否初始化右上角的工具栏
        mousemoveLatlng: true,//是否显示鼠标滑动的坐标
        attributionControl: false, //是否启用地图属性控件
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
            dragMode: false,             // 不显示拖拽模式工具
            cutPolygon: false,          // 不显示剪切多边形的工具
            removalMode: false,          // 显示删除工具
            drawText: false,            // 隐藏插入文本的控件
        },
    },

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
        url: preUrl + "XZQ/MapServer/0",
        show: true,
        style: {
            fillColor: "#3388ff",
            color: "#3388ff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.2
        },
        columns: [
            //title: 表格列名，field: 数据库字段名，statistics: 是否统计
            { title: "行政区名称", field: "XZQMC", statistics: true },
            { title: "长度", field: "Shape_Length", statistics: true },
            { title: "面积", field: "Shape_Area", statistics: false },
        ],
        children: [{
            layerId: "ZJXZQ",
            layerName: "镇级行政区",
            subtitle: "XZQMC",
            url: preUrl + "GYYD/MapServer/0",
            show: false,
            style: {
                color: "#D81159",
                weight: 2,
                opacity: 1
            },
            columns: [
                //title: 表格列名，field: 数据库字段名，statistics: 是否统计
                { title: "行政区名称", field: "XZQMC", statistics: true },
                { title: "导出面积", field: "DCMJ", statistics: false },
                { title: "建设面积", field: "JSMJ", statistics: false },
                { title: "县区代码", field: "县区代码", statistics: true },
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
                opacity: 1
            },
            columns: [
                //title: 表格列名，field: 数据库字段名，statistics: 是否统计
                { title: "地均单位名称", field: "DJDWMC", statistics: true },
                { title: "导出面积", field: "DCMJ", statistics: false },
                { title: "建设面积", field: "JSMJ", statistics: false },
                { title: "县区代码", field: "县区代码", statistics: true },
            ],
        }]
    }, {
        layerId: "XZJT",
        layerName: "交通",
        subtitle: "用地类型",
        url: preUrl + "XZJT/MapServer/0",
        show: true,
        style: {
            color: "#795548",
            weight: 4
        },
        columns: [
            //title: 表格列名，field: 数据库字段名，statistics: 是否统计
            { title: "用地类型", field: "用地类型", statistics: true },
            { title: "名称", field: "MC", statistics: true },
            { title: "备注", field: "备注", statistics: false },
            { title: "原名称备份", field: "原名称备份", statistics: false },
        ],
    }, {
        layerId: "GYYD",
        layerName: "工业用地",
        subtitle: "TDSYQR",
        url: preUrl + "GYYD/MapServer/0",
        show: true,
        style: {
            fillColor: "#3388ff",
            color: "#3388ff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.2
        },
        columns: [
            //title: 表格列名，field: 数据库字段名，statistics: 是否统计
            { title: "所在乡镇", field: "SZX", statistics: true },
            { title: "土地使用权人", field: "TDSYQR", statistics: true },
            { title: "土地面积（亩）", field: "TDMJ", statistics: true },
            { title: "建设状况", field: "JSZK", statistics: true },
            { title: "是否一地多企", field: "SFYDDQ", statistics: true },
            { title: "是否规上企业用地", field: "SFGSQYYD", statistics: true },
            { title: "是否低效用地", field: "SFDXYD", statistics: true },
            { title: "盘活方式", field: "PHFS", statistics: true },
            { title: "实施时间", field: "SSSJ", statistics: true },
            { title: "规划用途", field: "GHYT", statistics: true },
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
                opacity: 1
            },
            columns: [
                //title: 表格列名，field: 数据库字段名，statistics: 是否统计
                { title: "行政村", field: "SZC", statistics: true },
                { title: "土地使用权人", field: "TDSYQR", statistics: true },
                { title: "用地单位", field: "YDDW", statistics: false },
                { title: "规划用途", field: "GHYT", statistics: true },
                { title: "土地面积", field: "TDMJ", statistics: false },
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
                opacity: 1
            },
            columns: [
                //title: 表格列名，field: 数据库字段名，statistics: 是否统计
                { title: "土地整理", field: "TDZL", statistics: false },
                { title: "所在乡镇", field: "SZXZ", statistics: true },
                { title: "行政村", field: "SZC", statistics: true },
                { title: "土地使用权人", field: "TDSYQR", statistics: false },
                { title: "用地单位", field: "YDDW", statistics: true },
                { title: "使用权类型", field: "SYQLX", statistics: true },
                { title: "规划用途", field: "GHYT", statistics: true },
                { title: "土地面积", field: "TDMJ", statistics: false },
                { title: "批准面积", field: "PZMJ", statistics: false },
                { title: "工业面积", field: "GYMJ", statistics: false },
                { title: "已建成面积", field: "YJCMJ", statistics: false },
                { title: "建设状况", field: "JSZK", statistics: true },
                { title: "建筑面积", field: "JZMJ", statistics: false },
                { title: "容积率", field: "RJL", statistics: false },
                { title: "是否规上企业用地", field: "SFGSQYYD", statistics: true },
                { title: "用地类型", field: "YDLX", statistics: true },

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
            opacity: 1
        },
        columns: [
            //title: 表格列名，field: 数据库字段名，statistics: 是否统计
            { title: "盘活片区名", field: "盘活片区名", statistics: true },
            { title: "行政区名称", field: "行政区名称", statistics: false },
        ]
    }, {
        layerId: "QYWZ",
        layerName: "企业位置",
        subtitle: "YDDWMC",
        url: preUrl + "QYWZ/MapServer/0",
        show: false,
        style: {
            radius: 5,
            fillColor: "blue",
            weight: 1,
            opacity: 1
        },
        columns: [
            //title: 表格列名，field: 数据库字段名，statistics: 是否统计
            { title: "所在县", field: "SZX", statistics: true },
            { title: "所在村", field: "SZC", statistics: true },
            { title: "所在乡镇", field: "SZXZ", statistics: true },
            { title: "建设状况", field: "JSZK", statistics: true },
            { title: "是否规上企业", field: "SFGSQY", statistics: true },
            { title: "是否租用厂", field: "SFZYC", statistics: true },
            { title: "土地使用权人", field: "TDSYQR", statistics: false },
            { title: "是否高新技术产业", field: "SFGXJSQY", statistics: true },
            { title: "是否低效用地企业", field: "SFDX", statistics: true },
            { title: "上缴税费2021", field: "SJSF2021", statistics: false },
            { title: "上缴税费2022", field: "SJSF2022", statistics: false },
            { title: "上缴税费2023", field: "SJSF2023", statistics: false },
            { title: "行业类别", field: "HYLB", statistics: true },
        ]
    }],

}

