const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherCard = document.getElementById('weatherCard');
const welcomeMsg = document.getElementById('welcomeMsg');
const loader = document.getElementById('loader');

searchBtn.addEventListener('click', async () => {
    const city = cityInput.value;
    if (!city) return;

    // Show loader, hide others
    loader.classList.remove('hidden');
    weatherCard.classList.add('hidden');
    welcomeMsg.classList.add('hidden');

    try {
        // 1. Get Geocoding data
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
        const geoData = await geoRes.json();

        if (!geoData.results) throw new Error("City not found. Try another.");

        const { latitude, longitude, name, country } = geoData.results[0];

        // 2. Get Weather data with extra parameters
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m,apparent_temperature,cloudcover`);
        const weatherData = await weatherRes.json();

        // 3. Update UI
        document.getElementById('cityName').innerText = `${name}, ${country}`;
        document.getElementById('date').innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
        
        const current = weatherData.current_weather;
        document.getElementById('temp').innerText = Math.round(current.temperature);
        document.getElementById('wind').innerText = `${current.windspeed} km/h`;
        
        // Grab hourly data for humidity and feels like (taking first index as current)
        document.getElementById('humidity').innerText = `${weatherData.hourly.relativehumidity_2m[0]}%`;
        document.getElementById('feelsLike').innerText = `${Math.round(weatherData.hourly.apparent_temperature[0])}°C`;
        document.getElementById('clouds').innerText = `${weatherData.hourly.cloudcover[0]}%`;
        
        document.getElementById('description').innerText = getWeatherDesc(current.weathercode);

        // Success: show card
        loader.classList.add('hidden');
        weatherCard.classList.remove('hidden');

    } catch (error) {
        loader.classList.add('hidden');
        welcomeMsg.classList.remove('hidden');
        alert(error.message);
    }
});

// Helper function to translate weather codes
function getWeatherDesc(code) {
    const mapping = {
        0: "Clear Sky",
        1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
        45: "Foggy", 48: "Rime Fog",
        51: "Light Drizzle", 61: "Rainy",
        71: "Snowy", 95: "Thunderstorm"
    };
    return mapping[code] || "Variable Conditions";
}