    let allData = [];

    fetch("https://restcountries.com/v3.1/all")
      .then(res => res.json())
      .then(data => {
        allData = data;
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

    function compareCountries() {
      const name1 = document.getElementById("country1").value;
      const name2 = document.getElementById("country2").value;

      if (!name1 || !name2) {
        alert("Vui lòng chọn đủ hai quốc gia!");
        return;
      }

      const data1 = allData.find(c => c.name.common === name1);
      const data2 = allData.find(c => c.name.common === name2);

      const result = document.getElementById("compareResult");
      const summary = document.getElementById("summaryResult");
      result.innerHTML = "";
      summary.innerHTML = "";

      const cardHTML = (data) => {
        const flag = data.flags.svg;
        const name = data.name.common;
        const capital = data.capital?.[0] || "Không rõ";
        const population = data.population;
        const area = data.area;
        const currency = Object.values(data.currencies || {})[0]?.name || "Không rõ";
        const region = data.region;
        const languages = Object.values(data.languages || {}).join(", ") || "Không rõ";

        return `
          <img src="${flag}" alt="Flag of ${name}" />
          <h3>${name}</h3>
          <p><strong>Thủ đô:</strong> ${capital}</p>
          <p><strong>Dân số:</strong> ${population.toLocaleString()}</p>
          <p><strong>Diện tích:</strong> ${area.toLocaleString()} km²</p>
          <p><strong>Tiền tệ:</strong> ${currency}</p>
          <p><strong>Khu vực:</strong> ${region}</p>
          <p><strong>Ngôn ngữ:</strong> ${languages}</p>
        `;
      };

      // Hiển thị thẻ từng quốc gia
      const card1 = document.createElement("div");
      card1.className = "compare-card";
      card1.innerHTML = cardHTML(data1);

      const card2 = document.createElement("div");
      card2.className = "compare-card";
      card2.innerHTML = cardHTML(data2);

      result.appendChild(card1);
      result.appendChild(card2);

      // 🟡 So sánh kết quả:
      const area1 = data1.area, area2 = data2.area;
      const pop1 = data1.population, pop2 = data2.population;
      const lang1 = Object.keys(data1.languages || {}).length;
      const lang2 = Object.keys(data2.languages || {}).length;

      const getCompare = (a, b, label) => {
        if (a > b) return `✅ <strong>${name1}</strong> có ${label} lớn hơn`;
        if (a < b) return `✅ <strong>${name2}</strong> có ${label} lớn hơn`;
        return `⚖️ Hai quốc gia có ${label} bằng nhau`;
      };

      summary.innerHTML = `
        <h3>📊 Kết quả So sánh</h3>
        <p>${getCompare(area1, area2, "diện tích")}</p>
        <p>${getCompare(pop1, pop2, "dân số")}</p>
        <p>${getCompare(lang1, lang2, "số lượng ngôn ngữ")}</p>
      `;
    }