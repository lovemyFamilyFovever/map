//渲染指定图层的表格
class CustomTable {
    constructor(layer, searchConditions, statisticsByConditions) {
        this.layer = layer;
        this.searchConditions = searchConditions;
        this.statisticsByConditions = statisticsByConditions;
        this.table = null;
        this.sortable = null;
        this.downloadOptions = ['CSV', 'JSON', 'XLSX', 'PDF', 'HTML'];
        this.initTable();
    }

    //初始化表格
    initTable() {

        $('#main-table').hide()
        $('.table-content .loading-container').show();

        if (!this.layer) {
            return
        }
        const featureLayer = sfs.getLayerById(this.layer._leaflet_id)
        const query = featureLayer.query();
        if (!this.searchConditions) {
            this.searchConditions = '1=1';
        }
        query.where(this.searchConditions)
            .fields(this.layer.columns.map(item => item.field))
            .returnGeometry(false)
            .run((error, featureCollection) => {
                if (error) {
                    console.error("查询失败:", error);
                    this.renderTable([])
                    alert(data.msg)
                    return;
                }
                // 提取所有要素的属性
                let attributesArray = featureCollection.features.map(feature => feature.properties);
                if (this.statisticsByConditions) {
                    attributesArray = this.groupAndAggregate(attributesArray)
                }
                // 翻转数组，解决前端分页问题
                this.renderTable(attributesArray.reverse())
            });
    }

    // 聚合统计
    groupAndAggregate(data) {
        const { selectColumn, selectColumnName, satisticsField, satisticsFieldName, statisticsType } = this.statisticsByConditions;

        const result = data.reduce((acc, item) => {

            const groupValue = item[selectColumn];  // 动态获取分组字段的值
            const sumValue = Number(item[satisticsField]);        // 动态获取需要统计的字段的值

            // 检查 sumValue 是否为数字类型，确保只统计数字
            if (typeof sumValue !== 'number') {
                console.warn(`Warning: ${satisticsField} value is not a number for item`, item);
                return acc;  // 跳过非数字的值
            }

            // 查找是否已经存在该分组
            const existingGroup = acc.find(group => group[selectColumnName] === groupValue);

            if (existingGroup) {
                // 如果存在，累加统计字段的值并更新数量和平均值
                existingGroup[satisticsFieldName + '_总和'] += sumValue;
                existingGroup[satisticsFieldName + '_数量和'] += 1;
                existingGroup[satisticsFieldName + '_平均值'] = existingGroup[satisticsFieldName + '_总和'] / existingGroup[satisticsFieldName + '_数量和'];
            } else {
                // 如果不存在，创建新分组
                acc.push({
                    [selectColumnName]: groupValue,        // 动态设置分组字段的名称和值
                    [satisticsFieldName + '_总和']: sumValue,                // 初始化统计字段的总和
                    [satisticsFieldName + '_数量和']: 1,                          // 初始化数量
                    [satisticsFieldName + '_平均值']: sumValue                  // 初始化平均值
                });
            }
            return acc;
        }, []);

        if (statisticsType.toLowerCase() == "sum") {
            result.map(group => {
                group[satisticsFieldName + '_总和'] = group[satisticsFieldName + '_总和'].toFixed(2);
                delete group[satisticsFieldName + '_平均值'];
                delete group[satisticsFieldName + '_数量和'];
            });
        } else if (statisticsType.toLowerCase() == "avg") {
            result.map(group => {
                delete group[satisticsFieldName + '_总和'];
                // group[satisticsFieldName + '_平均值'] = group[satisticsFieldName + '_平均值'].toFixed(2);
                delete group[satisticsFieldName + '_数量和'];
            });
        } else {
            result.map(group => {
                delete group[satisticsFieldName + '_总和'];
                delete group[satisticsFieldName + '_平均值'];
            });
        }
        return result
    }

    //给表格添加数据
    renderTable(data) {
        let tableObj = {
            data,
            height: "100%",
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

        if (Object.keys(data[0]).length < 8) {
            tableObj.layout = "fitColumns";
        }

        if (this.statisticsByConditions)
            tableObj.autoColumns = true;
        else
            tableObj.columns = this.handleColumns();

        this.table = new Tabulator(`#main-table`, tableObj);

        //当调用tabulator构造函数并且表已完成渲染时，触发tableBuilt事件,渲染滚动条
        this.table.on("tableBuilt", () => {
            this.table.hideColumn("id");
            this.table.setLocale("zh-cn");
            this.getStatisticsTable();

            $('#main-table').show()
            $('.table-content .loading-container').hide();


            // 重新绑定行点击事件
            this.table.on("rowClick", (e, row) => {
                var rowData = row.getData();

                const featureLayer = sfs.getLayerById(this.layer._leaflet_id)
                const query = featureLayer.query();

                // 点击行时，如果有FID字段，则高亮面积图层
                if (rowData.FID !== undefined) {

                    query.where(`FID = ${row.getData().FID}`)
                        .returnGeometry(true)
                        .run((error, featureCollection) => {
                            if (error) {
                                console.error("查询失败:", error);
                                alert(data.msg)
                                return;
                            }
                            sfs.addPolygonLayer({
                                feature: featureCollection.features[0],
                                options: featureLayer.style,
                            })

                            // 清除其他行的高亮
                            $('.highlight').removeClass('highlight');
                            // 为点击的行添加高亮样式
                            row.getElement().classList.add("highlight");


                            if (this.statisticsByConditions)
                                $('.table-wrap-back').css('display', 'flex')
                        });
                } else {
                    query.where(`${this.statisticsByConditions.selectColumn}='${rowData[this.statisticsByConditions.selectColumnName]}'`)
                        .fields(this.layer.columns.map(item => item.field))
                        .returnGeometry(false)
                        .run((error, featureCollection) => {
                            if (error) {
                                console.error("查询失败:", error);
                                alert(data.msg)
                                return;
                            }
                            // 提取所有要素的属性
                            let attributesArray = featureCollection.features.map(feature => feature.properties);

                            // 先设置列配置
                            this.table.setData(attributesArray.reverse())
                            this.table.setColumns(this.handleColumns())

                            this.getStatisticsTable();
                            $('.table-wrap-back').css('display', 'flex')
                        });
                }
            });

            new PerfectScrollbar('.table_panel .tabulator-tableholder');
            this.bindEvents();
            if (this.statisticsByConditions) {
                new CustomChart(data, this.statisticsByConditions)
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

        $('.table-wrap-back').on('click', () => {
            $('.search_btn.confirm').click();
            $('.table-wrap-back').hide();
            sfs.restoreOriginalStyles();
        })
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
                visible: item["field"] !== "FID",
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
        const count = this.table.getData().length;
        $('.table-wrapper-count').html(
            `共 <b> ${count > 999 ? '999+' : count}</b> 条丨`
        )
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

}