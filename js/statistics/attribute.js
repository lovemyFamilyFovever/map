class Attribute {
    constructor(data) {
        this.data = data;
        this.init();
    }
    // 初始化属性统计
    init() {
        this.destroy(); // 先销毁可能存在的旧实例
        $('.attribute-wrap .attribute-tree-container').html(this.getListHtml())
        $('.attribute_content').show()

        $('.attribute-tree-container').show();
        $('.attribute-info-container').hide();

        new PerfectScrollbar('.attribute-item-content');
        this.bindEvent();

    }
    // 销毁方法
    destroy() {
        // 移除已绑定的事件，避免多次绑定
        $('.attribute-wrap').off('click', '.dropdown_input');
        $('.attribute-wrap').off('click', '.attribute-title-container li');
        $('.attribute-wrap').off('click', '.select-attribute-toggle');
        $('.attribute-wrap').off('click', '.select-attribute-detail li');
        $('.attribute-wrap').off('click', '.attribute-info-back');
    }

    // 绑定事件
    bindEvent() {
        var that = this;

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

            var index = $(this).index();
            let number = 0;
            if (index == 0) {
                $('.select-attribute-info').show();
                that.data.forEach((item, i) => {
                    if (item.children.length > 0) {
                        number += item.children.length;
                    }
                });
            } else {
                $('.select-attribute-info:eq(' + (index - 1) + ')').show().siblings().hide();
                number = $('.select-attribute-info[data-index="' + (index - 1) + '"] b').text()
            }
            $('.attribute-title-count b').text(number)
        });

        // > 展开隐藏图层片段
        $('.attribute-wrap').on('click', '.select-attribute-toggle', function (e) {
            e.stopPropagation();
            e.preventDefault();
            $(this).siblings('.select-attribute-detail').toggleClass('active');
            this.classList.toggle('active');
        });

        // 点击图层属性列表，显示详细信息
        $('.attribute-wrap').on('click', '.select-attribute-detail li', function (e) {
            const i = $(this).closest('.select-attribute-info').attr('data-index');
            const j = $(this).attr('data-index');

            const data = that.data[i].children[j].feature.properties;
            const subtitle = that.data[i].children[j].feature.properties[that.data[i].subtitle];

            $('.attribute-tree-container').hide();
            $('.attribute-info-container').html(that.getInfoHtml(data, subtitle)).show();

            new PerfectScrollbar('.attribute-info-content');

            sfs.addPolygonLayer(that.data[i].children[j]);//高亮图层
        })

        //返回上一级
        $('.attribute-wrap').on('click', '.attribute-info-back', function (e) {
            $('.attribute-info-container').hide();
            $('.attribute-tree-container').show();
        });

        //隐藏 属性查询弹窗
        $('.attribute_content_close').on('click', function () {
            $('.attribute_content').hide();
            $('.attribute-container').removeClass('active')
            var mapContainer = document.getElementById('map');
            mapContainer.style.cursor = 'revert-layer';
            sfs.restoreOriginalStyles(); // 恢复所有图层的初始样式

            // 移除悬浮的文本
            $('#hover-text').remove();
            $(document).off('mousemove.hoverText'); // 取消鼠标移动事件
        })
    }

    getListHtml() {
        let number = 0;
        let attributeSelectTitleHtml = "";
        let attributeSelectInfoHtml = "";
        this.data.forEach((item, i) => {

            attributeSelectTitleHtml += `<li data-index="${item.name}">${item.name}</li>`
            if (item.children.length > 0) {
                attributeSelectInfoHtml += `
                 <div class="select-attribute-info" data-index="${i}">
                    <img src="imgs/right.svg" alt="展开隐藏" class="select-attribute-toggle active" />
                    <div class="select-attribute-title">
                        <img src="imgs/folder.svg" alt="folder" />
                        <span class="select-attribute-name">${item.name} (共 <b>${item.children.length}</b> 个图形)</span>
                    </div>
                    <div class="select-attribute-detail active">
                        <ul>`
                item.children.forEach((child, j) => {
                    number++;
                    attributeSelectInfoHtml += `
                    <li data-index="${j}" title="${child.feature.properties[item.subtitle]}" class="select-attribute-item">
                        <img src="imgs/图斑.svg" alt="图斑" /> ${child.feature.properties[item.subtitle]}
                    </li>`
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
        <div class="attribute-title-count"><span>找到的要素数: <b>${number}</b> </span></div>
        <div class="attribute-item-content">${attributeSelectInfoHtml}</div>`
    }

    getInfoHtml(data, subtitle) {
        let attributeInfoContentHtml = `
            <div class="attribute-info-item">
                <span class="attribute-info-name">属性</span>
                <span class="attribute-info-name">值</span>
            </div>`;

        for (var key in data) {
            attributeInfoContentHtml += `
            <div class="attribute-info-item">
                <span class="attribute-info-name">${key}</span>
                <span class="attribute-info-name">${data[key]}</span>
            </div>`
        }
        return `
            <div class="attribute-info-title">
                <span class="attribute-info-back"><img src="imgs/tree.svg" alt="图斑" />图形列表</span>
                <img src="imgs/right.svg" alt="间隔" />
                <span class="attribute-info-title-name" title="${subtitle}"> ${subtitle}</span>
            </div>
            <div class="attribute-info-content">${attributeInfoContentHtml}</div>`
    }
}