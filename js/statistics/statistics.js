//渲染指定图层的表格
class Statistics {
    constructor() {
        this.layer = null;
        this.customTable = null;
        this.metadataFields = null;
        this.init();
    }

    init() {
        $(".statistics-items .empty_table").hide();

        this.renderTitle();
        this.renderContent(this.layer._leaflet_id);
        this.bindEvent();
        $('.statistics-content-body .loading-container').hide();
    }

    renderTitle() {
        this.layer = null
        //渲染图层下拉选项的列表
        let liHtml = "";

        sfs.layerGroup.eachLayer((layer) => {
            if (layer.layerId == "XZQ") {
                return;
            }
            if (this.layer == null) {
                this.layer = layer
            }
            liHtml += `<li data-leafletID="${layer._leaflet_id}"><span>${layer.layerName}</span></li>`;
        });
        if (this.layer == null) {
            $('.statistics-content .data-body').hide();
            $('.statistics-content .empty_table').css('display', 'flex');
        } else {

            $('.statistics-content .data-body').show();
            $('.statistics-content .empty_table').css('display', 'none');

            $('.statistics-title-container ul').html(liHtml);
            $('.statistics-title-input').val(this.layer.layerName).attr('data-leafletID', this.layer._leaflet_id);
            this.metadataFields = this.getMetadataFields();
            this.renderContent(this.layer._leaflet_id);
            this.customTable = new CustomTable(this.layer);//实例化自定义图表
        }
    }

    renderContent(id) {
        const layer = sfs.layerGroup.getLayer(id);
        let html = ""
        layer.columns.forEach((item, index) => {
            if (item.statistics && item.title.indexOf("面积") == -1)
                html += this.renderHtml(item, index);
        });
        $(".statistics-items").html(html);
    }

    getMetadataFields() {
        this.layer.metadata((error, metadata) => {
            if (error) {
                console.error('Error fetching metadata:', error);
                return;
            }
            this.metadataFields = metadata.fields;
        });
    }

