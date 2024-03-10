class Modal {
    constructor(title, type, clickCallback) {
        this.title = title;
        this.type = type;
        this.clickCallback = clickCallback;

        this.renderTable();
        this.bindEvents();
    }

    renderTable() {

        let modalHtml = template('modal-html', {
            "type": this.type,
            "title": this.title,
        })
        $('body').append(modalHtml)
        this.initModal()
    }

    //初始化
    initModal() {
        this.container = $('.modal-mask')
        this.container.show()
    }

    bindEvents() {
        // // 监听复选框的变化事件
        // this.container.on('change', '#addDateCheckbox', () => {
        //     let currentTitle = this.input.val()
        //     let date = new Date()
        //     if ($('#addDateCheckbox').is(":checked")) {
        //         this.input.val(`${currentTitle} ${date.toLocaleDateString()}`)
        //     } else {
        //         let updatedTitle = currentTitle.replace(/\d{1,2}\/\d{1,2}\/\d{4}/, ''); // 使用正则表达式匹配日期部分
        //         this.input.val(updatedTitle.trim());
        //     }
        // });

        //取消-关闭弹窗
        this.container.on('click', '.modal-dialog-close,.modal-cancel-btn', (event) => {
            $('.modal-mask').remove()
        });

        //确定-下载文件
        this.container.on('click', '.modal-confirm-btn', (event) => {
            $('.modal-mask').remove()

            if (typeof this.clickCallback === 'function') {
                this.clickCallback(this.container.find('.modal-input').val())
            }
        })
    }
}
