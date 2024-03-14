class Notification {
    constructor(content) {

        this.content = content;

        this.renderTable();
        this.bindEvents();
    }
    renderTable() {

        this.container = $(this.getHtml());
        $('.notification-container').append(this.container);
        this.container.addClass('animated-notification')

        let t = setTimeout(() => {
            this.closeModal()
        }, 3000);
    }

    bindEvents() {
        this.container.find('.notification_close').on('click', () => {
            this.closeModal()
        })
    }

    closeModal(e) {
        this.container.remove();
    }

    getHtml() {
        return `
        <div class="notification" >
            <button type="button" class="notification_close"><img src="imgs/close.svg" alt="关闭" title="关闭" /></button>
            ${this.content}
        </div>`
    }
}
