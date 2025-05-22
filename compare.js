// Load dữ liệu quốc gia
fetch('https://restcountries.com/v3.1/all')
  .then(res => res.json())
  .then(data => {
    allCountries = data;
    const names = data.map(c => c.name.common).sort();
    const sel1 = document.getElementById("country1");
    const sel2 = document.getElementById("country2");
    names.forEach(name => {
      const opt1 = document.createElement("option");
      const opt2 = document.createElement("option");
      opt1.value = opt2.value = name;
      opt1.textContent = opt2.textContent = name;
      sel1.appendChild(opt1);
      sel2.appendChild(opt2);
    });
  });

function compare() {
  const name1 = document.getElementById("country1").value;
  const name2 = document.getElementById("country2").value;
  const container = document.getElementById("compareContainer");
  const result = document.getElementById("compareResult");
  container.innerHTML = "";
  result.innerHTML = "";

  if (!name1 || !name2) {
    alert("Vui lòng chọn đủ hai quốc gia.");
    return;
  }

  const country1 = allCountries.find(c => c.name.common === name1);
  const country2 = allCountries.find(c => c.name.common === name2);

  [country1, country2].forEach(country => {
    const div = document.createElement("div");
    div.className = "card";

    const languages = country.languages ? Object.values(country.languages).join(", ") : "Không rõ";
    const currency = country.currencies ? Object.values(country.currencies)[0].name : "Không rõ";
    const capital = country.capital?.[0] || "Không rõ";

    div.innerHTML = `
      <img src="${country.flags.svg}" alt="Flag" />
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
