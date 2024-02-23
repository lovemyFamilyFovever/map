
var chartDom = document.getElementById('main-echart');
var myChart = echarts.init(chartDom);

let title = "湿地图表"
$('.statistics-content .title').html(title)

const rawData = [
    [100, 302, 301, 334, 390, 330],
    [320, 132, 101, 134, 90, 230],
    [220, 182, 191, 234, 290, 330],
    [150, 212, 201, 154, 190, 330],
    [820, 832, 901, 934, 1290, 1330]
];
const totalData = [];
for (let i = 0; i < rawData[0].length; ++i) {
    let sum = 0;
    for (let j = 0; j < rawData.length; ++j) {
        sum += rawData[j][i];
    }
    totalData.push(sum);
}
const series = [
    'Direct',
    'Mail Ad',
    'Affiliate Ad',
    'Video Ad',
    'Search Engine'
].map((name, sid) => {
    return {
        name,
        type: 'bar',
        stack: 'total',
        barWidth: '60%',
        label: {
            show: true,
            formatter: (params) => Math.round(params.value * 1000) / 10 + '%'
        },
        data: rawData[sid].map((d, did) =>
            totalData[did] <= 0 ? 0 : d / totalData[did]
        )
    };
});

var barOption = {
    legend: {
        top: 10,
        data: ['Direct', 'Mail Ad', 'Affiliate Ad', 'Video Ad']
    },
    tooltip: {},
    grid: {
        left: 40,
        right: 10,
        top: 50,
        bottom: 20
    },
    yAxis: {
        type: 'value'
    },
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },
    series
};

var lineOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        top: 10,
        data: ['Email', 'Union Ads', 'Video Ads', 'Direct']
    },
    grid: {
        left: 10,
        right: 10,
        top: 50,
        bottom: 20,
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: 'Email',
            type: 'line',
            stack: 'Total',
            data: [120, 132, 101, 134, 90, 230]
        },
        {
            name: 'Union Ads',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330]
        },
        {
            name: 'Video Ads',
            type: 'line',
            stack: 'Total',
            data: [150, 232, 201, 154, 190, 330]
        },
        {
            name: 'Direct',
            type: 'line',
            stack: 'Total',
            data: [320, 332, 301, 334, 390, 330]
        },
        {
            name: 'Search Engine',
            type: 'line',
            stack: 'Total',
            data: [820, 932, 901, 934, 1290, 1330]
        }
    ]
};

var pieOption = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center'
    },
    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 40,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                { value: 1048, name: 'Search Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' },
                { value: 484, name: 'Union Ads' },
                { value: 300, name: 'Video Ads' }
            ]
        }
    ]
};

//渲染图表下载项
function renderImg() {
    myChart.on('finished', function () {
        var dataURL = myChart.getDataURL({
            pixelRatio: 2, // 可选，设置导出的图像分辨率
            backgroundColor: '#fff' // 可选，设置导出的图像背景色
        })
        // 创建一个隐藏的链接元素用于下载
        $('.echart_download').attr({
            'href': dataURL,
            "download": title + ".png"//下载的文件名
        })
    });
}

//关闭图表弹窗
$('.echart-content-close').on('click', function () {
    $('.statistics-content').hide()
})

//切换图表
$('.echart_type img').on('click', function () {
    if ($(this).hasClass('active')) {
        return
    } else {
        $(this).addClass('active').siblings().removeClass('active')
        // 清除之前的图表
        myChart.clear();
        var currentOption
        // 切换图表类型
        if ($(this).hasClass('pie')) {
            currentOption = pieOption;
        } else if ($(this).hasClass('line')) {
            currentOption = lineOption;
        } else {
            currentOption = barOption;
        }
        // 更新图表
        myChart.setOption(currentOption);
        renderImg()
    }
})

// 将 option 设置给图表
myChart.setOption(barOption);
renderImg()