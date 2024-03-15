//渲染指定图层的表格
class CustomTable {
    constructor(data, title, index, columns) {
        this.data = data;
        this.title = title + '统计表';
        this.index = index;
        this.columns = columns;

        this.initTable();
    }

    initTable() {
        if (this.data) {
            const features = this.data.features || [];

            const tableHtml = this.getTableHtml(features.length);
            $('.table-content').append(tableHtml);

            this.container = $('.table_panel:last');
            this.container.addClass('active').siblings().removeClass('active');
            this.container.find('.table').attr('id', `table${this.index}`);

            this.renderTable(features);
            this.bindEvents();
        } else {
            $('.table-content').append(this.getEmptyStatus());
            this.container = $('.table_panel:last');
            this.container.addClass('active').siblings().removeClass('active');
        }

        $('.table-content .title-text').html('<img src="imgs/表格.svg" alt="" title="" />' + this.title);
        $('.table-content .title-group').append(`<li data-index=${this.index}>${this.title}</li>`);
        $('.table-content').show();
    }

    renderTable(data) {
        this.table = new Tabulator(`#table${this.index}`, {
            data: data.map(item => item.properties),
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
            initialSort: this.setDefaultSort(),
            columns: this.handleColumns(),
        });

        //当调用tabulator构造函数并且表已完成渲染时，触发tableBuilt事件,渲染滚动条
        this.table.on("tableBuilt", () => {
            new PerfectScrollbar('.table_panel:last-child .tabulator-tableholder');
        });
        // 当提示用户下载文件时，将触发downloadFull回调。
        this.table.on("downloadComplete", () => {
            this.container.find('.dropdown_list').hide();
        });
    }

    bindEvents() {
        // 使用事件委托，将点击事件绑定到表格容器上
        this.container.on('click', '.table_download_btn', (e) => {
            this.container.find('.dropdown_list').toggle();
        });

        //文件下载
        const downloadOptions = ['CSV', 'JSON', 'XLSX', 'PDF', 'HTML'];
        downloadOptions.forEach((option) => {
            this.container.on('click', `.download-${option.toLowerCase()}`, () => {
                new Modal(this.title, option, (name) => {
                    this.table.download(option.toLowerCase(), `${name}.${option.toLowerCase()}`, {
                        sheetName: name,
                        bom: option === 'CSV',
                        style: option === 'HTML',
                        orientation: option === 'PDF' ? 'portrait' : undefined,
                        title: option === 'PDF' ? name : undefined,
                    });
                });
            });
        });

        //搜索功能
        this.container.on('click', '.table_search_btn', () => {
            const value = $('.table_seatch_input').val().trim();
            if (value.trim() !== "")
                this.table.setFilter("NAME", 'like', value);
            else
                this.table.clearFilter()
        })
        //搜索框enter事件
        this.container.on('keydown', '.table_seatch_input', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.container.find('.table_search_btn').click();
            }
        })
    }

    setDefaultSort() {
        const keys = Object.keys(this.columns);
        if (keys.includes("ID")) {
            return [{ column: "ID", dir: "asc" }];
        } else if (keys.includes("FID")) {
            return [{ column: "FID", dir: "asc" }];
        }
        return [{ column: "ID", dir: "asc" }];
    }

    //处理列名
    handleColumns() {
        let currentColumns = []
        for (var key in this.columns) {
            if (this.columns.hasOwnProperty(key)) {
                currentColumns.push({
                    title: this.columns[key],
                    field: key,
                    sorter: (key == "ID" || key == "FID") ? "number" : "string"
                })
            }
        }
        return currentColumns
    }

    getEmptyStatus() {
        return `
        <div class="table_panel">
            <div class="empty_table">
                <div class="empty_table_image">
                    <img src="imgs/empty_table.svg" />
                </div>
                <div class="empty_table_text">没有查询到相关数据!</div>
            </div>
        </div>`
    }

    getTableHtml(count) {
        return `
        <div class="table_panel">
            <div class="table_panel_container">
                <div class="table_search">
                    <img src="imgs/search.svg" alt="搜索">
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
                <div class="table-wrapper-count" title='共${count}条数据'>共${count > 999 ? '999+' : count}条数据</div>
            </div>
        </div>`
    }
}