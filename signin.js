// signin.js
document.addEventListener('DOMContentLoaded', function() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // 1. Kiểm tra trạng thái lưu trữ trong localStorage khi tải trang
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    } else {
        // Mặc định là light mode hoặc nếu không có gì trong localStorage
        body.classList.remove('dark-mode');
    }

    // 2. Xử lý sự kiện click nút chuyển đổi
    themeToggleBtn.addEventListener('click', function() {
        body.classList.toggle('dark-mode'); // Thêm hoặc gỡ bỏ class 'dark-mode'

        // Lưu trạng thái hiện tại vào localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signinForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Mảng lưu trữ thông tin người dùng đã đăng ký (trong môi trường thực tế sẽ là database)
    // Tạm thời, chúng ta sẽ lưu nó trong localStorage cho đơn giản
    // Để cho ví dụ này hoạt động, hãy đảm bảo username và password khớp với những gì được lưu trong signup.js
    const registeredUsersKey = 'registeredUsers';

    signinForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Ngăn chặn form gửi đi mặc định

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username === '' || password === '') {
            alert('Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.');
            return;
        }

        // Lấy danh sách người dùng đã đăng ký từ localStorage
        const registeredUsers = JSON.parse(localStorage.getItem(registeredUsersKey)) || [];

        // Tìm người dùng trong danh sách
        const foundUser = registeredUsers.find(user => user.username === username && user.password === password);

        if (foundUser) {
            // Đăng nhập thành công
            localStorage.setItem('username', username); // Lưu tên người dùng vào localStorage
            alert('Đăng nhập thành công!');
            window.location.href = 'home.html'; // Chuyển hướng về trang chủ
        } else {
            // Đăng nhập thất bại
            alert('Tên đăng nhập hoặc mật khẩu không đúng.');
        }
    });
});