class WeatherApp {
    constructor() {
        this.API_KEY = 'YOUR API KEY'; // You'll need to get a free API key from OpenWeatherMap
        this.currentUnit = 'celsius';
        this.currentWeatherData = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setCurrentDate();
        this.loadDefaultWeather();
    }

    bindEvents() {
        const searchBtn = document.getElementById('searchBtn');
        const cityInput = document.getElementById('cityInput');
        const unitToggle = document.getElementById('unitToggle');

        searchBtn.addEventListener('click', () => this.handleSearch());
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
        cityInput.addEventListener('input', (e) => this.handleInputChange(e));
        unitToggle.addEventListener('click', () => this.toggleUnit());

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSuggestions();
            }
        });
    }

    setCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
    }

    handleSearch() {
        const city = document.getElementById('cityInput').value.trim();
        if (city) {
            this.getWeatherData(city);
        }
    }

    handleInputChange(e) {
        const query = e.target.value.trim();
        if (query.length > 2) {
            this.showSuggestions(query);
        } else {
            this.hideSuggestions();
        }
    }

    showSuggestions(query) {
        // Demo suggestions - in a real app, you'd fetch from a geocoding API
        const demoSuggestions = [
            'London, UK',
            'New York, USA',
            'Tokyo, Japan',
            'Paris, France',
            'Sydney, Australia',
            'Mumbai, India',
            'Berlin, Germany',
            'São Paulo, Brazil'
        ].filter(city => city.toLowerCase().includes(query.toLowerCase()));

        const suggestionsContainer = document.getElementById('suggestions');
        if (demoSuggestions.length > 0) {
            suggestionsContainer.innerHTML = demoSuggestions.map(city => 
                `<div class="suggestion-item" onclick="weatherApp.selectSuggestion('${city.split(',')[0]}')">${city}</div>`
            ).join('');
            suggestionsContainer.style.display = 'block';
        } else {
            this.hideSuggestions();
        }
    }

    selectSuggestion(city) {
        document.getElementById('cityInput').value = city;
        this.hideSuggestions();
        this.getWeatherData(city);
    }

    hideSuggestions() {
        document.getElementById('suggestions').style.display = 'none';
    }

    toggleUnit() {
        this.currentUnit = this.currentUnit === 'celsius' ? 'fahrenheit' : 'celsius';
        const unitBtn = document.getElementById('unitToggle');
        
        if (this.currentUnit === 'celsius') {
            unitBtn.innerHTML = '<span>°C</span> / <span>°F</span>';
        } else {
            unitBtn.innerHTML = '<span>°C</span> / <span style="opacity: 1;">°F</span>';
        }
        
        if (this.currentWeatherData) {
            this.updateTemperatureDisplay();
        }
    }

    showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('errorMessage').style.display = 'none';
        document.getElementById('weatherContent').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showError(message) {
        document.getElementById('errorText').textContent = message;
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('weatherContent').style.display = 'none';
        this.hideLoading();
    }

    async getWeatherData(city) {
        this.showLoading();

        // For demo purposes, we'll use mock data
        // In a real application, you would use the OpenWeatherMap API:
        /*
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.API_KEY}&units=metric`);
            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.API_KEY}&units=metric`);
            
            if (!response.ok) throw new Error('City not found');
            
            const data = await response.json();
            const forecastData = await forecastResponse.json();
            
            this.currentWeatherData = data;
            this.displayWeatherData(data, forecastData);
        } catch (error) {
            this.showError('Unable to fetch weather data. Please try again.');
        }
        */

        // Mock data for demonstration
        setTimeout(() => {
            const mockData = this.getMockWeatherData(city);
            this.currentWeatherData = mockData;
            this.displayWeatherData(mockData, this.getMockForecastData());
        }, 1000);
    }

    getMockWeatherData(city) {
        const weatherConditions = [
            { icon: 'fas fa-sun', desc: 'sunny', temp: 25 },
            { icon: 'fas fa-cloud-sun', desc: 'partly cloudy', temp: 20 },
            { icon: 'fas fa-cloud', desc: 'cloudy', temp: 18 },
            { icon: 'fas fa-cloud-rain', desc: 'rainy', temp: 15 },
            { icon: 'fas fa-snowflake', desc: 'snowy', temp: -2 }
        ];

        const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        
        return {
            name: city.charAt(0).toUpperCase() + city.slice(1),
            sys: { country: 'Country' },
            main: {
                temp: condition.temp + (Math.random() * 10 - 5),
                feels_like: condition.temp + (Math.random() * 6 - 3),
                humidity: Math.floor(Math.random() * 40) + 40,
                pressure: Math.floor(Math.random() * 50) + 1000
            },
            weather: [{
                main: condition.desc,
                description: condition.desc,
                icon: condition.icon
            }],
            wind: { speed: Math.random() * 20 + 5 },
            visibility: Math.floor(Math.random() * 5) + 8,
            clouds: { all: Math.floor(Math.random() * 80) + 10 }
        };
    }

    getMockForecastData() {
        const days = ['Tomorrow', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const weatherTypes = [
            { icon: 'fas fa-sun', desc: 'sunny' },
            { icon: 'fas fa-cloud-sun', desc: 'partly cloudy' },
            { icon: 'fas fa-cloud', desc: 'cloudy' },
            { icon: 'fas fa-cloud-rain', desc: 'light rain' }
        ];

        return {
            list: days.map(day => {
                const weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
                return {
                    dt_txt: day,
                    weather: [{ description: weather.desc, icon: weather.icon }],
                    main: {
                        temp_max: Math.floor(Math.random() * 15) + 15,
                        temp_min: Math.floor(Math.random() * 10) + 5
                    }
                };
            })
        };
    }

    displayWeatherData(data, forecastData) {
        this.hideLoading();
        
        // Update current weather
        document.getElementById('cityName').textContent = data.name;
        document.getElementById('countryName').textContent = data.sys.country;
        
        this.updateTemperatureDisplay();
        
        document.getElementById('weatherIcon').className = `${data.weather[0].icon} weather-icon`;
        document.getElementById('weatherDescription').textContent = data.weather[0].description;
        
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('windSpeed').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
        document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
        document.getElementById('visibility').textContent = `${data.visibility} km`;
        document.getElementById('cloudiness').textContent = `${data.clouds.all}%`;
        
        this.updateFeelsLikeTemperature();
        
        // Update forecast
        this.displayForecast(forecastData);
        
        // Show weather content with animation
        const weatherContent = document.getElementById('weatherContent');
        weatherContent.style.display = 'block';
        weatherContent.classList.add('fade-in');
        
        setTimeout(() => weatherContent.classList.remove('fade-in'), 500);
    }

    updateTemperatureDisplay() {
        if (!this.currentWeatherData) return;
        
        const tempCelsius = this.currentWeatherData.main.temp;
        const displayTemp = this.currentUnit === 'celsius' ? 
            Math.round(tempCelsius) : 
            Math.round((tempCelsius * 9/5) + 32);
        
        document.getElementById('temperature').textContent = displayTemp;
        document.querySelector('.temp-unit').textContent = this.currentUnit === 'celsius' ? '°C' : '°F';
    }

    updateFeelsLikeTemperature() {
        if (!this.currentWeatherData) return;
        
        const feelsLikeCelsius = this.currentWeatherData.main.feels_like;
        const displayTemp = this.currentUnit === 'celsius' ? 
            Math.round(feelsLikeCelsius) : 
            Math.round((feelsLikeCelsius * 9/5) + 32);
        
        document.getElementById('feelsLike').textContent = `${displayTemp}°${this.currentUnit === 'celsius' ? 'C' : 'F'}`;
    }

    displayForecast(forecastData) {
        const container = document.getElementById('forecastContainer');
        container.innerHTML = '';

        forecastData.list.forEach((item, index) => {
            const maxTempCelsius = item.main.temp_max;
            const minTempCelsius = item.main.temp_min;
            
            const maxTemp = this.currentUnit === 'celsius' ? 
                Math.round(maxTempCelsius) : 
                Math.round((maxTempCelsius * 9/5) + 32);
            const minTemp = this.currentUnit === 'celsius' ? 
                Math.round(minTempCelsius) : 
                Math.round((minTempCelsius * 9/5) + 32);

            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item slide-up';
            forecastItem.style.animationDelay = `${index * 0.1}s`;
            
            forecastItem.innerHTML = `
                <div class="forecast-day">${item.dt_txt}</div>
                <i class="${item.weather[0].icon} forecast-icon"></i>
                <div class="forecast-temps">
                    <span class="forecast-high">${maxTemp}°</span>
                    <span class="forecast-low">${minTemp}°</span>
                </div>
                <div class="forecast-desc">${item.weather[0].description}</div>
            `;
            
            container.appendChild(forecastItem);
        });
    }

    loadDefaultWeather() {
        // Load default weather for London
        this.getWeatherData('London');
    }
}

// Initialize the weather app
const weatherApp = new WeatherApp();

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add click animation to cards
    const cards = document.querySelectorAll('.current-weather, .forecast-section');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.search-btn, .unit-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    .search-btn, .unit-btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
