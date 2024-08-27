//渲染指定图层的表格
class Statistics {
    constructor() {
        this.init();
        this.statisticsScroll = null;
        this.currentShow = [];
    }

    init() {
        $(".statistics-items").append(this.renderHtml());

        $('.statistics-content-body').append(`
            <div class="statistics-add-btn">
                    <img src="imgs/add.svg" alt="添加">
                    增加查询条件
                </div>`
        );
        $('.statistics-content').append(`
            <div class="statistics-content-footer">
                <div class="search_btn reset">重置</div>
                <div class="search_btn confirm">查询</div>
            </div>`
        );
        this.bindEvent();
        $('.statistics-content-body .loading-container').hide();
    }

    //绑定事件
    bindEvent() {
        //展示下拉列表-字段
        $('.statistics-items').on('click', '.statistics-item-column input', function (e) {
            const $ul = $(this).parent().find('.dropdown_list ul');
            if ($ul.html() == "") {
                let html = "";
                config.statisticsItems.forEach(item => {

                    // 查找除当前 input 外所有相同类名的 input 元素
                    const $allInputs = $('.column-input.dropdown_input');
                    const $otherInputs = $allInputs.not($(this));
                    let foundInOtherInputs = false;
                    $otherInputs.each(function () {
                        if ($(this).val() === item.text) {
                            foundInOtherInputs = true;
                            return false; // 跳出当前循环
                        }
                    });
                    if (!foundInOtherInputs) {
                        html += `<li data-type="${item.type}" data-column="${item.column}">${item.text}</li>`;
                    }
                });
                $ul.html(html)

                var dom = $(this).parent().find('.dropdown_list');
                new PerfectScrollbar(dom[0]);
            }
            $(this).siblings('.dropdown_list').toggle();
        });
        //选择查询字段
        $('.statistics-items').on('click', '.statistics-item-column li', function () {
            const $dom = $(this).parent().parent();
            var value = $dom.siblings('input').val();

            let type = $(this).attr('data-type');
            let column = $(this).attr('data-column');
            let name = $(this).text().trim();

            if (value !== name) {
                if (type) {
                    $dom.siblings('input').attr('data-type', type).attr('data-column', column);
                }
                $dom.siblings('input').val(name)
                $dom.parent().siblings('.statistics-item-condition').find('input').val("");
                $dom.parent().siblings('.statistics-item-condition').find('li').show();

                $dom.parent().siblings('.statistics-item-target').find('input').val("").prop('readonly', true);
                $dom.parent().siblings('.statistics-item-target').find('.dropdown_list').find('ul').empty();
            }
            $dom.hide();
        });

        //展示下拉列表-条件
        $('.statistics-items').on('click', '.statistics-item-condition input', function () {
            $('.dropdown_list').hide();
            const $column = $(this).parent().siblings('.statistics-item-column').find('input');
            const name = $column.val();
            const type = $column.attr('data-type');

            if (name !== "") {
                if (type == "string") {
                    $(this).parent().find('.than').hide();
                    $(this).parent().find('.than-equal').hide();
                } else {
                    $(this).parent().find('.contain').hide();
                }
                $(this).siblings('.dropdown_list').toggle();
            }
        });
        //选择条件
        $('.statistics-items').on('click', '.statistics-item-condition li', function () {
            let name = $(this).text().trim();
            $(this).parent().parent().siblings('input').val(name)
            const parent = $(this).parent().parent().parent()

            if (name == "=" || name == "&lt;" || name == "&gt;") {
                parent.siblings('.statistics-item-target').find('input').prop('readonly', true);
            } else {
                parent.siblings('.statistics-item-target').find('input').prop('readonly', false);
            }
            parent.siblings('.statistics-item-target').find('input').val("");
            parent.siblings('.statistics-item-target').find('.dropdown_list').find('ul').empty();

            $(this).parent().parent().hide();
        });

        //展示下拉列表-具体值
        $('.statistics-items').on('click', '.statistics-item-target .target-input', function () {
            $('.dropdown_list').hide();
            const $input = $(this).parent().siblings('.statistics-item-column').find('input');
            const condition = $(this).parent().siblings('.statistics-item-condition').find('input').val();
            const column = $input.attr('data-column');
            const type = $input.attr('data-type');
            const name = $input.val();

            if (name == "" || condition == "") return;

            if (type == "string") {
                const columns = customTable.getColumnUniqueValues(column).filter(item => item.trim() != "")
                let html = "";
                if (condition == "包含") {
                    let count = $('.statistics-item-target').length;
                    html += `
                            <li>
                                <input type="checkbox" id="cbx-column-static-all-${count++}" class="column-static-all" data-name="全部" />
                                <span>全部</span>
                            </li>`;
                    columns.forEach((item, i) => {
                        html += `
                                <li>
                                    <input type="checkbox" class="column-static" data-name="${item}" />
                                    <span>${item}</span>
                                </li>`;
                    });
                } else {
                    columns.forEach(item => {
                        html += `<li>${item}</li>`;
                    });
                }
                $(this).parent().find('.dropdown_list ul').html(html)

                var dom = $(this).parent().find('.dropdown_list');
                new PerfectScrollbar(dom[0]);
                $(this).siblings('.dropdown_list').toggle();
            } else {
                $(this).parent().find('.dropdown_input').prop('readonly', false);
            }

        });
        //选择具体值
        $('.statistics-items').on('click', '.statistics-item-target li', function () {
            let $parent = $(this).parent().parent();
            if ($parent.parent().siblings('.statistics-item-condition').find('input').val() == "包含") {
                if ($(this).find('input').attr('data-name') == "全部") {
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
                                if ($(this).attr('data-name') != "全部")
                                    nameString += $(this).attr('data-name') + ',';
                            }
                        });
                        nameString = nameString.substring(0, nameString.length - 1);
                        $parent.siblings('.target-input').val(nameString)
                    }
                }
            } else {
                $parent.siblings('.target-input').val($(this).text().trim())
                $parent.toggle();
            }
        });

        //增加查询条件
        $('.statistics-add-btn').on('click', () => {
            $(".statistics-items").append(this.renderHtml());
            $('.statistics-item').length == 8 ? $('.statistics-add-btn').hide() : $('.statistics-add-btn').show();
        });

        //重置 按钮
        $('.statistics-content-footer .reset').on('click', () => {
            $('.statistics-item').slice(0).remove();
            $('.statistics-add-btn').show();
            $(".statistics-items").append(this.renderHtml());
        });

        //查询 按钮
        $('.statistics-content-footer .confirm').on('click', () => {
            let uniqueCategories = [];
            $('.statistics-item').each((index, item) => {
                const $column = $(item).find('.column-input');
                const $condition = $(item).find('.condition-input');
                const $target = $(item).find('.target-input');

                const condition = $condition.val() == "包含" ? "in" : $condition.val();

                if ($column.val() && $condition.val() && $target.val()) {
                    let values = "";
                    if ($condition.val() == "包含") {
                        values = [];
                        $(item).find('.column-static').each(function () {
                            if ($(this).is(':checked') && $(this).attr('data-name') != "全部") {
                                values.push($(this).attr('data-name'))
                            }
                        });
                    } else {
                        values = $target.val();
                    }

                    uniqueCategories.push({
                        field: $column.attr('data-column'),
                        type: condition,
                        value: values
                    })
                }
            });
            customTable.filterTable(uniqueCategories);

            $('.table-content').show();
            $('.table-container').addClass('active');

        });

        //删除
        $(".statistics-items").on("click", '.statistics-item-delete', function () {
            $(this).parent().remove();
            $('.statistics-item').length < 8 ? $('.statistics-add-btn').show() : $('.statistics-add-btn').hide();
        });
    }

    renderHtml() {
        return `
                <div class="statistics-item">
                    <div class="statistics-item-column dropdown-input-container">
                        <input type="text" placeholder="请选择" readonly class="column-input dropdown_input">
                        <img src="imgs/dropdown.svg" class="dropdown_svg">
                        <div class="dropdown_list">
                            <ul></ul>
                        </div>
                    </div>
                    <div class="statistics-item-condition dropdown-input-container">
                        <input type="text" placeholder="选择" readonly class="condition-input dropdown_input">
                        <img src="imgs/dropdown.svg" class="dropdown_svg">
                        <div class="dropdown_list">
                            <ul>
                                <li class="contain">包含</li>
                                <li class="equal">=</li>
                                <li class="than">&gt;</li>
                                <li class="than-equal">&lt;</li>
                            </ul>
                        </div>
                    </div>
                    <div class="statistics-item-target dropdown-input-container">
                        <input type="text" placeholder="请选择" readonly class="target-input dropdown_input">
                        <img src="imgs/dropdown.svg" class="dropdown_svg">
                        <div class="dropdown_list">
                            <ul></ul>
                        </div>
                    </div>
                    <div class="statistics-item-delete">
                        <img src="imgs/clear.png" alt="删除">
                    </div>
                </div>`
    }
}