document.getElementById('searchBtn').addEventListener('click', () => {
  const country = document.getElementById('searchInput').value.trim();

  if (country === "") {
    document.getElementById('result').innerHTML = `<p>Vui lòng nhập tên quốc gia!</p>`;
    return;
  }

  document.getElementById('result').innerHTML = `<p>Đang tải thông tin...</p>`;

  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(res => {
      if (!res.ok) throw new Error("Không tìm thấy quốc gia");
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

      document.getElementById('result').innerHTML = `
        <img src="${flag}" alt="Quốc kỳ ${name}" style="width:200px;"; style="width:200px; display: block; margin: 0 auto 10px auto;" />
        <h2>${name}</h2>
        <p><strong>Thủ đô:</strong> ${capital}</p>
        <p><strong>Dân số:</strong> ${population}</p>
        <p><strong>Diện tích:</strong> ${area}</p>
        <p><strong>Tiền tệ:</strong> ${currency}</p>
        <p><strong>Khu vực:</strong> ${region}</p>
        <p><strong>Ngôn ngữ:</strong> ${languages}</p>

        <h3>Bản đồ Google Maps</h3>
        <iframe
          src="https://maps.google.com/maps?q=${encodeURIComponent(name)}&output=embed"
          width="100%" height="400" style="border:0; border-radius:8px;" allowfullscreen=""
          loading="lazy" referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      `;
    })
    .catch(err => {
      document.getElementById('result').innerHTML = `<p>${err.message || "Rất tiếc, đã xảy ra lỗi."}</p>`;
    });
});

// Tự động gợi ý quốc gia
let allCountries = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://restcountries.com/v3.1/all")
    .then(res => res.json())
    .then(data => {
      allCountries = data.map(c => c.name.common).sort();
    });
});

const searchInput = document.getElementById("searchInput");
const suggestions = document.createElement("ul");
suggestions.id = "suggestions";
suggestions.style = "list-style:none; padding:0; margin-top:5px; background:#fff; max-height:150px; overflow:auto; border:1px solid #ccc; border-radius:4px;";
searchInput.insertAdjacentElement("afterend", suggestions);

// debounce để hạn chế gợi ý quá nhanh
let debounceTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const keyword = searchInput.value.toLowerCase();
    suggestions.innerHTML = "";

    if (keyword.length > 1) {
      const filtered = allCountries.filter(name =>
        name.toLowerCase().includes(keyword)
      ).slice(0, 5);

      filtered.forEach(name => {
        const li = document.createElement("li");
        li.textContent = name;
        li.style = "padding:10px; cursor:pointer;";
        li.addEventListener("click", () => {
          searchInput.value = name;
          suggestions.innerHTML = "";
          document.getElementById("searchBtn").click();
        });
        suggestions.appendChild(li);
      });
    }
  }, 300);
});
// Ẩn gợi ý khi nhấp ra ngoài
document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
    suggestions.innerHTML = '';
  }
});

function addToFavorites(name, flag) {
  const user = localStorage.getItem("username") || "guest";
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