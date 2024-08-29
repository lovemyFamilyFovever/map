class Attribute {
    constructor(data) {
        this.data = data;
        this.init();
        this.bindEvent();
    }

    // 初始化属性统计
    init() {
        $('.attribute-wrap .attribute-tree-container').html(this.getListHtml())
        $('.attribute_content').show()
        new PerfectScrollbar('.attribute-item-content');
    }

    // 绑定事件
    bindEvent() {

        // 点击图层名称，显示图层属性列表
        $('.attribute-wrap').on('click', '.dropdown_input', function () {
            $(this).siblings('.dropdown_list').toggle();
        });

        // 点击图层名称，切换图层
        $('.attribute-wrap').on('click', '.attribute-title-container li', function () {
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
        $('.attribute-wrap').on('click', '.select-attribute-toggle', function () {
            const selector = $(this).next('.select-attribute-detail');
            // 动态获取内容的高度
            if (selector.hasClass('active')) {
                selector.removeClass('active');
            } else {
                $(this).siblings('.select-attribute-detail').removeClass('active')
                selector.toggleClass('active');
            }
        });

    }

    getListHtml() {
        let attributeSelectTitleHtml = "";
        let attributeSelectInfoHtml = "";
        this.data.forEach(item => {
            attributeSelectTitleHtml += `<li data-index="${item.name}">${item.name}</li>`
            if (item.children.length > 0) {
                attributeSelectInfoHtml += `
                 <div class="select-attribute-info">
                    <img src="imgs/right.svg" alt="" class="select-attribute-toggle active" />
                    <div class="select-attribute-title">
                        <img src="imgs/folder.svg" alt="folder" />
                        <span class="select-attribute-name">${item.name}</span>
                    </div>
                    <div class="select-attribute-detail">
                        <ul>`
                item.children.forEach(child => {
                    attributeSelectInfoHtml += `<li>${child.feature.properties[item.subtitle]}</li>`
                })
                attributeSelectInfoHtml += `
                        </ul>
                    </div>
                </div>`
            }
        });
        return `
        <div class="attribute-title-container dropdown-input-container">
            <span>选择图层:</span>
            <div>
                <input type="text" placeholder="请选择图层" readonly class="attribute-title-input dropdown_input" value="所有图层">
                <img src="imgs/dropdown.svg" class="dropdown_svg">
                <div class="dropdown_list">
                    <ul>
                        <li>所有图层</li>
                        ${attributeSelectTitleHtml}
                    </ul>
                </div>
            </div>
        </div>
        <div class="attribute-item-content">${attributeSelectInfoHtml}</div>
        `
    }





}