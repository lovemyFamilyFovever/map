class Modal {
    constructor(title, type, clickCallback) {
        this.title = title;
        this.type = type;
        this.clickCallback = clickCallback;

        this.renderTable();
        this.bindEvents();
    }

    renderTable() {
        let modalHtml = this.getHtml(this.type, this.title)
        $('body').append(modalHtml)
        this.container = $('.modal-mask')
        this.container.show()
    }

    bindEvents() {
        this.container.on('click', '.modal-dialog-close, .modal-cancel-btn', this.closeModal.bind(this));
        this.container.on('click', '.modal-confirm-btn', this.confirmModal.bind(this));
    }

    closeModal(e) {
        this.container.remove();
    }

    confirmModal() {
        this.container.remove();
        if (typeof this.clickCallback === 'function') {
            const inputValue = this.container.find('.modal-input').val();
            this.clickCallback(inputValue);
        }
    }
    getHtml(type, title) {
        return `
        <div class="modal-mask">
            <div class="modal-dialog">
                <div class="modal-title">
                    <img src="imgs/editFile.svg">设置文件名称 ${type}
                    <div class="modal-dialog-close close_btn"><img src="imgs/close.svg" alt="关闭" title="关闭"></div>
                </div>
                <div class="modal-content">
                    <input type="text" placeholder="" class="modal-input" value="${title}">
                </div>
                <div class="modal-btns">
                    <div class="addDate">
                        <input type="checkbox" name="addDate" id="addDateCheckbox">
                        <label id="lab" for="addDateCheckbox">添加日期</label>
                    </div>
                    <div class="modal-btn-group">
                        <a class="modal-cancel-btn modal-btn">取消</a>
                        <a class="modal-confirm-btn modal-btn">确定</a>
                    </div>

                </div>
            </div>
        </div>
        `
    }
}
