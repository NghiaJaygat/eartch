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

let allCountriesData = []; // Store full country data
let allCountryNames = []; // Store common names for suggestions

document.addEventListener('DOMContentLoaded', function() {
    const searchInput1 = document.getElementById('searchInput1');
    const searchInput2 = document.getElementById('searchInput2');
    const suggestions1 = document.getElementById('suggestions1');
    const suggestions2 = document.getElementById('suggestions2');

    // Load all country data once
    fetch('https://restcountries.com/v3.1/all')
        .then(res => res.json())
        .then(data => {
            allCountriesData = data; // Store full data
            allCountryNames = data.map(c => c.name.common).sort(); // Store names for suggestions
        })
        .catch(error => {
            console.error('Lỗi khi tải danh sách quốc gia:', error);
        });

    // Function to handle input and display suggestions
    const setupSuggestionInput = (inputElement, suggestionsListElement) => {
        let debounceTimer;
        inputElement.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const keyword = inputElement.value.toLowerCase();
                suggestionsListElement.innerHTML = '';
                suggestionsListElement.style.display = 'none';

                if (keyword.length > 1) {
                    const filtered = allCountryNames.filter(name =>
                        name.toLowerCase().includes(keyword)
                    ).slice(0, 5); // Limit to 5 suggestions

                    if (filtered.length > 0) {
                        suggestionsListElement.style.display = 'block';
                        filtered.forEach(name => {
                            const li = document.createElement('li');
                            li.textContent = name;
                            li.style.cssText = 'padding:10px; cursor:pointer; border-bottom:1px solid #eee;';
                            li.addEventListener('click', () => {
                                inputElement.value = name;
                                suggestionsListElement.innerHTML = '';
                                suggestionsListElement.style.display = 'none';
                            });
                            suggestionsListElement.appendChild(li);
                        });
                    }
                }
            }, 300);
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!inputElement.contains(e.target) && !suggestionsListElement.contains(e.target)) {
                suggestionsListElement.innerHTML = '';
                suggestionsListElement.style.display = 'none';
            }
        });
    };

    setupSuggestionInput(searchInput1, suggestions1);
    setupSuggestionInput(searchInput2, suggestions2);
});

function compare() {
  const name1 = document.getElementById("searchInput1").value;
  const name2 = document.getElementById("searchInput2").value;
  const container = document.getElementById("compareContainer");
  const result = document.getElementById("compareResult");
  container.innerHTML = "";
  result.innerHTML = "";

  if (!name1 || !name2) {
    alert("Vui lòng nhập đủ tên hai quốc gia.");
    return;
  }

  const country1 = allCountriesData.find(c => c.name.common === name1);
  const country2 = allCountriesData.find(c => c.name.common === name2);

  if (!country1 || !country2) {
      alert("Không tìm thấy thông tin cho một hoặc cả hai quốc gia đã nhập. Vui lòng kiểm tra lại tên.");
      return;
  }

  [country1, country2].forEach(country => {
    const div = document.createElement("div");
    div.className = "card"; // Reuse existing card class

    const languages = country.languages ? Object.values(country.languages).join(", ") : "Không rõ";
    const currency = country.currencies ? Object.values(country.currencies)[0].name : "Không rõ";
    const capital = country.capital?.[0] || "Không rõ";

    div.innerHTML = `
      <img src="${country.flags.svg}" alt="Flag" class="country-flag-compare" />
      <h3>${country.name.common}</h3>
      <p><strong>Thủ đô:</strong> ${capital}</p>
      <p><strong>Dân số:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Diện tích:</strong> ${country.area.toLocaleString()} km²</p>
      <p><strong>Ngôn ngữ:</strong> ${languages}</p>
      <p><strong>Tiền tệ:</strong> ${currency}</p>
    `;
    container.appendChild(div);
  });

  const largerArea = country1.area > country2.area ? name1 : (country1.area < country2.area ? name2 : "Bằng nhau");
  const morePop = country1.population > country2.population ? name1 : (country1.population < country2.population ? name2 : "Bằng nhau");
  const lang1 = country1.languages ? Object.keys(country1.languages).length : 0;
  const lang2 = country2.languages ? Object.keys(country2.languages).length : 0;
  const moreLang = lang1 > lang2 ? name1 : (lang1 < lang2 ? name2 : "Bằng nhau");

  result.innerHTML = `
    <h3>📊 Kết quả So sánh:</h3>
    <p>🌍 Diện tích lớn hơn: <strong>${largerArea}</strong></p>
    <p>👥 Dân số nhiều hơn: <strong>${morePop}</strong></p>
    <p>🗣️ Ngôn ngữ đa dạng hơn: <strong>${moreLang}</strong></p>
  `;
}