const searchBtn = document.getElementById("search-btn");
const CurrentLocationBtn = document.getElementById("current-location-btn");
const apiKey = "8f6200216e7a219e044fb1179fea87b6";

searchBtn.addEventListener("click", function () {
  const city = document.getElementById("city-input").value.trim();
  console.log(city);
});
