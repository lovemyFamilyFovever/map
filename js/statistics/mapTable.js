//渲染指定图层的表格
class CustomTable {
    constructor() {
        this.table = null;
        this.columns = [];
        this.sortable = null;
        this.downloadOptions = ['CSV', 'JSON', 'XLSX', 'PDF', 'HTML'];
        this.initTable();
    }

    //初始化表格
    initTable() {
        fetch('http://150.158.76.25:5000/query')
            .then(response => response.json())
            .then(data => {
                this.renderTable(data)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    //给表格添加数据
    renderTable(data) {
        this.table = new Tabulator(`#main-table`, {
            data,
            height: "34vh",
            layout: "fitData",
            pagination: true,
            paginationSize: 10,
            rowHeight: 20,
            paginationButtonCount: 3, //设置分页按钮的数量
            placeholder: this.getEmptyStatus(),
            columnDefaults: {
                hozAlign: 'center',
                vertAlign: "center",
                padding: 0,
                headerHozAlign: 'center',
            },
            // initialSort: this.setDefaultSort(),
            columns: this.handleColumns(data[0]),
        });

        //当调用tabulator构造函数并且表已完成渲染时，触发tableBuilt事件,渲染滚动条
        this.table.on("tableBuilt", () => {
            $('.table-wrapper .loading-container').hide();
            new PerfectScrollbar('.table_panel .tabulator-tableholder');
            this.getStatisticsTable();
            this.bindEvents();

            new Statistics();

            new CustomChart('main-echart', [], "123")

        });
        // 当提示用户下载文件时，将触发downloadFull回调。
        this.table.on("downloadComplete", () => {
            $('.table_panel').find('.dropdown_list').hide();
        });
    }

    bindEvents() {
        // 点击筛选列名-展开/收起筛选条件
        $('.table_title_filter,.table_column_filter_colse').on('click', () => {
            $('.table_column_filter_content').toggleClass('show');
        });

        // 点击筛选列名-全选按钮
        $('#select-all').on('click', () => {
            const $checkboxes = $('.table_column_filter_content input[type="checkbox"]');
            $checkboxes.prop('checked', true);
        });
        // 点击筛选列名-全不选按钮
        $('#select-none').on('click', () => {
            const $checkboxes = $('.table_column_filter_content input[type="checkbox"]');
            $checkboxes.prop('checked', false);
        });

        // 点击筛选列名-确定按钮
        $('.table_column_filter_comfirm_btn').on('click', () => {
            const $checkboxes = $('.table_column_filter_content input[type="checkbox"]');
            const checkedCheckboxes = [];
            $checkboxes.each(function () {
                if ($(this).is(':checked')) {
                    const columnName = $(this).data('name');
                    checkedCheckboxes.push({
                        title: columnName,
                        field: columnName
                    });
                }
            });
            this.table.setColumns(checkedCheckboxes);
            $('.table_column_filter_content').toggleClass('show');
        });

        // 点击下载按钮
        $('.table_panel').on('click', '.table_download_btn', (e) => {
            $('.dropdown_list').hide();
            $('.table_panel').find('.dropdown_list').toggle();
        });

        //文件下载
        this.downloadOptions.forEach((option) => {
            $('.table_panel').on('click', `.download-${option.toLowerCase()}`, () => {
                new Modal("", option, (name) => {
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
    //处理列名
    handleColumns(objects) {
        var columnsHtml = "";
        var index = 0;

        // let tempObjects = {};
        // config.statisticsItems.forEach(item => {
        //     tempObjects[item.column] = item.column

        // });
        // for (var key in objects) {
        for (var key in objects) {
            let obj = {
                title: key,
                field: key,
            }
            index++;
            this.columns.push(obj)
            columnsHtml += template('multiCheckbox-html', {
                checked: "checked",
                id: "tableColumn" + index,
                name: key,
            });
        }

        //初始化排序功能
        $('.table_column_filter_columns').append(columnsHtml)
        this.sortable = new Sortable($('.table_column_filter_columns')[0], {
            animation: 150,
            forceFallback: true,
        });
        new PerfectScrollbar('.table_column_filter_columns')

        return this.columns
    }

    //统计结果，底部数据
    getStatisticsTable() {
        const count = this.table.getDataCount("active");
        var mj_gq = 0;
        var zd = 0;
        var yj_m = 0;
        this.table.getData("active").forEach((row) => {
            mj_gq += row.土地面积;
            zd += row.宗地数_宗;
            yj_m += row.亩;
        });

        $('.table-wrapper-count').html(
            `共 <b> ${count > 999 ? '999+' : count}</b> 条丨
            面积: <b>${mj_gq.toFixed(3)}</b>公顷丨
            宗地数: <b>${zd.toFixed(3)}</b>宗丨
            面积: <b>${yj_m.toFixed(3)}</b>亩`
        )
    }

    //获取空状态html
    getEmptyStatus() {
        return `
        <div class="table_panel" >
            <div class="empty_table">
                <div class="empty_table_image">
                    <img src="imgs/empty_table.svg" />
                </div>
                <div class="empty_table_text">没有查询到相关数据!</div>
            </div>
        </div>`
    }

    //获取指定列的唯一值
    getColumnUniqueValues(column) {
        const columns = this.table.getData().map(function (row, index) {
            if (row[column] !== null && row[column] !== undefined) {
                return row[column];
            }
        });
        return Array.from(new Set(columns));
    }

    //过滤表格
    filterTable(filters) {
        if (filters.length > 0) {
            this.table.setFilter(filters);
            this.getStatisticsTable();
        }
    }

}