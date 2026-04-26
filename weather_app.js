const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');

searchBtn.addEventListener('click', async () => {
    const city = cityInput.value;
    if (!city) return alert("Please enter a city");

    try {
        // 1. Get Coordinates for the city (Geocoding)
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
        const geoData = await geoRes.json();

        if (!geoData.results) throw new Error("City not found");

        const { latitude, longitude, name, country } = geoData.results[0];

        // 2. Get Weather using coordinates
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherRes.json();

        // 3. Update DOM
        document.getElementById('cityName').innerText = `${name}, ${country}`;
        document.getElementById('temp').innerText = Math.round(weatherData.current_weather.temperature);
        document.getElementById('wind').innerText = weatherData.current_weather.windspeed + " km/h";
        document.getElementById('description').innerText = "Current Weather";
        document.getElementById('code').innerText = `Code: ${weatherData.current_weather.weathercode}`;

    } catch (error) {
        alert(error.message);
    }
});