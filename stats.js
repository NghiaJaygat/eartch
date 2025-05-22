
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then(data => {
        let largest = data[0];
        let smallest = data[0];
        let mostPopulous = data[0];
        let leastPopulous = data[0];
        let mostLanguages = data[0];

        data.forEach(country => {
          if (country.area > largest.area) largest = country;
          if (country.area < smallest.area) smallest = country;
          if (country.population > mostPopulous.population) mostPopulous = country;
          if (country.population < leastPopulous.population) leastPopulous = country;
          if (country.languages && Object.keys(country.languages).length > (mostLanguages.languages ? Object.keys(mostLanguages.languages).length : 0)) {
            mostLanguages = country;
          }
        });

        const statsDiv = document.getElementById('stats');
        statsDiv.innerHTML = `
          <div class="stat-block">
            <h3>🌍 Quốc gia lớn nhất:</h3>
            <p>${largest.name.common} - ${largest.area.toLocaleString()} km²</p>
          </div>
          <div class="stat-block">
            <h3>🏝️ Quốc gia nhỏ nhất:</h3>
            <p>${smallest.name.common} - ${smallest.area.toLocaleString()} km²</p>
          </div>
          <div class="stat-block">
            <h3>👥 Quốc gia đông dân nhất:</h3>
            <p>${mostPopulous.name.common} - ${mostPopulous.population.toLocaleString()} người</p>
          </div>
          <div class="stat-block">
            <h3>👶 Quốc gia ít dân nhất:</h3>
            <p>${leastPopulous.name.common} - ${leastPopulous.population.toLocaleString()} người</p>
          </div>
          <div class="stat-block">
            <h3>🗣️ Quốc gia có nhiều ngôn ngữ nhất:</h3>
            <p>${mostLanguages.name.common} - ${Object.keys(mostLanguages.languages).length} ngôn ngữ</p>
          </div>
        `;
      });
