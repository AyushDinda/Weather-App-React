import { useEffect, useRef, useState } from 'react'
import {
  ArrowBigDown, ArrowBigUp, Cloud, CloudDrizzle, CloudLightning,
  CloudMoon, CloudRainWind, CloudSun, Cloudy, Droplets, Gauge, Moon,
  ScanEye, Search, Snowflake, Sun, Sunrise, Sunset,
  Thermometer, Waves, Wind
} from 'lucide-react'
import './Weather.css'

const Weather = () => {

  const inputRef = useRef()
  const [weather, setWeather] = useState(null)
  const [message, setMessage] = useState("Search for a city to see weather")

  const allIcons = {
    "01d": <Sun className="weather-icon" />,
    "01n": <Moon className="weather-icon moon" />,
    "02d": <CloudSun className="weather-icon" />,
    "02n": <CloudMoon className="weather-icon" />,
    "03d": <Cloud className="weather-icon" />,
    "03n": <Cloud className="weather-icon" />,
    "04d": <Cloudy className="weather-icon" />,
    "04n": <Cloudy className="weather-icon" />,
    "09d": <CloudDrizzle className="weather-icon" />,
    "09n": <CloudDrizzle className="weather-icon" />,
    "10d": <CloudRainWind className="weather-icon" />,
    "10n": <CloudRainWind className="weather-icon" />,
    "11d": <CloudLightning className="weather-icon" />,
    "11n": <CloudLightning className="weather-icon" />,
    "13d": <Snowflake className="weather-icon" />,
    "13n": <Snowflake className="weather-icon" />,
    "50d": <Waves className="weather-icon" />,
    "50n": <Waves className="weather-icon" />
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const search = async (city) => {

    // if (!city) return
    if (!city) {
      setMessage("Please enter a city name")
      setWeather(null)
      return
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`

      const res = await fetch(url)
      const data = await res.json()
      console.log(data)
      if (!res.ok) {
        setMessage("City not found ❌")
        setWeather(null)
        return
      }

      const icon = allIcons[data.weather[0].icon] || <Sun />

      setWeather({
        temperature: Math.floor(data.main.temp),
        feelsLike: Math.floor(data.main.feels_like),
        tempMax: Math.floor(data.main.temp_max),
        tempMin: Math.floor(data.main.temp_min),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: Math.floor(data.wind.speed * 3.6), // m/s → km/h
        visibility: data.visibility / 1000,
        sunrise: formatTime(data.sys.sunrise),
        sunset: formatTime(data.sys.sunset),
        location: data.name,
        icon: icon
      })
      setMessage("")

    } catch (err) {
      console.log(err)
      setMessage("Something went wrong ⚠️")
      setWeather(null)
    }
  }

  // useEffect(() => {
  //   search('Siliguri') // default city
  // }, [])

  return (
    <div className="weather">

      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a city..."
          onKeyDown={(e) => e.key === "Enter" && search(inputRef.current.value)}
        />
        <Search
          className="search-icon"
          onClick={() => search(inputRef.current.value)}
        />
      </div>
      {message && <div className="message">{message}</div>}
      {weather && (

        <div className="weather-body">

          {weather.icon}

          <p className='temp'>{weather.temperature}°C</p>
          <p className='location'>{weather.location}</p>

          {/* Row 1 */}
          <div className='weather-data'>

            <div className="col">
              <Thermometer className="data-icon" />
              <div>
                <span>Feels Like</span>
                <p>{weather.feelsLike}°C</p>
              </div>
            </div>

            <div className="col">
              <ArrowBigUp className="data-icon" />
              <div>
                <span>Max Temp</span>
                <p>{weather.tempMax}°C</p>
              </div>
            </div>

            <div className="col">
              <ArrowBigDown className="data-icon" />
              <div>
                <span>Min Temp</span>
                <p>{weather.tempMin}°C</p>
              </div>
            </div>

          </div>

          {/* Row 2 */}
          <div className='weather-data'>

            <div className="col">
              {/* <Droplets className="data-icon" /> */}
              <Gauge className="data-icon" />
              <div>
                <p>{weather.pressure} hPa</p>
                <span>Pressure</span>
              </div>
            </div>

            <div className="col">
              <Droplets className="data-icon" />
              <div>
                <p>{weather.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>

            <div className="col">
              <Wind className="data-icon" />
              <div>
                <p>{weather.windSpeed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>

          </div>

          {/* Row 3 */}
          <div className='weather-data'>

            <div className="col">
              <Sunrise className="data-icon" />
              <div>
                <p>{weather.sunrise}</p>
                <span>Sunrise</span>
              </div>
            </div>

            <div className="col">
              <Sunset className="data-icon" />
              <div>
                <p>{weather.sunset}</p>
                <span>Sunset</span>
              </div>
            </div>

            <div className="col">
              <ScanEye className="data-icon" />
              <div>
                <p>{weather.visibility} km</p>
                <span>Visibility</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default Weather