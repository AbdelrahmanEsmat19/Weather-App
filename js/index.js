async function getWeather(query) {
  try {
    const apiResponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=27b18dee6e9f4c2c8cc182244241006&q=${query}&days=7`);
    const finalResponse = await apiResponse.json();
    displayWeather(finalResponse);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.getElementById('data').innerHTML = "Error: Unable to fetch weather data.";
  }
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude},${position.coords.longitude}`;
        getWeather(coords);
      },
      (error) => {
        console.error("Error getting location:", error);
        getWeather("egypt"); 
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    getWeather("egypt"); 
  }
}

const searchInput = document.querySelector("#Search");
searchInput.addEventListener('change', function () {
  searchCountry(searchInput.value);
});

async function searchCountry(country) {
  try {
    const apiSearch = await fetch(`https://api.weatherapi.com/v1/search.json?key=27b18dee6e9f4c2c8cc182244241006&q=${country}`);
    const searchData = await apiSearch.json();
    if (searchData && searchData.length > 0) {
      getWeather(searchData[0].name);
    } else {
      document.getElementById('data').innerHTML = "Error: No results found.";
    }
  } catch (error) {
    console.log("Error fetching search data:", error);
    document.getElementById('data').innerHTML = "Error: Unable to fetch search data.";
  }
}

function displayWeather(allData) {
  const currentWeather = allData.current;
  const hourlyForecast = allData.forecast.forecastday[0].hour;
  const dayForecast = allData.forecast.forecastday;
  const locationName = allData.location.name;
  const locationCountry = allData.location.country;

  let blackBox = `
    <div class="col-md-5 text-center rounded-5">
    <div class="mt-4">${locationCountry}</div>

      <div class="mt-4">${locationName}</div>
      <div>
        <h5 class="display-1 py-4 fw-bold">${currentWeather.temp_c}°C</h5>
        <p class="card-text">${currentWeather.condition.text}</p>
        <div><p><img src="${currentWeather.condition.icon}" alt=""></p></div>
      </div>
      <div class="row g-4">
        <div >
          <div class="mb-3">
            <div class="border rounded ">Feels Like</div>
            <div class="border rounded">
              <h5 class="py-2">${currentWeather.feelslike_c}°C</h5>
            </div>
          </div>
        </div>
        <div >
          <div>
            <div class="border rounded">Precipitation</div>
            <div class="border rounded">
              <h5 class="py-2">${currentWeather.precip_mm}"</h5>
            </div>
          </div>
        </div>
        <div >
          <div>
            <div class="border rounded">Visibility</div>
            <div class="border rounded">
              <h5 class="py-2">${currentWeather.vis_miles} mi</h5>
            </div>
          </div>
        </div>
        <div >
          <div>
            <div class="border rounded">Humidity</div>
            <div class="border rounded">
              <h5 class="py-2">${currentWeather.humidity}%</h5>
            </div>
          </div>
          <div class="border rounded mt-5">
            <h5>7-Day Forecast</h5>
          </div>
          <div class="row border rounded">
  `;

  dayForecast.forEach((day) => {
    const dateObj = new Date(day.date);
    const month = dateObj.getMonth() + 1;
    const dayNumber = dateObj.getDate();
    const dayIndex = dateObj.getDay();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = dayNames[dayIndex];

    blackBox += `
      <div class="col-4">
        <p class="pt-3">${dayName}</p>
        <p>${month}/${dayNumber}</p>
        <p>${day.day.maxtemp_c}°C</p>
        <img src="${day.day.condition.icon}" alt="">
      </div>
    `;
  });

  blackBox += `
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 ms-sm-5 ms-lg-5 mt-4 text-center">
      <div class="border mb-3 rounded-5">
        <div class="border-bottom">Hourly Forecast</div>
        <div class="card-body">
          <div class="row  text-center">
  `;

  hourlyForecast.forEach((hour) => {
    const date = new Date(hour.time);
    const hours = date.getHours();
    blackBox += `
      <div class="col-4 col-sm-4 col-md-4 col-lg-4">
        <p>${hours}:00</p>
        <p class="fs-4">${hour.temp_c}°C</p>
        <img class="mb-4 border-bottom" src="${hour.condition.icon}" alt="">
      </div>
    `;
  });
  
  blackBox += `
            </div>
          </div>
        </div>
      </div>
    `;
  document.getElementById('data').innerHTML = blackBox;
}
getLocation();
