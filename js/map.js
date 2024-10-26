class MapObj {
    constructor(options) {
        this.mapObj = null;
        this.options = options;

        this.satellite = null;
        this.image = null;
        this.terrain = null;

        this.polygonLayer = null;// 用于保存当前选中的面图层
        this.attribute = null;
        this.initMap();
    }

    initMap() {

        // 创建地图
        this.mapObj = L.map("map", this.options).setView(this.options.center);

        //卫星
        // const mapA = L.tileLayer(config["矢量底图"], { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] })
        // const mapA_T = L.tileLayer(config["矢量底图注记"], { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] })
        // this.satellite = L.layerGroup([mapA, mapA_T]);

        // //影像
        // const mapB = L.tileLayer(config["影像地图"], { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] })
        // const mapB_T = L.tileLayer(config["影像地图注记"], { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] })
        // this.image = L.layerGroup([mapB, mapB_T]);

        // //地形
        // const mapC = L.tileLayer(config["地形地图"], { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] })
        // const mapC_T = L.tileLayer(config["地形地图注记"], { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] })
        // this.terrain = L.layerGroup([mapC, mapC_T]);

        this.layerGroup = L.layerGroup().addTo(this.mapObj); // 初始化 layerGroup


        const featureLayer = L.esri.featureLayer({
            url: "http://localhost:6080/arcgis/rest/services/低效用地/现状/MapServer/0"
        }).addTo(this.mapObj);

        // 加载底图
        // this.switchLayers(this.satellite);
        // 添加控件
        this.addControls();
        //绑定点击事件
        this.bindClickEvent();

    }

    // 切换右下角工具栏的地图类型
    switchLayers(layer) {
        // 定义所有图层
        const layers = [this.satellite, this.image, this.terrain];

        // 遍历图层，移除所有图层，最后添加所选图层
        layers.forEach((currentLayer) => {
            if (this.mapObj.hasLayer(currentLayer)) {
                this.mapObj.removeLayer(currentLayer);
            }
        });
        this.mapObj.addLayer(layer);
    }

    addControls() {
        // 添加缩放控件
        if (this.options.zoomControl) {
            L.control.zoom({ position: 'bottomright' }).addTo(this.mapObj);
        }

        // // 添加绘制控件 初始化右上角绘制测量工具栏
        // if (this.options.toolListControl) {
        //     const toolList = $.extend(true, { position: 'bottomright' }, config.mapOptions.toolList);
        //     this.mapObj.pm.addControls(toolList);
        //     // 设置语言
        //     this.mapObj.pm.setLang('zh');
        // }
    }

    // 添加解析后的 GeoJSON 到地图上
    addGeoJSONToMap(layerData) {
        // 遍历每个图层数据对象
        const featureLayerUrl = layerData.url;  // 当前图层的 ArcGIS 服务地址

        // 使用 Esri Leaflet 插件加载 ArcGIS Feature Layer
        const featureLayer = L.esri.featureLayer({
            url: featureLayerUrl,
            style: layerData.style,
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, layerData.style);
            },
        });
        Object.assign(featureLayer, layerData);

        // 将图层添加到地图
        featureLayer.addTo(this.mapObj);
        this.layerGroup.addLayer(featureLayer);
        return featureLayer._leaflet_id;
    }


    // 获取指定 id 的图层
    getLayerById(layerId) {
        layerId = parseInt(layerId);
        return this.layerGroup.getLayer(layerId);
    }

    // 获取当前添加的图层
    getLayers() {
        return this.layerGroup.getLayers()
    }

    // 删除指定 id 的图层
    removeLayerById(layerId) {
        layerId = parseInt(layerId);
        if (this.layerGroup.hasLayer(layerId)) {
            this.layerGroup.removeLayer(layerId);
        }
    }

    // 恢复图层的初始样式
    restoreOriginalStyles() {
        if (this.polygonLayer) {
            if (this.polygonLayer) {
                this.mapObj.removeLayer(this.polygonLayer);
                this.polygonLayer = null; // 清空全局变量
            }
        }
    }

    addPolygonLayer(layer) {

        this.restoreOriginalStyles();

        if (!layer.feature || !layer.feature.geometry) {
            console.error("Invalid layer or geometry");
            return;
        }

        // 创建一个用来闪烁的多边形图层
        this.polygonLayer = L.geoJSON(layer.feature.geometry, {
            style: function () {
                return {
                    fillColor: 'blue',       // 填充颜色
                    fillOpacity: 0.3,        // 填充透明度
                    color: 'red',            // 边界颜色
                    weight: 2,               // 边界宽度
                    opacity: 0.8             // 边界透明度
                };
            },
            originalStyle: layer.options
        }).addTo(this.mapObj);

        const layerBounds = this.polygonLayer.getBounds();
        this.mapObj.fitBounds(layerBounds, {
            padding: [20, 20], // 地图边缘的内边距，可以根据需要调整
            maxZoom: 14        // 限制缩放级别，防止过度放大
        });

    }

    // 绑定点击事件
    bindClickEvent() {
        var that = this;

        // 绑定点击事件，收集所有点击到的图层的 feature 数据
        this.mapObj.on('click', function (e) {

            if (!$('.attribute-container').hasClass('active')) {
                return false;
            }
            let attributeData = []
            let queryPromises = [];

            // 遍历每个图层
            that.layerGroup.eachLayer((layer) => {
                if (layer.layerName == "行政区") return false;

                let collectedData = [];
                // 创建查询对象
                const query = L.esri.query({
                    url: layer.options.url  // 每个图层的服务 URL
                });

                let queryPromise;
                let type = layer._layers[0].feature.geometry.type;
                // 设置查询参数，返回属性字段，不返回几何信息
                if (type === 'Point') {
                    // 对于点状要素，使用 nearby 方法
                    queryPromise = new Promise((resolve, reject) => {
                        query.bboxIntersects(e.latlng)
                        query.run((error, featureCollection) => {
                            if (error) {
                                console.error("查询图层失败: ", error);
                                reject(error);
                                return;
                            }

                            // 如果有要素返回，收集它们的数据
                            if (featureCollection.features.length > 0) {
                                featureCollection.features.forEach((feature) => {
                                    collectedData.push({
                                        feature: feature, // 要素的属性数据
                                        options: layer._originalStyle // 图层的其他配置信息
                                    });
                                });
                                attributeData.push({
                                    layerId: layer.layerId,
                                    name: layer.layerName,
                                    subtitle: layer.subtitle,
                                    children: collectedData
                                });
                            }
                            resolve();
                        });
                    });
                } else {
                    // 对于线状或面状要素，使用 query 方法
                    queryPromise = new Promise((resolve, reject) => {
                        query.intersects(e.latlng)
                            .run((error, featureCollection) => {
                                if (error) {
                                    console.error("查询图层失败: ", error);
                                    reject(error);
                                    return;
                                }

                                // 如果有要素返回，收集它们的数据
                                if (featureCollection.features.length > 0) {
                                    featureCollection.features.forEach((feature) => {
                                        collectedData.push({
                                            feature: feature, // 要素的属性数据
                                            options: layer._originalStyle // 图层的其他配置信息
                                        });
                                    });
                                    attributeData.push({
                                        layerId: layer.layerId,
                                        name: layer.layerName,
                                        subtitle: layer.subtitle,
                                        children: collectedData
                                    });
                                }
                                resolve();
                            });
                    });
                }

                // 将每个查询的 Promise 加入数组
                queryPromises.push(queryPromise);
            });

            // 等待所有查询完成
            Promise.all(queryPromises).then(() => {
                that.restoreOriginalStyles();
                that.attribute = new Attribute(attributeData); // 实例化属性面板
                if (attributeData.length == 0) {
                    return false;
                }
                that.addPolygonLayer(attributeData[0].children[0])
            }).catch((err) => {
                console.error("查询过程中发生错误: ", err);
            });
        });

        // 阻止图层面板点击事件冒泡
        $('.layer-pop').on('click', function () {
            return false
        }).on('mouseover', function () {
            return false
        });
        //展开 切换地图页面
        $('.baselayer_btn.tool_btn').on('click', function () {
            $('.common-panel.layer-pop').show()
        })
        //关闭 切换底图页面
        $('.common-panel.layer-pop .close').on('click', function () {
            $('.common-panel.layer-pop').hide()
        })
        // 图层底图选择
        $('.layer-items a').on('click', function (e) {
            if ($(this).hasClass('active'))
                return false;
            $(this).siblings().removeClass('active')
            $(this).addClass('active')
            const id = $(this).attr('id')
            // 切换地图类型
            if (id == 'vec_type') {//矢量
                that.switchLayers(that.satellite)
            } else if (id == 'img_type') {//卫星
                that.switchLayers(that.image)
            } else if (id === 'ter_type') {//地形
                that.switchLayers(that.terrain)
            }
        });
    }
}