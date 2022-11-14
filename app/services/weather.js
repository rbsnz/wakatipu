const ApiKey = '45ea75cf794e6c40833db5e3e8b69a6f'

const Coords = { lat: -45.05, lon: 168.5 }

const DayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const RandomWeatherIds = [800, 801, 500]

import { toDateString } from '../util/time.js'

function getWeatherType(id) {
    let group = Math.floor(id / 100)
    switch (group) {
        case 2: return 'thunder'
        case 3: return 'shower'
        case 5: return 'rainy'
        case 6: return 'snowy'
        case 7: return 'misty'
        case 8: return id == 800 ? 'sunny' : 'cloudy'
    }
}

const cacheInterval = 1000 * 60 * 10 // cache weather for 10 minutes
let lastUpdate = null
let cachedWeather = null

export default {
    async getWeather() {
        const now = new Date()

        if (cachedWeather && (now.getTime() - lastUpdate.getTime()) < cacheInterval) {
            return cachedWeather
        }

        if (localStorage.getItem('wakatipuUseRandomWeather')) {
            await new Promise((resolve) => setTimeout(() => resolve(), 1500))
            lastUpdate = now
            return (cachedWeather = this.getRandomWeather())
        }
        
        const url = `https://api.openweathermap.org/data/2.5/forecast?`
            + `lat=${Coords.lat}&lon=${Coords.lon}`
            + `&units=metric&appid=${ApiKey}`
        const res = await fetch(url)
        const data = await res.json()

        const list = []

        let currentDate = null
        for (const item of data.list) {
            const date = new Date(item.dt * 1000)
            const key = toDateString(date)
            if (currentDate == key) continue
            currentDate = key
            list.push({
                date,
                day: date.getDate(),
                weekDay: DayNames[date.getDay()],
                weatherId: item.weather[0].id,
                weatherType: getWeatherType(item.weather[0].id),
                temp: item.main.temp,
                selected: false,
                disabled: true
            })
        }

        lastUpdate = now
        return (cachedWeather = list)
    },
    getRandomWeather() {
        const now = Date.now()
        const unitDay = 24 * 60 * 60 * 1000
        const list = []
        for (let i = 0; i < 5; i++) {
            const date = new Date(now + i * unitDay)
            const weatherId = RandomWeatherIds[Math.floor(Math.random() * RandomWeatherIds.length)]
            list.push({
                date: date,
                day: date.getDate(),
                weekDay: DayNames[date.getDay()],
                weatherId,
                weatherType: getWeatherType(weatherId),
                temp: 10 + Math.random() * 10,
                selected: false,
                disabled: true
            })
        }
        return list
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
