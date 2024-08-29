//渲染指定图层的表格
class Statistics {
    constructor() {
        this.data = [];
        this.columns = Array.from(sfs.layerStore.keys())
        this.init();
    }
    init() {
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
            this.renderTitle();
            this.bindEvent();
            $('.statistics-content-body .loading-container').hide();
        }
    }

    renderTitle() {
        //渲染图层下拉选项的列表
        let liHtml = "";
        this.data.forEach((item, index) => {
            liHtml += `<li data-layer-index="${index}"><span>${item.layerName}</span></li>`;
        });

        $('.statistics-layer-container ul').html(liHtml);
        $('.statistics-title-input').val(this.data[0].layerName)

        this.renderContent(this.data[0]);
    }

    renderContent(obj) {
        let html = ""
        obj.columns.forEach((item, index) => {
            if (item.statistics)
                html += this.renderHtml(item.column, item.type, index);
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
            const index = $(this).index();
            const layerName = $(this).find('span').text();
            $('.statistics-title-input').val(layerName);
            $('.statistics-layer-container .dropdown_list').hide();
            that.renderContent(that.data[index]);
        });


        //展示下拉列表-具体值
        $('.statistics-items').on('click', '.statistics-item-target .target-input', function () {
            $('.statistics-items .dropdown_list').hide();
            const column = $(this).attr('data-column');
            let index = $(this).attr('data-index');

            const columns = customTable.getColumnUniqueValues(column).filter(item => item.trim() != "")
            let html = "";
            html += `
                <li>
                    <input type="checkbox" id="cbx-column-static-all-${index++}" class="column-static-all" data-column="全部" />
                    <span>全部</span>
                </li>`;
            columns.forEach(item => {
                html += `
                <li>
                    <input type="checkbox" class="column-static" data-column="${item}" />
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
            if ($(this).find('input').attr('data-column') == "全部") {
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
                            if ($(this).attr('data-column') != "全部")
                                nameString += $(this).attr('data-column') + ',';
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
        $('.statistics-content-footer .confirm').on('click', () => {
            let uniqueCategories = [];
            $('.statistics-item').each((index, item) => {
                const $target = $(item).find('.target-input');

                if ($target.val()) {
                    let values = [];
                    $(item).find('.column-static').each(function () {
                        if ($(this).is(':checked') && $(this).attr('data-column') != "全部") {
                            values.push($(this).attr('data-column'))
                        }
                    });
                    uniqueCategories.push({
                        field: $target.attr('data-column'),
                        type: 'in',
                        value: values
                    })
                }
            });
            customTable.filterTable(uniqueCategories);

            $('.table-content').show();
            $('.table-container').addClass('active');
        });
    }

    renderHtml(column = "", type = "", index = 0) {
        return `
                <div class="statistics-item">
                    <div class="statistics-item-column dropdown-input-container">
                         ${column}
                    </div>
                    <div class="statistics-item-target dropdown-input-container">
                    <input type="text" placeholder="请选择" data-column="${column}" data-index="${index}" class="target-input dropdown_input">
                        <img src="imgs/dropdown.svg" class="dropdown_svg">
                        <div class="dropdown_list">
                            <ul></ul>
                        </div>
                    </div>
                </div>`
    }


    findLayersByIds(ids, layerList = config.layerList) {
        const result = [];
        for (const layer of layerList) {
            if (ids.includes(layer.layerId)) {
                result.push({ ...layer, children: null });
            }
            if (layer.children) {
                const childrenResult = this.findLayersByIds(ids, layer.children);
                if (childrenResult.length > 0) {
                    layer.children = childrenResult;
                    result.push(layer);
                }
            }
        }
        return result;
    }


}