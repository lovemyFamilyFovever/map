//渲染指定图层的表格
function renderTableShidi(data) {

    let arr = []
    data.features.forEach(item => {
        arr.push(item.properties)
    })

    var table = new Tabulator("#table-statistic", {
        data: arr,
        pagination: true,
        paginationSize: 10,
        height: "100%",
        layout: "fitData",
        columns: [
            { title: "ID", field: "FID", width: 50 },
            { title: "标题", field: "NAME", width: 200 },
            { title: "类型", field: "TYPE", width: 100, hozAlign: "left", },
            { title: "EC", field: "EC", width: 100 },
            { title: "GB", field: "GB", hozAlign: "center" },
        ],
    });
    $('.table-content').show()
}

function getHeadHtml() {
    return `
    <div class="">
    <select id="filter-field">
        <option></option>
        <option value="name">Name</option>
        <option value="progress">Progress</option>
        <option value="gender">Gender</option>
        <option value="rating">Rating</option>
        <option value="col">Favourite Colour</option>
        <option value="dob">Date Of Birth</option>
        <option value="car">Drives</option>
        <option value="function">Drives & Rating < 3</option>
    </select>
    
    <select id="filter-type">
        <option value="=">=</option>
        <option value="<"><</option>
        <option value="<="><=</option>
        <option value=">">></option>
        <option value=">=">>=</option>
        <option value="!=">!=</option>
        <option value="like">like</option>
    </select>
    
    <input id="filter-value" type="text" placeholder="value to filter">
    
    <button id="filter-clear">Clear Filter</button>
    </div>
    
    <div id="shidi-table"></div>`

}