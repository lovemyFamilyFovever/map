//渲染指定图层的表格
class CustomChart {
    constructor(data, groupFields) {
        this.data = data;
        this.groupFields = groupFields;
        this.container = 'main-echart';
        this.title = "低效用地";
        this.initChart();
    }

    initChart() {
        $('#main-echart .loading-container').hide()
        $('.empty_chart').hide()
        if (this.data) {
            var chartDom = document.getElementById(this.container);
            this.Chart = echarts.init(chartDom);
            // 将 option 设置给图表

            const chartType = this.groupFields.chartType;
            $('.echart_type img[data-type="' + chartType + '"]').addClass('active')
            this.Chart.setOption(this.getOption(chartType));
            this.renderImg()
        } else {
            this.getEmptyStatus()
        }
        $('.chart-content').show()
        this.bindEvents();
    }

    bindEvents() {
        var that = this;
        //关闭图表弹窗
        $('.chart-content-close').on('click', function () {
            $('.chart-content').hide()
        })

        //切换图表
        $('.echart_type img').on('click', function () {
            if ($(this).hasClass('active')) {
                return;
            } else {
                $(this).addClass('active').siblings().removeClass('active')
                // 清除之前的图表
                that.Chart.clear();
                // 切换图表类型
                const chartType = $(this).attr('data-type')
                that.Chart.setOption(that.getOption(chartType));
                that.renderImg()
            }
        })
    }

    // 获取图表配置项-柱状图
    getOption(chartType) {
        const selectColumnName = this.groupFields.selectColumnName;
        const calcTypeName = this.groupFields.calcTypeName;

        if (chartType == 'bar') {
            return getBarOption(this.data)
        } else if (chartType == 'line') {
            return getLineOption(this.data)
        } else {
            return getPieOption(this.data)
        }

        // 获取图表配置项-柱状图
        function getBarOption(data) {
            return {
                tooltip: {},
                legend: {
                    data: [calcTypeName]
                },
                xAxis: {
                    type: 'category',
                    data: data.map(item => item[selectColumnName]),
                    axisLabel: {
                        formatter: function (value) {
                            // 每行最多显示4个字符
                            const maxCharsPerLine = 4; // 每行字符数
                            let formattedValue = '';
                            for (let i = 0; i < value.length; i += maxCharsPerLine) {
                                formattedValue += value.substring(i, i + maxCharsPerLine) + '\n';
                            }
                            return formattedValue;
                        }
                    }
                },
                yAxis: {
                    type: 'value'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: "10%",
                    containLabel: true
                },
                series: [{
                    name: calcTypeName,
                    type: 'bar',
                    data: data.map(item => item[calcTypeName]),
                }]
            }
        }
        // 获取图表配置项-折线图
        function getLineOption(data) {
            return {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [calcTypeName]
                },
                xAxis: {
                    type: 'category',
                    data: data.map(item => item[selectColumnName]),
                    axisLabel: {
                        formatter: function (value) {
                            // 每行最多显示4个字符
                            const maxCharsPerLine = 4; // 每行字符数
                            let formattedValue = '';
                            for (let i = 0; i < value.length; i += maxCharsPerLine) {
                                formattedValue += value.substring(i, i + maxCharsPerLine) + '\n';
                            }
                            return formattedValue;
                        }
                    }
                },
                yAxis: {
                    type: 'value'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: "14%",
                    containLabel: true
                },
                series: [{
                    name: calcTypeName,
                    type: 'line',
                    data: data.map(item => item[calcTypeName]),
                    smooth: true // 平滑曲线
                }]
            }
        }
        // 获取图表配置项-饼图
        function getPieOption(data) {
            return {
                tooltip: {
                    trigger: 'item'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: "15%",
                    containLabel: true
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [{
                    name: selectColumnName,
                    type: 'pie',
                    radius: '50%',
                    data: data.map(item => ({
                        name: item[selectColumnName],
                        value: item[calcTypeName]
                    })),
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };
        }
    }


    //渲染图表下载项
    renderImg() {
        this.Chart.on('finished', () => {
            var dataURL = this.Chart.getDataURL({
                pixelRatio: 2, // 可选，设置导出的图像分辨率
                backgroundColor: '#fff' // 可选，设置导出的图像背景色
            })
            // 创建一个隐藏的链接元素用于下载
            $('.echart_download').attr({
                'href': dataURL,
                "download": this.title + ".png"//下载的文件名
            })
        });
    }

    getEmptyStatus() {
        $('.empty_chart').css('display', 'flex')
        $('.echart_body').hide()
    }

}





