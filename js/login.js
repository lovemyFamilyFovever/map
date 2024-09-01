$(document).ready(function () {

    clearExpiredLogin(); // 清除过期登录信息

    // 密码显示
    $('.show-password').on('click', function () {
        var $input = $('input[name="password"]');
        if ($input.attr('type') === 'text') {
            $input.attr('type', 'password');
            $(this).removeClass('active');
            $('.hide-password').addClass('active');
        }
    });
    //密码隐藏
    $('.hide-password').on('click', function () {
        var $input = $('input[name="password"]');
        if ($input.attr('type') === 'password') {
            $input.attr('type', 'text');
            $(this).removeClass('active');
            $('.show-password').addClass('active');
        }
    });

    // 表单提交事件监听
    $('form').on('submit', function (event) {
        event.preventDefault(); // 阻止表单提交

        var account = $('input[name="account"]').val().trim();
        var password = $('input[name="password"]').val().trim();

        if (!account || !password) {

            alert('用户名和密码不能为空！');
            return false;
        }

        var formData = $(this).serialize(); // 序列化表单数据
        $.post($(this).attr('action'), formData, function (response) {
            if (response.success) {
                // 保存登录状态
                const loginTime = new Date().getTime();
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('loginTime', loginTime.toString());
                localStorage.setItem('loginUser', account);

                // 登录成功，重定向到主页或其他页面
                window.location.href = 'index.html';
            } else {
                // 登录失败，显示错误消息
                alert('登录失败：' + response.message);
            }
        }).fail(function (e) {
            alert('请求失败，请稍后再试。');
        });

    });

    // 更改密码事件监听
    $('.login-reset').on('click', function () {
        $('.login-form form').toggleClass('active');
    });

    $('.login-origin').on('click', function () {
        $('.login-form form').toggleClass('active');
    });

    //重置密码
    $('.login-btn-reset').on('click', function (event) {
        event.preventDefault(); // 阻止默认提交行为

        var $form = $('.login-form .reset-password-form');
        var account = $('.reset-password-form input[name="account"]').val().trim();
        var password = $('.reset-password-form input[name="password"]').val().trim();
        var newPassword = $('.reset-password-form input[name="newPassword"]').val().trim();
        var confirmPassword = $('.reset-password-form input[name="confirmPassword"]').val().trim();


        if (password == newPassword) {
            alert('新密码不能与原密码相同！');
            return false;
        }

        if (!account || !password || !newPassword || !confirmPassword) {
            alert('用户名、密码、新密码、确认密码不能为空！');
            return false;
        }

        if (newPassword !== confirmPassword) {
            alert('两次输入的密码不一致！');
            return false;
        }

        var formData = $form.serialize(); // 序列化表单数据
        $.post($form.attr('action'), formData, function (response) {
            if (response.success) {
                // 重置密码成功，显示成功消息
                alert('密码重置成功，请重新登录！');
                $('.login-form form').toggleClass('active');

                $('.login-form-origin input[name="account"]').val(account);
                $('.login-form-origin input[name="password"]').val(newPassword);

            } else {
                // 重置密码失败，显示错误消息
                alert('密码重置失败：' + response.message);
            }
        }).fail(function (e) {
            alert('请求失败，请稍后再试。');
        });
    });

    // 清除过期的登录状态
    function clearExpiredLogin() {
        const loginTime = parseInt(localStorage.getItem('loginTime'), 10);
        const currentTime = new Date().getTime();
        const expirationTime = 24 * 60 * 60 * 1000; // 24小时

        if (currentTime - loginTime > expirationTime) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loginTime');
            localStorage.removeItem('loginUser');
        }
    }
});