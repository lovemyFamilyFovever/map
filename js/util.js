// 通用的Ajax函数
function ajaxRequest(options) {
    // 默认参数
    const defaults = {
        type: "GET",
        url: "",
        data: {},
        dataType: "json",
        success: function () { },
        error: function () { },
    };

    // 合并参数
    const settings = $.extend({}, defaults, options);

    // 发送 AJAX 请求
    $.ajax({
        type: settings.type,
        url: settings.url,
        data: settings.data,
        dataType: settings.dataType,
        success: function (response) {
            // 执行成功回调函数
            settings.success(response);
        },
        error: function (xhr, status, error) {
            // 执行错误回调函数
            settings.error(xhr, status, error);
        },
    });
}