// map.js
class MapObj {
    constructor(options) {
        this.mapObj = null;
        this.options = null;
        this.satellite = null;
        this.image = null;
        this.terrain = null;
        this.layerStore = new Map(); // 新增 layerGroup 属性
        this.initMap(options);
    }

    initMap(options) {
        const defaultOptions = {
            toolListControl: false,
            zoomControl: true,
            scaleControl: false
        };
        this.options = $.extend({}, defaultOptions, options);
        // 创建地图
        this.mapObj = L.map("map", config.mapOptions).setView(config.center);

        //卫星
        const mapA = L.tileLayer(config["矢量底图"], { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] })
        const mapA_T = L.tileLayer(config["矢量底图注记"], { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] })
        this.satellite = L.layerGroup([mapA, mapA_T]);

        //影像
        const mapB = L.tileLayer(config["影像地图"], { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] })
        const mapB_T = L.tileLayer(config["影像地图注记"], { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] })
        this.image = L.layerGroup([mapB, mapB_T]);

        //地形
        const mapC = L.tileLayer(config["地形地图"], { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] })
        const mapC_T = L.tileLayer(config["地形地图注记"], { subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"] })
        this.terrain = L.layerGroup([mapC, mapC_T]);

        this.layerGroup = L.layerGroup().addTo(this.mapObj); // 初始化 layerGroup

        // 加载底图
        this.loadBaseMap();
        // 添加控件
        this.addControls();
        //绑定点击事件
        this.bindClickEvent();
    }
    // 加载底图
    loadBaseMap() {
        this.switchLayers(this.satellite);
    }

    // 切换右下角工具栏的地图类型
    switchLayers(layer) {
        this.mapObj.removeLayer(this.satellite);
        this.mapObj.removeLayer(this.terrain);
        this.mapObj.removeLayer(this.image);
        this.mapObj.addLayer(layer);
    }

    addControls() {
        // 添加缩放控件
        if (this.options.zoomControl) {
            L.control.zoom({ position: 'bottomright' }).addTo(this.mapObj);
        }
        // 添加比例尺控件 
        if (this.options.scaleControl) {
            L.control.scale().addTo(this.mapObj);
        }
        // 添加绘制控件 初始化右上角绘制测量工具栏
        if (this.options.toolListControl) {
            const toolList = $.extend(true, { position: 'topright' }, config.mapOptions.toolList);
            this.mapObj.pm.addControls(toolList);
            // 设置语言
            this.mapObj.pm.setLang('zh');
        }

        if (this.options.mousemoveLatlng) {
            // 定义一个变量存储坐标信息
            var coords = L.control();
            // 添加一个div来显示坐标  
            coords.onAdd = function () {
                let _this = this;
                _this._div = L.DomUtil.create('div', 'coords');
                return _this._div;
            };
            coords.update = function (evt) {
                coords._div.innerHTML =
                    '经度:' + evt.latlng.lng + '<br>' +
                    '纬度:' + evt.latlng.lat;
            };
            this.mapObj.on('mousemove', coords.update);

            // 添加控件到地图
            coords.addTo(this.mapObj);
            coords.setPosition('bottomleft');
        }
    }

    // 添加解析后的 GeoJSON 到地图上
    addGeoJSONToMap(geoJson, objectData) {

        proj4.defs("EPSG:4539", "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=39500000 +y_0=0 +datum=CGCS2000 +units=m +no_defs"); // CGCS2000_3_Degree_GK_Zone_39
        proj4.defs("EPSG:3857", "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"); // Web Mercator
        proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs"); // WGS84 经纬度

        // 转换 GeoJSON 坐标
        var transformedGeoJson = JSON.parse(JSON.stringify(geoJson));
        const geoJsonLayer = L.geoJSON(transformedGeoJson, {
            coordsToLatLng: function (coords) {

                // Convert CGCS2000 coordinates to EPSG:3857
                const fromProj = proj4("EPSG:4539");
                const toProj = proj4("EPSG:3857");

                // Convert coordinates
                const point = proj4(fromProj, toProj, [coords[0], coords[1]]);
                return L.CRS.EPSG3857.unproject(L.point(point[0], point[1]));
            },
            pointToLayer: function (feature, latlng) {
                // 自定义点的样式，设置成一个黑点
                return L.circleMarker(latlng, {
                    radius: 5,    // 点的大小
                    fillColor: "#000000", // 填充颜色：黑色
                    color: "transparent", // 边框颜色：黑色
                    weight: 0,   // 边框宽度
                    opacity: 1,  // 边框透明度
                });
            },
            style: function () {
                return objectData.style;
            }
        })
        geoJsonLayer.layerId = objectData.layerId; // 给图层添加唯一的 layerId
        geoJsonLayer.layerName = objectData.layerName; // 给图层添layerName

        geoJsonLayer.addTo(this.mapObj);
        this.layerStore.set(objectData.layerId, geoJsonLayer); // 将图层存储到 layerStore 中

        var center = geoJsonLayer.getBounds().getCenter();
        this.mapObj.setView(center, 13);   // 设置地图视图到图层中心点，并设置一个合适的缩放级别 13
    }

    // 获取当前添加的图层
    getLayers() {
        return Array.from(this.layerStore.values());
    }

    // 新增图层的方法
    addLayer(layer) {
        this.mapObj.addLayer(layer);
    }

    // 删除指定 id 的图层
    removeLayerById(layerId) {
        const layer = this.layerStore.get(layerId);
        if (layer) {
            this.mapObj.removeLayer(layer);
            this.layerStore.delete(layerId); // 从存储中删除
        }
    }

    //将某个图层放在最上层
    bringLayerToFront(layerId) {
        const layer = this.layerGroup.getLayer(layerId);
        if (layer) {
            layer.bringToFront();
        }
    }
    //将某个图层放到最底层
    bringLayerToBack(layerId) {
        const layer = this.layerGroup.getLayer(layerId);
        if (layer) {
            layer.bringToBack();
        }
    }
    //设置某个图层的样式
    setLayerStyle(layerId, style) {
        const layer = this.layerGroup.getLayer(layerId);
        if (layer) {
            layer.setStyle(style);
        }
    }
    // 绑定点击事件
    bindClickEvent() {
        var that = this;

        // 监听地图的点击事件
        this.mapObj.on('click', function (e) {
            let attributeSelectTitleHtml = "";
            let attributeSelectInfoHtml = "";

            var clickedLayers = [];

            const layers = Array.from(that.layerStore.values());

            layers.forEach(function (layer, index) {
                attributeSelectTitleHtml += `<li data-index="${index}">${layer.layerName}</li>`

                let attributeSelectInfoItemHtml = "";
                let start = 0;
                layer.eachLayer(function (layerItem) {
                    let infoHtml = "";
                    if (layerItem instanceof L.Polygon || layerItem instanceof L.Polyline) {
                        // 检查点击的点是否在这个图层内
                        if (layerItem.getBounds().contains(e.latlng)) {
                            clickedLayers.push({
                                layerItem: layerItem,
                            });
                            var properties = layerItem.feature.properties || {};
                            for (var key in properties) {
                                infoHtml += `<p><strong>${key}:</strong> ${properties[key] || '-'}</p>`
                            }
                        }
                    } else if (layerItem instanceof L.Marker || layerItem instanceof L.CircleMarker) {
                        // 检查点击的位置是否足够接近这个标记点
                        const distanceThreshold = 100; // 以米为单位的距离阈值
                        const distance = e.latlng.distanceTo(layerItem.getLatLng());
                        if (distance <= distanceThreshold) {
                            clickedLayers.push({
                                layerItem: layerItem,
                            });
                            var properties = layerItem.feature.properties || {};
                            for (var key in properties) {
                                infoHtml += `<p><strong>${key}:</strong> ${properties[key] || '-'}</p>`
                            }
                        }
                    }
                    if (infoHtml != "") {
                        attributeSelectInfoItemHtml += `
                            <div class="select-attribute-detail-toggle">${layer.layerName}-${start++}</div>
                            <div class="select-attribute-detail">
                                ${infoHtml}
                            </div>`
                    }
                });
                if (attributeSelectInfoItemHtml == "") {
                    attributeSelectInfoHtml += `
                    <div class="select-attribute-info">
                        <div class="empty_table">
                            <div class="empty_table_image"><img src="imgs/empty_table.svg" /></div>
                            <div class="empty_table_text">没有查询到相关数据!</div>
                        </div>
                    </div>`
                } else {
                    attributeSelectInfoHtml += `<div class="select-attribute-info">${attributeSelectInfoItemHtml}</div>`
                }
            });

            // dropdown-input-container
            // 如果有多个图层被点击，显示它们的相关信息
            if (clickedLayers.length > 0) {
                $('.attribute_wrap').html(`
                    <div class="attribute-title-container dropdown-input-container">
                        <input type="text" placeholder="请选择图层" readonly class="attribute-title-input dropdown_input">
                        <img src="imgs/dropdown.svg" class="dropdown_svg">
                        <div class="dropdown_list"><ul>${attributeSelectTitleHtml}</ul></div>
                    </div>
                    <div class="attribute-item-content">${attributeSelectInfoHtml}</div>
                `);

                $('.attribute-title-input').val($('.attribute-title-container li:eq(0)').text());// 默认显示第一个图层的名称

                $('.select-attribute-info:eq(0)').show();
                $('.select-attribute-info:eq(0) .select-attribute-detail:eq(0)').addClass('active');
                $('.attribute_content,.right-tool').show()
                new PerfectScrollbar('.attribute-item-content');
            }
        });

        // 点击关闭按钮
        $('.attribute_wrap').on('click', '.close-btn', function () {
            $('.attribute_wrap').hide();
        });

        // 点击图层名称，显示图层属性列表
        $('.attribute_wrap').on('click', '.dropdown_input', function () {
            $(this).siblings('.dropdown_list').toggle();
        });

        // 点击图层名称，切换图层
        $('.attribute_wrap').on('click', '.attribute-title-container li', function () {
            if ($('.attribute-title-input').val() == $(this).text()) {
                $('.attribute_content .dropdown_list').toggle();
                return;
            }

            $('.attribute-title-input').val($(this).text());
            $('.attribute_content .dropdown_list').toggle();

            var index = $(this).data('index');
            $('.select-attribute-detail').removeClass('active');
            $('.select-attribute-info').hide();
            $('.select-attribute-info:eq(' + index + ')').show();

            $('.select-attribute-info:eq(' + index + ') .select-attribute-detail:eq(0)').addClass('active');
        });

        // 点击图层属性列表，展开图层片段
        $('.attribute_wrap').on('click', '.select-attribute-detail-toggle', function () {
            const selector = $(this).next('.select-attribute-detail');
            // 动态获取内容的高度
            if (selector.hasClass('active')) {
                selector.removeClass('active');
            } else {
                $(this).siblings('.select-attribute-detail').removeClass('active')
                selector.toggleClass('active');
            }
        });


        // 添加定位按钮点击事件
        $('.located_btn').on('click', function () {
            // 使用 Leaflet 的 locate 方法获取用户当前位置
            that.mapObj.locate({ setView: true })
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