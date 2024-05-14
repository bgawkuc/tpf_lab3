let clickCount = 0;

const countryInput = document.getElementById("country");
const countriesList = document.getElementById("countries");
const countryCodeInput = document.getElementById("countryCode");

const myForm = document.getElementById("form");
const modal = document.getElementById("form-feedback-modal");
const clicksInfo = document.getElementById("click-count");

function handleClick() {
  clickCount++;
  clicksInfo.innerText = clickCount;
}

function filterCountries(inputText) {
  const options = countriesList.querySelectorAll("option");
  options.forEach((option) => {
    const countryName = option.textContent.toLowerCase();
    const inputTextLower = inputText.toLowerCase();
    if (countryName.includes(inputTextLower)) {
      option.style.display = "";
    } else {
      option.style.display = "none";
    }
  });
}

async function fetchAndFillCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) {
      throw new Error("Błąd pobierania danych");
    }
    const data = await response.json();
    const countries = data.map((country) => country.name.common);
    countriesList.innerHTML = countries
      .map((country) => `<option value="${country}">${country}</option>`)
      .join("");
    getCountryByIP();
  } catch (error) {
    console.error("Wystąpił błąd:", error);
  }
}

function getCountryByIP() {
  fetch("https://get.geojs.io/v1/ip/geo.json")
    .then((response) => response.json())
    .then((data) => {
      const country = data.country;
      countryInput.value = country;
      getCountryCode(country);
    })
    .catch((error) => {
      console.error("Błąd pobierania danych z serwera GeoJS:", error);
    });
}

function getCountryCode(countryName) {
  const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
  console.log(countryName, "ff");

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Błąd pobierania danych");
      }
      return response.json();
    })
    .then((data) => {
      const countryCode = data[0].idd.root + data[0].idd.suffixes.join("");
      const options = countryCodeInput.querySelectorAll("option");

      options.forEach((option) => {
        console.log(option.value);
        if (option.value === countryCode) {
          option.selected = true;
        } else {
          option.selected = false;
        }
      });
      countryCodeInput.value = countryCode;
    })
    .catch((error) => {
      console.error("Wystąpił błąd:", error);
    });
}

(() => {
  // nasłuchiwania na zdarzenie kliknięcia myszką
  document.addEventListener("click", handleClick);

  countryInput.addEventListener("input", (event) => {
    const inputText = event.target.value.trim();
    filterCountries(inputText);
    getCountryCode(inputText);
  });

  fetchAndFillCountries();
})();
