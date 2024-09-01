checkLoginStatus();


// 检查登录状态
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginTime = parseInt(localStorage.getItem('loginTime'), 10);
    const currentTime = new Date().getTime();
    const expirationTime = 24 * 60 * 60 * 1000; // 24小时

    if (!isLoggedIn || currentTime - loginTime > expirationTime) {
        // 登录状态无效或已过期，跳转到登录页面
        window.location.href = 'login.html';
    }
}
