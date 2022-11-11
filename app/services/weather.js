const API_KEY = '0c2babeae2af2e14fd58214c0fd330fa'
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

        // -36.848461, and the longitude is 174.763336
        // https://api.openweathermap.org/data/2.5/forecast?lat=-36.848461&lon=174.763336&units=metric&appid=0c2babeae2af2e14fd58214c0fd330fa

        if (TEST) {
            url = '/test/weather-auckland.json'
            await new Promise((resolve) => setTimeout(() => resolve(), 1500))
        }
        
        const res = await fetch(url)
        return await res.json()
    }
}

export default weatherService