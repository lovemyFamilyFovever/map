//渲染指定图层的表格
class Statistics {
    constructor() {
        this.data = [];
        this.customTable = null;
        this.columns = Array.from(sfs.layerStore.keys())
        this.init();
    }
    init() {
        this.destroy(); // 先销毁可能存在的旧实例
        if (sfs.layerStore.size == 0) {
            $(".statistics-items").append(`
                <div class="empty_table">
                    <div class="empty_table_image">
                        <img src="imgs/empty_table.svg" />
                    </div>
                <div class="empty_table_text">请先加载图层!</div>
            </div>`);
        } else {
            $(".statistics-items .empty_table").hide();

            this.data = this.findLayersByIds(this.columns)
            this.customTable = new CustomTable(this.data[0]);//实例化自定义图表
            this.renderTitle();
            this.renderContent(this.data[0]);
            this.bindEvent();
            $('.statistics-content-body .loading-container').hide();
        }
    }

    // 销毁方法
    destroy() {
        // 移除已绑定的事件，避免多次绑定
        $('.statistics-title-input').off('click',)
        $('.statistics-layer-container .dropdown_list').off('click', 'li')
        $('.statistics-items').off('click', '.statistics-item-target .target-input')
        $('.statistics-items').off('click', '.statistics-item-target li')
    }

    renderTitle() {
        //渲染图层下拉选项的列表
        let liHtml = "";
        this.data.forEach((item, index) => {
            liHtml += `<li data-layerid="${item.layerId}"><span>${item.layerName}</span></li>`;
        });
        $('.statistics-layer-container ul').html(liHtml);
        $('.statistics-title-input').val(this.data[0].layerName)
        $('.statistics-title-input').attr('data-layerid', this.data[0].layerId);
    }

    renderContent(obj) {
        let html = ""
        obj.columns.forEach((item, index) => {
            if (item.statistics)
                html += this.renderHtml(item, index);
        });
        $(".statistics-items").html(html);
    }

