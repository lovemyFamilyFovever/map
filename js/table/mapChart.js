//渲染指定图层的表格
class CustomChart {
    constructor(container, data, title) {
        this.container = container;
        this.title = title + '图表';
        this.data = data;

        this.initChart();
    }

    initChart() {
        var chartDom = document.getElementById(this.container);
        this.Chart = echarts.init(chartDom);
        $('.chart-content .title').html(this.title)

    }

    renderChart() {
        // 将 option 设置给图表
        this.Chart.setOption(this.barOption);
        this.renderImg()
    }

    getBarOption() {

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

        this.barOption = {
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
    }
    getLineOption() {
        this.lineOption = {
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
    }
    getPieOption() {
        this.pieOption = {
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
    }

    bindEvents() {
        //关闭图表弹窗
        $('.chart-content-close').on('click', function () {
            $('.chart-content').hide()
        })

        //切换图表
        $('.echart_type img').on('click', function () {
            if ($(this).hasClass('active')) {
                return
            } else {
                $(this).addClass('active').siblings().removeClass('active')
                // 清除之前的图表
                this.Chart.clear();
                // 切换图表类型
                if ($(this).hasClass('pie')) {
                    this.currentOption = this.pieOption;
                } else if ($(this).hasClass('line')) {
                    this.currentOption = this.lineOption;
                } else {
                    this.currentOption = this.barOption;
                }
                // 更新图表
                this.Chart.setOption(this.currentOption);
                this.renderImg()
            }
        })
    }

    //渲染图表下载项
    renderImg() {
        this.Chart.on('finished', function () {
            var dataURL = this.Chart.getDataURL({
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

    getEmptyStatus() {
        $('.empty_chart').show()
        $('.echart_body').hide()
    }

    getChartHtml() {
        $('.empty_chart').hide()
        $('.echart_body').show()
    }
}





