import React, { useState } from "react";
import "./App.css";
import "./style.css";

const api = {
    key: "a146761eeea3a7788bd36df26f089ff0",
    base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
    const [search, setSearch] = useState("");
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [nextThreeDays, setNextThreeDays] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);

    const searchPressed = () => {
        fetch(`${api.base}weather?q=${search}&units=metric&lang=uk&appid=${api.key}`)
            .then((res) => res.json())
            .then((result) => {
                setWeather(result);
            });

        fetch(`${api.base}forecast?q=${search}&units=metric&lang=uk&appid=${api.key}`)
            .then((res) => res.json())
            .then((result) => {
                const uniqueDays = result.list.reduce((days, item) => {
                    const forecastDate = new Date(item.dt_txt).toLocaleDateString("uk", {
                        weekday: "short",
                    });
                    if (!days.includes(forecastDate)) {
                        days.push(forecastDate);
                    }
                    return days;
                }, []);

                const filteredForecast = result.list.filter((item) =>
                    uniqueDays.includes(
                        new Date(item.dt_txt).toLocaleDateString("uk", { weekday: "short" })
                    )
                );

                setNextThreeDays(uniqueDays);
                setForecast(filteredForecast);
            });
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    return (
        <div className="App">
            <header className="App-header">
                {/* HEADER */}
                <h1>Погода</h1>

                <div>
                    <input
                        type="text"
                        placeholder="Введіть місто..."
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button onClick={searchPressed}>Пошук</button>
                </div>

                {weather && (
                    <div className="container" style={{ fontWeight: "bold", fontSize: "20px", width: "1000px", height: '500px' }}>
                        <div className="weather-side">
                            <div className="weather-gradient"></div>
                            <div className="date-container">
                                <h2 className="date-dayname">
                                    {new Date().toLocaleDateString("uk", { weekday: "long" })}
                                </h2>
                                <span className="date-day">
                  {new Date().toLocaleDateString("uk")}
                </span>
                                <i className="location-icon" data-feather="map-pin"></i>
                                <span className="location">{search}</span>
                            </div>
                            <div className="weather-container">
                                <i className="weather-icon" data-feather="sun"></i>
                                <h1 className="weather-temp">{weather.main.temp}°C</h1>
                                <h3 className="weather-desc">{weather.weather[0].description}</h3>

                            </div>

                        </div>
                        <div className="info-side">
                            <div className="today-info-container">
                                <div className="today-info">
                                    <div className="precipitation">
                                        <span className="title" style={{ fontWeight: "bold", fontSize: "20px" }}>ОПАДИ</span>
                                        <span className="value">{weather.main.humidity} %</span>
                                        <div className="clear"></div>
                                    </div>
                                    <div className="humidity">
                                        <span className="title" style={{ fontWeight: "bold", fontSize: "20px" }}>ВОЛОГІСТЬ</span>
                                        <span className="value">{weather.main.humidity} %</span>
                                        <div className="clear"></div>
                                    </div>
                                    <div className="wind">
                                        <span className="title" style={{ fontWeight: "bold", fontSize: "20px" }}>ВІТЕР</span>
                                        <span className="value">{weather.wind.speed} m/s</span>
                                        <div className="clear"></div>
                                    </div>
                                </div>
                            </div>
                            {selectedDay && (
                                <div>
                                    <h2>{selectedDay}:</h2>
                                    {forecast
                                        .filter(
                                            (item) =>
                                                new Date(item.dt_txt).toLocaleDateString("uk", {
                                                    weekday: "short",
                                                }) === selectedDay
                                        )
                                        .slice(0, 1) 
                                        .map((item) => (
                                            <div key={item.dt}>
                                                <p>Температура: {item.main.temp}°C</p>
                                                <p>{item.weather[0].description}</p>
                                            </div>
                                        ))}
                                </div>
                            )}
                            <div className="week-container">
                                <ul className="week-list">
                                    {nextThreeDays.map((day) => (
                                        <li key={day} onClick={() => handleDayClick(day)} className={selectedDay === day ? 'active' : ''}>
                                            <i className="day-icon" data-feather="sun"></i>
                                            <span className="day-name">{day}</span>
                                            <span className="day-temp">
                        {forecast.find((item) =>
                            new Date(item.dt_txt).toLocaleDateString("uk", { weekday: "short" }) === day
                        ).main.temp}°C
                      </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;
