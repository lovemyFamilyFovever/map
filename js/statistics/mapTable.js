//渲染指定图层的表格
class CustomTable {
    constructor(data, title, index, columns) {
        this.data = data;
        this.columnName = title;
        this.title = title + '统计表';
        this.index = index || 1000;
        this.columns = columns;
        this.filterList = {
            area: new Set(),
            build: new Set(),
            user: new Set(),
            type: new Set(),
        };

        this.table = null;

        this.initTable();
    }

    initTable(name) {
        // this.data = this.data || window.tabledata;
        // this.data = window.tabledata;
        // this.data = utils.ajaxRequest({
        //     url: "http://127.0.0.1:5000/query?table=GYYD0812&column=东环街道",
        //     success: function (data) {
        //         console.log(data)
        //     },
        //     error: function (data) {
        //         console.log(data)
        //     },
        // })
        const currentName = name || this.columnName

        fetch('http://150.158.76.25:88/query?table=GYYD0812&column=' + currentName)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                // 处理返回数据
                this.data.push(...data)

                this.performData(this.data)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    //左侧关闭
    deleteData(title) {
        // 将数据转换为 jQuery 对象（可选）
        const $data = $(this.data);

        // 使用 filter 方法
        this.data = $data.filter(function (index, item) {
            return item.address !== title;
        });

        this.performData(this.data)
    }


    //封装操作data的方法
    performData(data) {
        if (data) {
            const features = data || [];
            features.forEach(feature => {
                this.filterList.area.add(feature["所在乡镇"]);
                this.filterList.build.add(feature["建设情况"]);
                this.filterList.user.add(feature["规划用途"]);
                this.filterList.type.add(feature["分类"]);
            });
            this.filterList.area = Array.from(this.filterList.area);
            this.filterList.build = Array.from(this.filterList.build);
            this.filterList.user = Array.from(this.filterList.user);
            this.filterList.type = Array.from(this.filterList.type);

            const tableHtml = this.getTableHtml(features.length, this.filterList);
            $('.table-content').append(tableHtml);

            this.container = $('.table_panel:last');
            this.container.addClass('active').siblings().removeClass('active');
            this.container.find('.table').attr('id', `table${this.index}`);

            this.renderTable(features);
            this.bindEvents();

            //格式化滚动条
            new PerfectScrollbar('.dropdown_filter_user');
        } else {
            $('.table-content').append(this.getEmptyStatus());
            this.container = $('.table_panel:last');
            this.container.addClass('active').siblings().removeClass('active');
        }

        $('.table-content .title-text').html('<img src="imgs/表格.svg" alt="" title="" />低效用地数据统计表');
        $('.table-content').show();
    }

    renderTable(data) {

        this.table = new Tabulator(`#table${this.index}`, {
            // data: data.map(item => item.properties),
            data,
            height: "330px",
            layout: "fitData",
            pagination: true,
            paginationSize: 20,
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
            this.getStatisticsTable()
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

        // 使用事件委托，点击获取筛选下拉列表
        this.container.on('click', '.tabler_filter_item_btn', (e) => {
            e.stopPropagation();
            const $currentDropdown = $(e.currentTarget).next('.dropdown_list_filter');

            // 检查当前点击的 dropdown_list_filter 是否已经可见
            if ($currentDropdown.is(':visible')) {
                // 如果当前 dropdown_list_filter 已经可见，则隐藏
                $currentDropdown.hide();
                return;
            }

            // // 隐藏所有 .dropdown_list_filter 元素
            $('.dropdown_list_filter').hide();

            // 显示当前点击的 .dropdown_list_filter 元素
            $currentDropdown.show();
        });

        //点击选中li元素
        this.container.off('click', '.dropdown_list_filter');
        this.container.on('click', '.dropdown_list_filter', (e) => {
            e.stopPropagation();
            const $target = $(e.currentTarget);

            const selectedText = $target.find('input:checkbox:checked')
                .map((_, checkbox) => $(checkbox).closest('li').find('span').last().text())
                .get()
                .join(',');
            const showText = $target.prev().find('.search_input')
            showText.val(selectedText)
        });

        //搜索按钮
        this.container.on('click', '.filter_table_search_btn', (e) => {
            this.queryTable()
        })

        //重置数据
        this.container.on('click', '.filter_table_reset_btn', (e) => {
            $('.search_input').val("")
            this.queryTable()
        })

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

    //统计列名
    reduceSum(columName) {
        let columnSum = 0;
        let data = this.table.getData('active'); // 获取当前表格数据

        data.forEach(row => {
            // 假设我们要统计的列名为 "amount"
            columnSum += parseFloat(row[columName]) || 0;
        });
        return columnSum.toFixed(2)
    }

    //统计结果，底部数据
    getStatisticsTable() {
        const count = this.table.getDataCount("active");
        $('.table-wrapper-count').html(
            `
            共<b>${count > 999 ? '999+' : count}</b>条丨
            面积:<b>${this.reduceSum("面积_公顷")}</b>公顷丨
            宗地数:<b>${this.reduceSum("宗地数_宗")}</b>宗丨
            面积:<b>${this.reduceSum("亩")}</b>亩
            `
        )
    }

    queryTable() {
        const filters = [];

        // 定义筛选条件和相应的字段映射
        const filterFields = [
            { selector: '.filter_area .search_input', field: '所在乡镇' },
            { selector: '.filter_build .search_input', field: '建设情况' },
            { selector: '.filter_user .search_input', field: '规划用途' },
            { selector: '.filter_type .search_input', field: '分类' }
        ];

        // 遍历筛选条件
        filterFields.forEach(({ selector, field }) => {
            const value = $(selector).val().trim();
            if (value) {
                filters.push({ field, type: 'in', value: value.split(',') });
            }
        });

        // 应用筛选条件
        this.table.setFilter(filters);
        //统计底部数据
        this.getStatisticsTable();
        // this.table.redraw();
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

    getTableHtml(count, features) {

        const generateListItems = (items) =>
            items.map(item => `
                <li>
                    <div class="checkbox-wrapper">
                        <input type="checkbox" id="cbx-${item}" class="inp-cbx" />
                        <label for="cbx-${item}" class="cbx">
                            <span>
                                <svg viewBox="0 0 12 10" height="10px" width="12px">
                                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                </svg>
                            </span>
                            <span>${item}</span>
                        </label>
                    </div>
                </li>`).join('');


        const areaHtml = generateListItems(features.area);
        const buildHtml = generateListItems(features.build);
        const userHtml = generateListItems(features.user);
        const typeHtml = generateListItems(features.type);

        const generateFilterSection = function (filterClass, title, listHtml) {
            return `
            <div class="tabler_filter_item">
                <div class="tabler_filter_item_btn ${filterClass}">
                    <span>
                        <input type="text" class="search_input" value="" placeholder="${title}" />
                    </span>
                    <img src="imgs/dropdown.svg" class="dropdown_svg">
                </div>
                <div class="dropdown_list_filter dropdown_${filterClass}">
                    <ul>${listHtml}</ul>
                </div>
            </div>`
        };

        const html = `
        <div class="table_panel">
            <div class="table_panel_container">
                <div class="table_filter_group">
                    ${generateFilterSection('filter_area', '所在乡镇', areaHtml)}
                    ${generateFilterSection('filter_build', '建设情况', buildHtml)}
                    ${generateFilterSection('filter_user', '规划用途', userHtml)}
                    ${generateFilterSection('filter_type', '分类', typeHtml)}
                    <div class="filter_table_search_btn filter_btn">查询</div>
                    <div class="filter_table_reset_btn filter_btn">重置</div>
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
                <div class="table-wrapper-count">
                    共<b>${count > 999 ? '999+' : count}</b>条丨
                    面积(公顷):<b></b>宗丨
                    宗地数(宗):<b></b>公顷丨
                    面积(亩):<b></b>家
                </div>
            </div>
        </div>`;

        return html;
    }
}