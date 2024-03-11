
window.utils = {

    // 通用的Ajax函数
    ajaxRequest: function (options) {
        // 默认参数
        const defaults = {
            type: "GET",
            url: "",
            data: {},
            dataType: "json",
            success: function () { },
            error: function () { },
        };

        // 合并参数
        const settings = $.extend({}, defaults, options);

        // 发送 AJAX 请求
        $.ajax({
            type: settings.type,
            url: settings.url,
            data: settings.data,
            dataType: settings.dataType,
            success: function (response) {
                // 执行成功回调函数
                settings.success(response);
            },
            error: function (xhr, status, error) {
                // 执行错误回调函数
                settings.error(xhr, status, error);
            },
        });
    },

    //将对象中的键值对转换为 URL 查询字符串
    encodeQueryData: function (data) {
        var ret = [];
        for (var d in data) {
            if (Array.isArray(data[d])) {
                // 数组类型参数
                for (var i = 0; i < data[d].length; i++) {
                    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(JSON.stringify(data[d][i])));
                }
            } else {
                // 普通参数
                ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
            }
        }
        return ret.join("&");
    },
    //查询结果中获取总要素数 
    getMapInfo: async function (url) {
        // 设置查询参数 
        var params = {
            where: '1=1',
            returnGeometry: false,
            outFields: "SHAPE_Area",
            f: 'json',
            // 添加返回要素总数参数
            // outStatistics: [{
            //     'statisticType': 'sum',
            //     'onStatisticField': 'SHAPE_Area'
            // }],
        };
        // 构造请求URL
        const queryUrl = `${url}/query?${this.encodeQueryData(params)}`;
        try {
            // 使用 await 获取响应数据
            const response = await fetch(queryUrl);
            const json = await response.json();

            var totalArea = 0;
            var count = 0;
            if (json.error == undefined) {
                // 计算总面积
                for (var i = 0; i < json.features.length; i++) {
                    totalArea += (json.features[i].attributes.Shape_Area || json.features[i].attributes.SHAPE_Area);
                }
                // 获取要素总数
                count = json.features.length;
                totalArea = totalArea.toFixed(2) || 0
            }
            return {
                totalArea,
                count
            };
        } catch (error) {
            console.log(error);
            return {
                totalArea: 0,
                count: 0
            };
        }
    },
    //获取显示的图层
    getShowLayerList: function () {
        return config.layerList.filter(layer => layer.showStatus !== 0);
    },

    //获取指定图层的要显示的列
    getOutFieldsKey: function (index) {
        return Object.keys(config.layerList[index]["outFields"]);
    }

}

