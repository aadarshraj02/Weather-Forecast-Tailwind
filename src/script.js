const searchBtn = document.getElementById("search-btn");
const CurrentLocationBtn = document.getElementById("current-location-btn");
// const apiKey = "8f6200216e7a219e044fb1179fea87b6";
const hideCurrent = document.querySelector(".hideCurrent");
const hideAll = document.querySelector(".hideAll");
const cityInput = document.getElementById("city-input");
const cityName = document.getElementById("city-name");
const errorMessage = document.getElementById("error-message");
const recentCities = document.getElementById("recent-cities");

searchBtn.addEventListener("click", function () {
  const city = document.getElementById("city-input").value.trim();
  if (!city) {
    alert("City Name is Empty");
    return;
  } else {
    fetchWeather(city);
    hideCurrent.classList.remove("hideCurrent");
    hideAll.classList.remove("hideAll");
  }
});

CurrentLocationBtn.addEventListener("click", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByCoords(lat, lon);
        hideCurrent.classList.remove("hideCurrent");
        hideAll.classList.remove("hideAll");
      },
      () => {
        displayError("Unable to retrieve your location");
      }
    );
  } else {
    alert("Location not supported");
  }
});

const fetchWeather = async (city) => {
  const apiKey = "8f6200216e7a219e044fb1179fea87b6";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      alert("City Not Found");
    } else {
      const data = await response.json();
      updateWeather(data);
      saveCityToLocalStorage(city);
      updateRecentCitiesDropdown();

      cityInput.value = "";
      cityName.innerHTML = `Weather forecast for ${data.city.name}`;
      clearError();
    }
  } catch (error) {
    displayError(error.message);
  }
};

async function fetchWeatherByCoords(lat, lon) {
  const apiKey = "8f6200216e7a219e044fb1179fea87b6";
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    updateWeather(data);
    cityName.innerHTML = `Weather forecast for ${data.city.name}`;
    clearError();
  } catch (error) {
    displayError(error.message);
  }
}

recentCities.addEventListener("change", (event) => {
  const city = event.target.value;
  if (city) {
    fetchWeather(city);
    hideCurrent.classList.remove("hideCurrent");
    hideAll.classList.remove("hideAll");
  }
});

const updateWeather = (data) => {
  const current = data.list[0];
  document.getElementById("current-date").innerHTML = new Date(
    current.dt * 1000
  ).toDateString();
  document.getElementById(
    "current-temp"
  ).textContent = `${current.main.temp}°C`;
  document.getElementById(
    "current-humidity"
  ).innerHTML = `${current.main.humidity}%`;
  document.getElementById(
    "current-wind-speed"
  ).innerHTML = `${current.wind.speed} km/h`;
  document.getElementById(
    "current-icon"
  ).src = `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
  document.getElementById("current-description").innerHTML =
    current.weather[0].description;

  for (let i = 1; i <= 5; i++) {
    const forecast = data.list[i * 8 - 1];
    const forecastEl = document.getElementById(`forecast-${i}`);
    forecastEl.innerHTML = `
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <p class="mb-1"><strong>Date:</strong> ${new Date(
              forecast.dt * 1000
            ).toDateString()}</p>
            <p class="mb-1"><strong>Temp:</strong> ${forecast.main.temp}°C</p>
            <p class="mb-1"><strong>Humidity:</strong> ${
              forecast.main.humidity
            }%</p>
            <p class="mb-1"><strong>Wind Speed:</strong> ${
              forecast.wind.speed
            } km/h</p>
          </div>
          <div class="flex flex-col items-center">
            <img src="http://openweathermap.org/img/wn/${
              forecast.weather[0].icon
            }@2x.png" alt="Weather Icon" class="w-24 h-24 mb-2" />
            <p>${forecast.weather[0].description}</p>
          </div>
        </div>
      `;
  }
};

function displayError(message) {
  errorMessage.innerHTML = "";
}

function clearError() {
  errorMessage.innerHTML = "";
}

function saveCityToLocalStorage(city) {
  let cities = JSON.parse(localStorage.getItem("recentCities")) || [];
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem("recentCities", JSON.stringify(cities));
  }
}

function updateRecentCitiesDropdown() {
  let cities = JSON.parse(localStorage.getItem("recentCities")) || [];
  recentCities.innerHTML = '<option value="">Select a city</option>';
  cities.forEach((city) => {
    let option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    recentCities.appendChild(option);
  });
  if (cities.length > 0) {
    recentCities.classList.remove("hidden");
  } else {
    recentCities.classList.add("hidden");
  }
}

updateRecentCitiesDropdown();
