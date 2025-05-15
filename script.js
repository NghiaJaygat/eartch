document.getElementById('searchBtn').addEventListener('click', () => {
  const country = document.getElementById('searchInput').value.trim();

  if (country === "") {
    document.getElementById('result').innerHTML = `<p>Vui lòng nhập tên quốc gia!</p>`;
    return;
  }

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
      const mapLink = info.maps.googleMaps;

      document.getElementById('result').innerHTML = `
        <img src="${flag}" alt="Quốc kỳ ${name}" />
        <h2>${name}</h2>
        <p><strong>Thủ đô:</strong> ${capital}</p>
        <p><strong>Dân số:</strong> ${population}</p>
        <p><strong>Diện tích:</strong> ${area}</p>
        <p><strong>Tiền tệ:</strong> ${currency}</p>
        <p><strong>Khu vực:</strong> ${region}</p>
        <p><strong>Ngôn ngữ:</strong> ${languages}</p>
        <p><a href="${mapLink}" target="_blank">Xem bản đồ trên Google Maps</a></p>
      `;
    })
    .catch(() => {
      document.getElementById('result').innerHTML = `<p>Không tìm thấy quốc gia! Vui lòng kiểm tra lại tên.</p>`;
    });
});


//tự động gợi ý tên quốc gia
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

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  suggestions.innerHTML = "";

  if (keyword.length > 1) {
    const filtered = allCountries.filter(name =>
      name.toLowerCase().includes(keyword)
    ).slice(0, 5); // giới hạn 5 gợi ý

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
});