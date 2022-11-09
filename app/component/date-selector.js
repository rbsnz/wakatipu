const ApiKey = '0c2babeae2af2e14fd58214c0fd330fa'
const Coords = { lat: -45.05, lon: 168.5 }
const DayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const WeatherTypes = {
    2: 'thunder',
    3: 'shower',
    5: 'rainy',
    6: 'snowy',
    8: 'sunny'
}

export default {
    data: () => ({
        weather: []
    }),
    async created() {

        this.weather = Array(5).fill({
            day: 0,
            weekDay: 'UNK',
            weather: '',
            temp: 0,
            loading: true
        })

        const url = `https://api.openweathermap.org/data/2.5/forecast?`
            + `lat=${Coords.lat}`
            + `&lon=${Coords.lat}`
            + `&units=metric`
            + `&appid=${ApiKey}`
        console.log(url)
        const res = await fetch(url)
        const data = await res.json()
        this.weather = data.list.map(x => {
            const date = new Date(x.dt * 1000)
            const dayNum = date.getDate()
            const dayOfWeek = date.getDay()
            let dayName = DayNames[dayOfWeek]
            const weatherType = Math.floor(x.weather[0].id / 100)
            return {
                date,
                day: dayNum,
                weekDay: dayName,
                weather: WeatherTypes[weatherType],
                temp: x.main.temp
            }
        }).filter((val, idx, arr) => {
            if (idx == 0) return true
            if (val.date.getDate() == arr[idx-1].date.getDate())
                return false
            return true
        }).slice(0, 5)
    },
    template: /*html*/`
        <div style="margin: 1rem; font-size: 2rem">
            <div style="margin: 1rem">Please select a date and time.</div>
            <div class="weather-days">
                <WeatherDay v-for="day in weather" v-bind="day" />
            </div>
        </div>
    `
}