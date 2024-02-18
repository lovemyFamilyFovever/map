//渲染指定图层的表格
function renderTableShidi(data) {
    const title = "湿地"

    $('.table-content').html(getHeadHtml())
    $('.table-content .title').html(title + '统计表')

    let arr = []
    data.features.forEach(item => {
        arr.push(item.properties)
    })

    var table = new Tabulator("#shidi-table", {
        data: arr,
        height: "365px",
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
        table.download("csv", title + "统计表.csv", { bom: true });
        $('.dropdown_list').hide()
    })
    $('.download-json').on('click', function () {
        table.download("json", title + "统计表.json");
        $('.dropdown_list').hide()
    })
    $('.download-xlsx').on('click', function () {
        table.download("xlsx", title + "统计表.xlsx", { sheetName: "My Data" });
        $('.dropdown_list').hide()
    })
    $('.download-pdf').on('click', function () {
        table.download("pdf", title + "统计表.pdf", {
            orientation: "portrait", //set page orientation to portrait
            title: "Example Report", //add title to report
        });
        $('.dropdown_list').hide()
    })
    $('.download-html').on('click', function () {
        table.download("html", title + "统计表.html", { style: true });
        $('.dropdown_list').hide()
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
    <div class="table-content-close"><img src="imgs/close.svg" alt=""></div>
    <div class="table_tools_panel">
        <div class="table_search">
            <img src="imgs/search.svg" alt="">
            <input class="table_seatch_input" placeholder="请输入标题">
            <div class="table_search_btn">查询</div>
        </div>
        <div class="table_download_btn">
            <img src="imgs/download.svg" />
            <div class="table_download_text">导出表格</div>
            <img src="imgs/dropdown.svg" class="dropdown_svg" />
            <img src="imgs/updown.svg" class="updown_svg" />
        </div>
        <div class="dropdown_list">
            <ul>
                <li class="download-csv">导出csv</li>
                <li class="download-json">导出json</li>
                <li class="download-xlsx">导出XLSX</li>
                <li class="download-pdf">导出PDF</li>
                <li class="download-html">导出HTML</li>
            </ul>
        </div>
    </div>
    <div id="table-statistic">
        <div id="shidi-table"></div>
    </div>`

}