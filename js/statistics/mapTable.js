//渲染指定图层的表格
class CustomTable {
    constructor(layer, groupFields) {
        this.groupFields = groupFields;
        this.layer = layer;
        this.table = null;
        this.sortable = null;
        this.downloadOptions = ['CSV', 'JSON', 'XLSX', 'PDF', 'HTML'];
        this.initTable();
    }

    //初始化表格
    initTable() {

        $('.table-content .loading-container').show();
        this.destroy(); // 先销毁可能存在的旧实例

        let requestData = null;
        let queryType = '';
        if (this.layer) {
            requestData = {
                table_name: this.layer.layerId,
                columns: this.layer.columns.map(item => item.field)
            };
            queryType = 'query';
        } else {
            requestData = this.groupFields
            queryType = 'group';
        }

        fetch('http://150.158.76.25:5000/' + queryType, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // 设置请求头，指定发送 JSON 数据
            },
            body: JSON.stringify(requestData)
        }).then(response => {
            return response.json();
        }).then(data => {
            // console.log('查询结果:', data);
            if (data.type == 'error') {
                this.renderTable([])
                alert(data.msg)
            } else {
                this.renderTable(data)
            }
        }).catch(error => {
            console.error('请求出错:', error);
        });
    }

    // 销毁方法
    destroy() {
        // 移除已绑定的事件，避免多次绑定
        $('.table_title_filter,.table_column_filter_colse').off('click');
        $('#select-all').off('click')
        $('#select-none').off('click')
        $('.table_column_filter_comfirm_btn').off('click')
        $('.table_panel').off('click', '.table_download_btn')
    }

    //给表格添加数据
    renderTable(data) {

        let tableObj = {
            data,
            height: "100%",
            layout: "fitColumns", // 自动调整列宽 
            resizableColumns: true,// 允许调整列宽
            paginationSize: 10, // 每页显示的记录数
            paginationSizeSelector: [10, 20, 30, 40],
            pagination: "local", // 使用本地分页名称
            langs: {
                'zh-cn': {
                    "pagination": {
                        "page_size": "每页显示",
                        "first": "首页",
                        "last": "尾页",
                        "prev": "前一页",
                        "next": "下一页",
                    },
                }
            },
            placeholder: this.getEmptyStatusHtml(),
            columnDefaults: {
                hozAlign: 'center',
                vertAlign: "center",
                padding: 0,
                headerHozAlign: 'center',
            },
            // initialSort: this.setDefaultSort(),
            // columns: this.handleColumns(),
            // autoColumns: true,
        }

        if (this.layer)
            tableObj.columns = this.handleColumns();
        else
            tableObj.autoColumns = true;

        this.table = new Tabulator(`#main-table`, tableObj);

        //当调用tabulator构造函数并且表已完成渲染时，触发tableBuilt事件,渲染滚动条
        this.table.on("tableBuilt", () => {

            this.table.setLocale("zh-cn");

            $('.table-content .loading-container').hide();
            new PerfectScrollbar('.table_panel .tabulator-tableholder');
            this.getStatisticsTable();
            this.bindEvents();

            if (this.groupFields) {
                new CustomChart(data)
            }
        });
        // 当提示用户下载文件时，将触发downloadFull回调。
        this.table.on("downloadComplete", () => {
            $('.table_panel').find('.dropdown_list').hide();
        });
    }

    bindEvents() {
        var that = this;
        // 点击筛选列名-展开/收起筛选条件
        $('.table_title_filter,.table_column_filter_colse').on('click', () => {
            if ($('.table_column_filter_content').hasClass('show')) {
                $('.table_column_filter_content').removeClass('show');
            } else {
                $('.table_column_filter_content').addClass('show');
                that.renderSortableHtml();
            }
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
    //title: 列的标题，显示在表格头部。
    // field: 数据源对象中对应的字段名。
    // width: 列的固定宽度。
    // hozAlign: 列的水平对齐方式，可以是 "left"、"center" 或 "right"。
    // sorter: 列的排序方式，可以是 "string"、"number"、"date" 等。
    // formatter: 用于自定义单元格内容的显示方式，例如 "datetime"、"progress"。
    // editor: 列的编辑类型，使单元格可编辑。常用值有 "input"、"number"、"select" 等。
    // editorParams: 为编辑器提供附加配置，如下拉框的选项值。
    handleColumns() {
        let columnArray = []
        this.layer.columns.forEach(item => {
            columnArray.push({
                title: item["title"],
                field: item["field"],
                minWidth: 100,
            })
        })
        return columnArray
    }

    //渲染左侧可排序列
    renderSortableHtml() {
        let columnHtml = "";
        this.table.getColumnLayout().map((column, index) => {
            columnHtml += template('multiCheckbox-html', {
                checked: "checked",
                id: "tableColumn" + index,
                name: column["title"],
            });
        });
        //初始化排序功能
        $('.table_column_filter_columns').html(columnHtml)
        this.sortable = new Sortable($('.table_column_filter_columns')[0], {
            animation: 150,
            forceFallback: true,
        });
        new PerfectScrollbar('.table_column_filter_columns')
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
            `共 <b> ${count > 999 ? '999+' : count}</b> 条丨`
        )

        // 面积(公顷): <b>${mj_gq.toFixed(4)}</b>丨
        // 宗地数(宗): <b>${zd}</b>丨
        // 面积(亩): <b>${yj_m.toFixed(2)}</b>
    }

    //获取空状态html
    getEmptyStatusHtml() {
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
            if (row[column] !== null && row[column] !== undefined && row[column] !== "") {
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