    //绑定事件
    bindEvent() {
        let that = this;
        //展示下拉列表-图层
        $('.statistics-title-input').on('click', function () {
            $('.dropdown_list').hide();
            $('.statistics-title-container .dropdown_list').toggle();
        });

        //选择图层 统计查询列表
        $('.statistics-title-container .dropdown_list').on('click', 'li', function () {
            const layerName = $(this).find('span').text();
            if ($('.statistics-title-input').val() == layerName) {
                $('.statistics-title-container .dropdown_list').hide();
            } else {
                $('.statistics-title-input').val(layerName).attr('data-leafletID', $(this).attr('data-leafletID'));

                $('.statistics-title-container .dropdown_list').hide();

                that.layer = sfs.layerGroup.getLayer($(this).attr('data-leafletID'));

                that.renderContent($(this).attr('data-leafletID'));
                that.customTable = new CustomTable(that.layer);//实例化自定义图表
                that.getMetadataFields();

                $('.statistics-group-wrap-content .dropdown_input').val("");
            }
        });

        //搜索
        $('.statistics-items').on('click', '.fuzzy_search_container img', function () {
            var text = $(this).parent().find('input').val();
            if (text == "") {
                $(this).parent().parent().find('li').show();
                return;
            }
            $(this).parent().parent().find('li').each((index, item) => {
                if (item.innerText.indexOf(text) > -1) {
                    $(item).show();
                } else {
                    $(item).hide();
                }
            });
        });

        // 绑定输入框的键盘事件
        $('.statistics-items').on('keypress', '.fuzzy_search_container input', function (e) {
            if (e.which === 13) {
                $('.statistics-items .fuzzy_search_container img').click();
            }
        });


        //展示下拉列表-具体值
        $('.statistics-items').on('click', '.statistics-item-target .target-input', function () {
            $('.dropdown_list').hide();
            const field = $(this).attr('data-field');
            let index = $(this).attr('data-index');

            const columns = that.getColumnUnique(field)
            if (columns.length < 10) {
                $(this).siblings('.dropdown_list').find('.fuzzy_search_container').hide();
            } else {
                $(this).siblings('.dropdown_list').find('.fuzzy_search_container').show();
            }

            let html = "";

            if (columns.length > 1) {
                html += `
                <li>
                    <input type="checkbox" id="cbx-column-static-all-${index++}" class="column-static-all" data-field="全部" />
                    <span>全部</span>
                </li>`;
            }
            columns.forEach(item => {
                if (item.trim() != "")
                    html += `
                    <li title="${item}">
                        <input type="checkbox" class="column-static" data-field="${item}" />
                        <div>${item}</div>
                    </li>`;
            });
            if (columns.length <= 5) {
                $(this).siblings('.dropdown_list').find('ul').css({
                    'flex-direction': 'column',
                    'width': '177px'
                });
            } else {
                $(this).siblings('.dropdown_list').find('ul').css({
                    'flex-direction': 'unset',
                    'width': '354px'
                });
            }

            $(this).siblings('.dropdown_list').find('ul').html(html)
            $(this).siblings('.dropdown_list').toggle();
            new PerfectScrollbar($(this).siblings('.dropdown_list')[0]);
        });
        //选择具体值
        $('.statistics-items').on('click', '.statistics-item-target li', function () {
            let $parent = $(this).parent().parent();
            if ($(this).find('input').attr('data-field') == "全部") {
                var status = $parent.find('.column-static-all').prop('checked')
                $parent.find('.column-static').prop('checked', status);
                $parent.siblings('.target-input').val(status ? "全部" : "")
            } else {
                var allChecked = true;
                $parent.find('.column-static').each(function (e) {
                    if (!$(this).is(':checked')) {
                        allChecked = false;
                        return false; // 提前退出循环
                    }
                });

                if (allChecked) {
                    $parent.find('.column-static-all').prop('checked', true);
                    $parent.siblings('.target-input').val("全部")
                } else {
                    $parent.find('.column-static-all').prop('checked', false);
                    let nameString = "";
                    $parent.find('.column-static').each(function () {
                        if ($(this).is(':checked')) {
                            if ($(this).attr('data-field') != "全部")
                                nameString += $(this).attr('data-field') + ',';
                        }
                    });
                    nameString = nameString.substring(0, nameString.length - 1);
                    $parent.siblings('.target-input').val(nameString)
                }
            }
        });

        // 分组字段 按钮 + 统计字段 按钮
        $('.group-input input, .statistic-input input').on('click', function () {
            // 隐藏所有下拉列表
            $('.dropdown_list').hide();

            const $dropdown_list = $(this).parent().find('.dropdown_list');

            const name = $(this).parent().parent().hasClass('group-input') ? "分组字段" : "统计字段";

            let html = "";
            that.layer.columns.forEach(item => {
                that.metadataFields.forEach(field => {
                    if (field.alias == item.field && item.statistics) {
                        if (name == "分组字段" && field.type == "esriFieldTypeDouble") {
                            return false;
                        } else {
                            html += `<li data-field="${field.name}" data-type="${field.type}"><span>${item.title}</span></li>`;
                        }
                    }
                });
            });
            // 更新下拉列表的内容并显示
            $dropdown_list.find('ul').html(html);
            $dropdown_list.toggle(); // 切换显示状态
            new PerfectScrollbar($dropdown_list[0]); // 更新滚动条
        });

        //统计类型 按钮 + 图表类型 按钮
        $('.calc-input input,.chart-input input').on('click', function () {
            $('.dropdown_list').hide();

            if ($(this).parent().parent().hasClass('calc-input')) {
                if ($('.statistic-input .dropdown_input').val() == "") {
                    return false;
                }
                const type = $('.statistic-input').find('.dropdown_input').attr('data-type');
                if (type == "esriFieldTypeDouble") {
                    $('.calc-input ul').empty().append(`<li data-field="AVG">平均值</li><li data-field="SUM">求和</li>`)
                } else {
                    $('.calc-input ul').empty().append(`<li data-field="COUNT">计数</li>`)
                }
            }

            $(this).siblings('.dropdown_list').toggle();
        })
        //分组字段 选择 + 统计字段 选择 + 统计类型 选择 + 图表类型 选择
        $('.group-input,.statistic-input,.calc-input,.chart-input ').on('click', 'li', function () {
            const $parent = $(this).parent().parent();
            $parent.siblings('.dropdown_input').val($(this).text()).attr('data-field', $(this).attr('data-field'));

            if ($(this).attr('data-type')) {
                const data_type = $parent.siblings('.dropdown_input').attr('data-type');
                if (data_type != $(this).attr('data-type')) {
                    $parent.siblings('.dropdown_input').attr('data-type', $(this).attr('data-type'));
                    $('.calc-input .dropdown_input').val("");
                }
            }
            $parent.toggle();
        });

        //重置 按钮
        $('.statistics-content-footer .reset').on('click', () => {
            $('.statistics-item .dropdown_input').val("");
            $('.fuzzy_search_input').val("");
            that.customTable = new CustomTable(that.layer);//实例化自定义图表
        });

        //查询 按钮
        $('.statistics-content-footer .confirm').on('click', that.debounce(() => {

            const leafletID = $('.statistics-title-input').attr('data-leafletID');

            let uniqueCategories = "";
            if ($('.statistics-item').length > 0) {
                $('.statistics-item').each((i, item) => {
                    const $target = $(item).find('.target-input');

                    if ($target.val()) {
                        let values = [];
                        $(item).find('.column-static').each(function () {
                            if ($(this).is(':checked') && $(this).attr('data-field') != "全部") {
                                values.push($(this).attr('data-field'))
                            }
                        });
                        uniqueCategories += `${$target.attr('data-field')} IN (${values.map(value => `'${value}'`).join(",")}) AND `;
                    }
                });
                uniqueCategories = uniqueCategories.substring(0, uniqueCategories.length - 5);
            }

            let groupColumn = true;
            let statisticsParams = null;
            $('.statistics-group-wrap-content .dropdown_input').each((index, item) => {
                if (item.value.trim() == "") {
                    groupColumn = false;
                    return false;
                }
            });
            if (groupColumn) {
                statisticsParams = {
                    selectColumn: $('.group-input .dropdown_input').attr('data-field'),
                    selectColumnName: $('.group-input .dropdown_input').val(),
                    satisticsField: $('.statistic-input .dropdown_input').attr('data-field'),
                    satisticsFieldName: $('.statistic-input .dropdown_input').val(),
                    statisticsType: $('.calc-input .dropdown_input').attr('data-field'),
                    chartType: $('.chart-input .dropdown_input').attr('data-field'),
                };
            }

            that.customTable = new CustomTable(sfs.layerGroup.getLayer(leafletID), uniqueCategories, statisticsParams);//实例化自定义图表
            $('.table-content').show();
        }, 300));
    }

    renderHtml(item, index = 0) {
        return `
            <div class="statistics-item">
                <div class="statistics-item-column dropdown-input-container" data-field="${item.field}">${item.title}</div>
                <div class="statistics-item-target dropdown-input-container">
                <input type="text" placeholder="请选择" data-field="${item.field}" data-index="${index}" class="target-input dropdown_input" readonly>
                    <img src="imgs/dropdown.svg" class="dropdown_svg">
                    <div class="dropdown_list">
                        <div class="fuzzy_search_container">
                            <input type="text" class="fuzzy_search_input" placeholder="请输入关键字搜索">
                            <img src="imgs/search.svg" class="fuzzy_search_icon">
                        </div>
                        <ul></ul>
                    </div>
                </div>
            </div>`
    }

    getColumnUnique(field) {
        return this.customTable.getColumnUniqueValues(field)
    }

    // 防抖函数
    debounce(fn, delay) {
        let timer = null;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        };
    }
}