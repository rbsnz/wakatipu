import { API_KEY } from './weather-key.js'

const LAT = -45.05
const LON = 168.5

const TEST = true

const weatherService = {
    async getWeather(url = null) {
        if (!url) {
            url = `https://api.openweathermap.org/data/2.5/forecast?`
                + `lat=${LAT}`
                + `&lon=${LON}`
                + `&units=metric`
                + `&appid=${API_KEY}`
        }

        if (TEST) {
            url = '/test/weather-auckland.json'
            await new Promise((resolve) => setTimeout(() => resolve(), 1500))
        }
        
        const res = await fetch(url)
        return await res.json()
    },
    getWeatherType(id) {
        switch (Math.floor(id / 100)) {
            case 2: return 'Thunderstorm'
            case 3: return 'Showers'
            case 5: return 'Rain'
            case 6: return 'Snow'
            case 7: switch (id) {
                case 701: return 'Mist'
                case 711: return 'Smoke'
                case 721: return 'Haze'
                case 731: return 'Dust'
                case 741: return 'Fog'
                case 751: return 'Sand'
                case 761: return 'Dust'
                case 762: return 'Ash'
                case 771: return 'Squall'
                case 781: return 'Tornado'
            }
            case 8: return id == 800 ? 'Clear' : 'Clouds'
        }
        return 'Unknown'
    },
    getWeatherDescription(id) {
        
    },
    getWeatherImage(id) {
        const urlBase = '/media/amcharts_weather_icons_1.0.0/animated/'
        let fileName = null
        switch (Math.floor(id / 100)) {
            case 2: fileName = 'thunder.svg'; break
            case 3: fileName = 'rainy-5.svg'; break
            case 5: // Rain
                switch (id) {
                    case 500: fileName = 'rainy-1.svg'; break
                    case 501: fileName = 'rainy-2.svg'; break
                    case 502: fileName = 'rainy-3.svg'; break
                    case 503: fileName = 'rainy-4.svg'; break
                    case 504: fileName = 'rainy-5.svg'; break
                    default: fileName = 'rainy-6.svg'; break
                }
                break
            case 6: // Snow
                fileName = 'snowy-6.svg'
                break
            case 7: break
            case 8:
                switch (id) {
                    case 800: fileName = 'day.svg'; break
                    case 801: fileName = 'cloudy-day-1.svg'; break
                    case 802: fileName = 'cloudy-day-2.svg'; break
                    case 803: fileName = 'cloudy-day-3.svg'; break
                    case 804: fileName = 'cloudy.svg'; break
                }
                break
        }
        if (!fileName)
            return undefined
        return `${urlBase}${fileName}`
    }
}

export default weatherService