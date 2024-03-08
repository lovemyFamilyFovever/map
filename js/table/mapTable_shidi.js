//渲染指定图层的表格
function renderTableShidi(data, title) {

    tableList

    $('.table-content').html(getHeadHtml())
    $('.table-content .title').html(title)

    let arr = []
    data.features.forEach(item => {
        arr.push(item.properties)
    })
    $('.table_statistic_data').html(`共${arr.length}条数据`)

    var table = new Tabulator("#shidi-table", {
        data: arr,
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
        columns: [
            { title: "ID", field: "FID", width: 80, },
            { title: "标题", field: "NAME", width: 200, },
            { title: "类型", field: "TYPE", width: 100, },
            { title: "EC", field: "EC", width: 100, },
            { title: "GB", field: "GB", },
        ],
    });
    $('.table-content').show()
    //当调用tabulator构造函数并且表已完成渲染时，触发tableBuilt事件,渲染滚动条
    table.on("tableBuilt", function () {
        new PerfectScrollbar('.tabulator-tableholder');
    });
    // 当提示用户下载文件时，将触发downloadFull回调。
    table.on("downloadComplete", function () {
        $('.dropdown_list').hide()
    });

    //隐藏表格
    $('.table-content-close').on('click', function () {
        $('.table-content').hide()
    })

    //打开下载列表
    $('.table_download_btn').on('click', function () {
        $('.dropdown_list').toggle()
        if ($('.dropdown_list').is(':hidden')) {
            $('.dropdown_svg').show()
            $('.updown_svg').hide()
        } else {
            $('.dropdown_svg').hide()
            $('.updown_svg').show()
        }
    })

    //文件下载
    $('.download-csv').on('click', function () {
        showModal(title, function (name) {
            table.download("csv", name + ".csv", { bom: true });
        })
    })

    $('.download-json').on('click', function () {
        showModal(title, function (name) {
            table.download("json", name + ".json");
        })
    })
    $('.download-xlsx').on('click', function () {
        showModal(title, function (name) {
            table.download("xlsx", name + ".xlsx", { sheetName: "My Data" });
        })
    })
    $('.download-pdf').on('click', function () {
        showModal(title, function (name) {
            table.download("pdf", name + ".pdf", {
                orientation: "portrait", //set page orientation to portrait
                title: "Example Report", //add title to report
            });
        })
    })
    $('.download-html').on('click', function () {
        showModal(title, function (name) {
            table.download("html", name + ".html", { style: true });
        })
    })

    //搜索功能
    $('.table_search_btn').on('click', function () {
        var value = $('.table_seatch_input').val()
        if (value.trim() !== "")
            table.setFilter("NAME", '=', value);
        else
            table.clearFilter()
    })
}

function getHeadHtml() {
    return `
    <div class="title"></div>
    <div class="table-content-close close_btn"><img src="imgs/close.svg" alt=""></div>
    <div class="table_tools_panel">
        <div class="table_search">
            <img src="imgs/search.svg" alt="">
            <input class="table_seatch_input" placeholder="请输入标题">
            <div class="table_search_btn">查询</div>
        </div>
        <div class="table_download_btn">
            <img src="imgs/download.svg" />
            <div class="table_download_text">下载</div>
            <img src="imgs/dropdown.svg" class="dropdown_svg" />
            <img src="imgs/updown.svg" class="updown_svg" />
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
    <div id="table-statistic">
        <div id="shidi-table">
        </div>
        <div class="table_statistic_data"></div>
    </div>`
}