    //绑定事件
    bindEvent() {
        let that = this;
        //展示下拉列表-图层
        $('.statistics-title-input').on('click', function () {
            $('.dropdown_list').hide();
            $('.statistics-layer-container .dropdown_list').toggle();
        });

        //选择图层 统计查询列表
        $('.statistics-layer-container .dropdown_list').on('click', 'li', function () {
            const layerName = $(this).find('span').text();
            if ($('.statistics-title-input').val() == layerName) return;

            const index = $(this).index();
            $('.statistics-title-input').val(layerName);
            $('.statistics-title-input').attr('data-layerid', that.data[index].layerId);
            $('.statistics-title-input').attr('data-index', index);
            $('.statistics-layer-container .dropdown_list').hide();
            that.renderContent(that.data[index]);

            that.customTable = new CustomTable(that.data[index]);//实例化自定义图表
        });

        //展示下拉列表-具体值
        $('.statistics-items').on('click', '.statistics-item-target .target-input', function () {
            $('.dropdown_list').hide();
            const field = $(this).attr('data-field');
            let index = $(this).attr('data-index');

            const columns = that.getColumnUnique(field)
            let html = "";
            html += `
                <li>
                    <input type="checkbox" id="cbx-column-static-all-${index++}" class="column-static-all" data-field="全部" />
                    <span>全部</span>
                </li>`;
            columns.forEach(item => {
                if (item)
                    html += `
                    <li>
                        <input type="checkbox" class="column-static" data-field="${item}" />
                        <span>${item}</span>
                    </li>`;
            });

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

        //分组字段 按钮 + 统计字段 按钮
        $('.group-input input,.statistic-input input').on('click', function () {
            $('.dropdown_list').hide();
            const $dropdown_list = $(this).parent().find('.dropdown_list');
            let html = "";

            const layerId = $('.statistics-title-input').attr('data-layerid');

            that.data.forEach((item, index) => {
                if (item.layerId == layerId) {
                    item.columns.forEach((column, index) => {
                        html += `<li data-field="${column.field}"><span>${column.title}</span></li>`;
                    });
                }
            });

            $dropdown_list.find('ul').html(html)
            $dropdown_list.toggle();
            new PerfectScrollbar($dropdown_list[0]);
        })

        //统计类型 按钮 + 图表类型 按钮
        $('.calc-input input,.chart-input input').on('click', function () {
            $('.dropdown_list').hide();
            $(this).siblings('.dropdown_list').toggle();
        })
        //分组字段 选择 + 统计字段 选择 + 统计类型 选择 + 图表类型 选择
        $('.group-input,.statistic-input,.calc-input,.chart-input ').on('click', 'li', function () {
            $(this).parent().parent().siblings('.dropdown_input').val($(this).text()).attr('data-field', $(this).attr('data-field'));
            $(this).parent().parent().toggle();
        });


        //重置 按钮
        $('.statistics-content-footer .reset').on('click', () => {
            $('.statistics-item .dropdown_input').val("");

            const index = $('.statistics-title-input').attr('data-index');
            that.customTable = new CustomTable(that.data[index]);//实例化自定义图表
        });

        //查询 按钮
        $('.statistics-content-footer .confirm').on('click', that.debounce(() => {

            let groupColumn = true;
            $('.statistics-group-wrap-content .dropdown_input').each((index, item) => {
                if (item.value.trim() == "") {
                    groupColumn = false;
                    return false;
                }
            });

            if (!groupColumn) {

                let uniqueCategories = [];
                $('.statistics-item').each((index, item) => {
                    const $target = $(item).find('.target-input');

                    if ($target.val()) {
                        let values = [];
                        $(item).find('.column-static').each(function () {
                            if ($(this).is(':checked') && $(this).attr('data-field') != "全部") {
                                values.push($(this).attr('data-field'))
                            }
                        });
                        uniqueCategories.push({
                            field: $target.attr('data-field'),
                            type: 'in',
                            value: values
                        })
                    }
                });
                that.customTable.filterTable(uniqueCategories);
            } else {
                // select column1,count(column2) from table  where column2="a" and column='b' group by column1;
                // requestData = {
                //     selectColumn: "column1",
                //     calcColumn: "column2",
                //     calcType: "count",
                //     groupColumn: "column1",
                //     where: {
                //         column2: ["a","b"],
                //         column: ["c"],
                //         // 可能还有别的更多的列
                //     }
                // }
                let groupFields = {
                    tableName: $('.statistics-title-input').attr('data-layerid'),
                    selectColumn: $('.group-input .dropdown_input').attr('data-field'),
                    selectColumnName: $('.group-input .dropdown_input').val(),
                    calcColumn: $('.statistic-input .dropdown_input').attr('data-field'),
                    calcType: $('.calc-input .dropdown_input').attr('data-field'),
                    calcTypeName: $('.calc-input .dropdown_input').val(),
                    chartType: $('.chart-input .dropdown_input').attr('data-field'),
                    where: {}
                };

                $('.statistics-item-target .target-input').each((index, item) => {
                    const value = $(item).val();
                    if (value && value !== "全部") {
                        if (!groupFields.where.hasOwnProperty($(item).data('field')))
                            groupFields.where[$(item).data('field')] = [];
                        groupFields.where[$(item).data('field')] = ($(item).val().split(','));
                    }
                });
                new CustomTable(null, groupFields)
            }

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
                        <ul></ul>
                    </div>
                </div>
            </div>`
    }

    findLayersByIds(ids, layerList = config.layerList) {
        const result = [];
        function searchLayers(layers) {
            for (let layer of layers) {
                if (ids.includes(layer.layerId)) {
                    if (layer.layerId !== "XZQ") {
                        result.push(layer);
                    }
                }
                if (layer.children) {
                    searchLayers(layer.children);
                }
            }
        }
        searchLayers(layerList);
        return result;
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