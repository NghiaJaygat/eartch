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
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultDiv = document.getElementById('result');
    let allCountries = []; // Lưu trữ tất cả tên quốc gia cho chức năng gợi ý

    // Khởi tạo danh sách quốc gia để gợi ý tìm kiếm
    fetch('https://restcountries.com/v3.1/all')
        .then(res => res.json())
        .then(data => {
            allCountries = data.map(c => c.name.common).sort();
        })
        .catch(error => {
            console.error('Lỗi khi tải danh sách quốc gia:', error);
        });

    // Tạo phần tử để hiển thị gợi ý
    const suggestions = document.createElement('ul');
    suggestions.id = 'suggestions';
    suggestions.style.cssText = 'list-style:none; padding:0; margin-top:5px; background:#fff; max-height:150px; overflow:auto; border:1px solid #ccc; border-radius:4px; position:absolute; z-index:100; width:calc(100% - 20px); left:10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);'; // Thêm position và width
    searchInput.parentNode.insertBefore(suggestions, searchInput.nextSibling); // Chèn sau searchInput

    // Debounce để hạn chế gợi ý quá nhanh
    let debounceTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const keyword = searchInput.value.toLowerCase();
            suggestions.innerHTML = '';
            suggestions.style.display = 'none'; // Ẩn gợi ý nếu không có từ khóa

            if (keyword.length > 1) {
                const filtered = allCountries.filter(name =>
                    name.toLowerCase().includes(keyword)
                ).slice(0, 5); // Giới hạn 5 gợi ý

                if (filtered.length > 0) {
                    suggestions.style.display = 'block'; // Hiển thị lại gợi ý
                    filtered.forEach(name => {
                        const li = document.createElement('li');
                        li.textContent = name;
                        li.style.cssText = 'padding:10px; cursor:pointer; border-bottom:1px solid #eee;';
                        li.addEventListener('click', () => {
                            searchInput.value = name;
                            suggestions.innerHTML = '';
                            suggestions.style.display = 'none';
                            searchCountry(name); // Gọi hàm search trực tiếp
                        });
                        suggestions.appendChild(li);
                    });
                }
            }
        }, 300);
    });

    // Ẩn gợi ý khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.innerHTML = '';
            suggestions.style.display = 'none';
        }
    });

    // Hàm tìm kiếm quốc gia chính
    function searchCountry(countryName) {
        if (countryName === "") {
            resultDiv.innerHTML = `<p>Vui lòng nhập tên quốc gia!</p>`;
            return;
        }

        resultDiv.innerHTML = `<p>Đang tải thông tin...</p>`;

        fetch(`https://restcountries.com/v3.1/name/${countryName}`)
            .then(res => {
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error("xin lỗi bạn không có nước.");
                    } else {
                        throw new Error(`Đã xảy ra lỗi: ${res.status}`);
                    }
                }
                return res.json();
            })
            .then(data => {
                const info = data[0];
                const flag = info.flags.svg;
                const name = info.name.common;
                const capital = info.capital?.[0] || 'Không rõ';
                const population = info.population.toLocaleString();
                const area = info.area.toLocaleString() + ' km²';
                const currency = Object.values(info.currencies || {})[0]?.name || 'Không rõ';
                const region = info.region;
                const languages = Object.values(info.languages || {}).join(', ') || 'Không rõ';

                // Cập nhật nội dung của resultDiv với thông tin chi tiết và nút yêu thích
                resultDiv.innerHTML = `
                    <div class="country-header">
                        <img src="${flag}" alt="Quốc kỳ ${name}" class="country-flag" />
                        <h2>${name}</h2>
                    </div>
                    <div class="country-info-grid">
                        <p><strong>Thủ đô:</strong> ${capital}</p>
                        <p><strong>Dân số:</strong> ${population}</p>
                        <p><strong>Diện tích:</strong> ${area}</p>
                        <p><strong>Tiền tệ:</strong> ${currency}</p>
                        <p><strong>Khu vực:</strong> ${region}</p>
                        <p><strong>Ngôn ngữ:</strong> ${languages}</p>
                    </div>
                    <div class="country-map-section">
                        <h3>Bản đồ Google Maps</h3>
                        <iframe
                            src="https://maps.google.com/maps?q=${encodeURIComponent(name)}&output=embed"
                            class="google-map" allowfullscreen=""
                            loading="lazy" referrerpolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                    <button class="btn add-to-favorites-btn" onclick="addToFavorites('${name}', '${flag}')">❤️ Thêm vào yêu thích</button>
                `;
            })
            .catch(error => {
                console.error('Lỗi:', error);
                resultDiv.innerHTML = `<p class="error-message">❌ ${error.message}</p>`;
            });
    }

    // Xử lý sự kiện click nút tìm kiếm
    searchBtn.addEventListener('click', () => {
        searchCountry(searchInput.value.trim());
    });

    // Xử lý sự kiện nhấn Enter trong ô tìm kiếm
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchCountry(searchInput.value.trim());
        }
    });

    // Hàm thêm vào yêu thích (được gọi từ onclick của nút)
    function addToFavorites(name, flag) {
        const user = localStorage.getItem("username"); // Get username
        if (!user || user === "guest") { // Check if user is logged in
            alert("Vui lòng đăng nhập để thêm quốc gia vào danh sách yêu thích.");
            return;
        }

        const key = "favorites_" + user;
        const existing = JSON.parse(localStorage.getItem(key)) || [];

        if (!existing.some(item => item.name === name)) {
            existing.push({ name, flag });
            localStorage.setItem(key, JSON.stringify(existing));
            alert(`✅ Đã thêm ${name} vào danh sách yêu thích.`);
        } else {
            alert(`⚠️ ${name} đã có trong danh sách yêu thích.`);
        }
    }

    // Đặt hàm addToFavorites vào window scope để có thể gọi từ onclick HTML
    window.addToFavorites = addToFavorites;

    // Kiểm tra query parameter để tìm kiếm quốc gia khi tải trang (ví dụ từ trang yêu thích)
    const urlParams = new URLSearchParams(window.location.search);
    const countryParam = urlParams.get('country');
    if (countryParam) {
        searchInput.value = countryParam;
        searchCountry(countryParam);
    }
});