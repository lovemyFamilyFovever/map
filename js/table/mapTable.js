//渲染指定图层的表格
class CustomTable {
    constructor(data, title, index) {
        this.data = data;
        this.title = title;
        this.index = index;

        this.getData();
        this.initTable();
    }

    getData() {
        let arr = []
        // 增加判断内容  如果数据为空 显示提示内容
        if (this.data) {
            this.data.features.forEach(item => {
                arr.push(item.properties)
            })
        }
        this.length = arr.length
        return arr
    }

    initTable() {
        $('.title-text').html(this.title)
        $('.title-group').append(`<li data-index=${this.index}>${this.title}</li>`)

        if (this.data) {
            $('.table-content').append(this.getTableHtml(this.length))

            this.container = $('.table_panel:last')
            this.container.addClass('active').siblings().removeClass('active')
            this.container.find('.table').attr('id', 'table' + this.index)

            this.renderTable();
            this.bindEvents()
        } else {
            $('.empty_table').remove()
            $('.table-content').append(this.getEmptyStatus())
        }
        $('.table-content').show()
    }

    renderTable() {
        this.table = new Tabulator('#table' + this.index, {
            data: this.getData(),
            height: "360px",
            layout: "fitData",
            pagination: true,
            paginationSize: 10,
            rowHeight: 27,
            columnDefaults: {
                hozAlign: 'center',
                vertAlign: "center",
                padding: 0,
                headerHozAlign: 'center',
            },
            initialSort: [
                { column: "FID", dir: "asc" } // 按照 "name" 列升序排序
            ],
            columns: [
                { title: "ID", field: "FID", width: 80, sorter: "number" },// 设置排序器为number
                { title: "标题", field: "NAME", width: 200, },
                { title: "类型", field: "TYPE", width: 100, },
                { title: "EC", field: "EC", width: 100, },
                { title: "GB", field: "GB", },
            ],
        });

        //当调用tabulator构造函数并且表已完成渲染时，触发tableBuilt事件,渲染滚动条
        this.table.on("tableBuilt", () => {
            new PerfectScrollbar('.tabulator-tableholder');
        });
        // 当提示用户下载文件时，将触发downloadFull回调。
        this.table.on("downloadComplete", () => {
            this.container.find('.dropdown_list').hide()
        });
    }

    bindEvents() {
        // 使用事件委托，将点击事件绑定到表格容器上
        this.container.on('click', '.table_download_btn', (e) => {
            this.container.find('.dropdown_list').toggle()
        });

        //文件下载
        this.container.on('click', '.download-csv', () => {
            new Modal(this.title, "CSV", (name) => {
                this.table.download("csv", name + ".csv", { bom: true });
            })
        });

        this.container.on('click', '.download-json', () => {
            new Modal(this.title, "JSON", (name) => {
                this.table.download("json", name + ".json");
            })
        });

        this.container.on('click', '.download-xlsx', () => {
            new Modal(this.title, "XLSL", (name) => {
                this.table.download("xlsx", name + ".xlsx", { sheetName: name });
            })
        });

        this.container.on('click', '.download-pdf', () => {
            new Modal(this.title, (name) => {
                this.table.download("pdf", "PDF", name + ".pdf", {
                    orientation: "portrait", //set page orientation to portrait
                    title: name, //add title to report
                });
            })
        });

        this.container.on('click', '.download-html', () => {
            new Modal(this.title, "HTML", (name) => {
                this.table.download("html", name + ".html", { style: true });
            })
        });
        //搜索功能
        this.container.on('click', '.table_search_btn', () => {
            var value = $('.table_seatch_input').val()
            if (value.trim() !== "")
                this.table.setFilter("NAME", 'like', value);
            else
                this.table.clearFilter()
        })
        //搜索框enter事件
        this.container.on('keydown', '.table_seatch_input', (event) => {
            // 检查按下的键是否是 Enter 键
            if (event.key === 'Enter') {
                event.preventDefault();
                // 在这里触发查询按钮的点击事件或执行查询操作
                this.container.find('.table_search_btn').click(); // 请将 'queryButton' 替换为实际的查询按钮的ID或选择器
            }
        })
    }

    getEmptyStatus() {
        return `
        <div class="empty_table">
            <div class="empty_table_image">
                <img src="imgs/empty_table.svg" />
            </div>
            <div class="empty_table_text">没有查询到相关数据!</div>
        </div>
        `
    }

    getTableHtml(count) {
        return `
        <div class="table_panel">
            <div class="table_panel_container">
                <div class="table_search">
                    <img src="imgs/search.svg" alt="">
                    <input class="table_seatch_input" placeholder="请输入标题">
                    <div class="table_search_btn">查询</div>
                </div>
                <div class="table_download_btn">
                    <img src="imgs/download.svg" />
                    <div class="table_download_text">下载</div>
                    <img src="imgs/dropdown.svg" class="dropdown_svg" />
                </div>
                <div class="dropdown_list">
                    <ul>
                        <li class="download-csv">下载csv</li>
                        <li class="download-json">下载json</li>
                        <li class="download-xlsx">下载XLSX</li>
                        <li class="download-pdf">下载PDF</li>
                        <li class="download-html">下载HTML</li>
                    </ul>
                </div>
            </div>
            <div class="table-wrapper">
                <div class="table"></div>
                <div class="table-wrapper-count">共${count}条数据</div>
            </div>
        </div>`
    }

}