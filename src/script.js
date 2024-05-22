const searchBtn = document.getElementById("search-btn");
const CurrentLocationBtn = document.getElementById("current-location-btn");
// const apiKey = "8f6200216e7a219e044fb1179fea87b6";

searchBtn.addEventListener("click", function () {
  const city = document.getElementById("city-input").value.trim();
  fetchWeather(city);
});

const fetchWeather = async (city) => {
  const apiKey = "8f6200216e7a219e044fb1179fea87b6";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("error fetching data", error);
  }
};

const updateWeather = (data) => {
  const current = data.list[0];
  document.getElementById("current-date").innerHTML = new Date(
    current.dt * 1000
  ).join("/ ");
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

    for(let i = 1; i<=5;i++){
        
    }
};
