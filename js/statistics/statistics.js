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
            liHtml += `<li data-layer-index="${index}"><span>${item.layerName}</span></li>`;
        });
        $('.statistics-layer-container ul').html(liHtml);
        $('.statistics-title-input').val(this.data[0].layerName)
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
            $('.statistics-layer-container .dropdown_list').show();
        });

        //选择图层 统计查询列表
        $('.statistics-layer-container .dropdown_list').on('click', 'li', function () {
            const layerName = $(this).find('span').text();
            if ($('.statistics-title-input').val() == layerName) return;

            const index = $(this).index();
            $('.statistics-title-input').val(layerName);
            $('.statistics-layer-container .dropdown_list').hide();
            that.renderContent(that.data[index]);

            that.customTable = new CustomTable(that.data[index]);//实例化自定义图表
        });


        //展示下拉列表-具体值
        $('.statistics-items').on('click', '.statistics-item-target .target-input', function () {
            $('.statistics-items .dropdown_list').hide();
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

        //重置 按钮
        $('.statistics-content-footer .reset').on('click', () => {
            $('.statistics-item .dropdown_input').val("");
            $('.statistics-item .dropdown_list ul').empty();
        });

        //查询 按钮
        $('.statistics-content-footer .confirm').on('click', that.debounce(() => {
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

            $('.table-content').show();
            $('.table-container').addClass('active');
        }, 300));
    }

    renderHtml(item, index = 0) {
        return `
                <div class="statistics-item">
                    <div class="statistics-item-column dropdown-input-container">
                         ${item.column}
                    </div>
                    <div class="statistics-item-target dropdown-input-container">
                    <input type="text" placeholder="请选择" data-field="${item.field}" data-index="${index}" class="target-input dropdown_input">
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
                    result.push(layer);
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