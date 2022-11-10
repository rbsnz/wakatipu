const { ref } = Vue
import { useBookingStore } from '../stores/booking.js'

const ApiKey = '0c2babeae2af2e14fd58214c0fd330fa'
const Coords = { lat: -45.05, lon: 168.5 }
const DayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

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

export default {
    data: () => ({
        store: useBookingStore(),
        loading: true,
        days: Array.from({ length: 5 }, _ => ({
            day: 0,
            weekDay: '',
            weather: '',
            temp: 0,
            selected: false,
            disabled: true
        })),
        times: [
            { hour: 10, selected: false, disabled: true },
            /*{ hour: 11, selected: false, disabled: true },
            { hour: 12, selected: false, disabled: true },
            { hour: 13, selected: false, disabled: true },*/
            { hour: 14, selected: false, disabled: true }
        ],
        showTooltip: false,
        tooltipContent: ''
    }),
    async created() {

        const url = `https://api.openweathermap.org/data/2.5/forecast?`
            + `lat=${Coords.lat}`
            + `&lon=${Coords.lat}`
            + `&units=metric`
            + `&appid=${ApiKey}`

        const res = await fetch('/test/weather.json')
        const resolver = (resolve) => resolve()
        await new Promise((resolve) => setTimeout(() => resolve(), 1000))
        const data = await res.json()

        const w = data.list.map(x => {
            let date = new Date(x.dt * 1000)
            let dayNum = date.getDate()
            let dayOfWeek = date.getDay()
            let dayName = DayNames[dayOfWeek]
            let weather = getWeatherType(x.weather[0].id)
            return {
                date: date,
                day: dayNum,
                weekDay: dayName,
                weather,
                temp: x.main.temp,
                selected: false,
                disabled: /*x.main.temp < 14 || */weather == 'rainy'
            }
        }).filter((val, idx, arr) => {
            if (idx == 0) return true
            if (val.date.getDate() == arr[idx-1].date.getDate())
                return false
            return true
        }).slice(0, 5)

        for (let i = 0; i < this.days.length; i++)
            Object.assign(this.days[i], w[i])

        this.loading = false
    },
    methods: {
        selectDay(day) {
            // if (day.temp < 14) return
            for (const day of this.days) {
                day.selected = false
            }
            day.selected = true
            const now = new Date()
            if (now.getMonth() == day.date.getMonth()
                && now.getDate() == day.date.getDate()) {
                for (let time of this.times) {
                    time.disabled = now.getHours() >= time.hour
                }
            } else {
                for (let time of this.times)
                    time.disabled = false
            }
        },
        selectTime(time) {
            for (let t of this.times)
                t.selected = false
            time.selected = true
        },
        to12hour(hour) {
            const period = hour >= 12 ? 'PM' : 'AM'
            hour = hour > 12 ? hour - 12 : hour
            return `${hour} ${period}`
        },
        hoverDay(day) {
            if (day.disabled) {
                let weatherDesc = ''
                if (day.temp < 14)
                    weatherDesc += 'cold'
                if (day.weather == 'rainy') {
                    if (weatherDesc.length > 0)
                        weatherDesc += ', '
                    weatherDesc += 'rainy'
                }
                this.tooltipContent = `Due to the ${weatherDesc} weather, we are unable to depart on this day`
                this.showTooltip = true
            }
        },
        hoverTime(time) {

        },
        unhover() {
            this.showTooltip = false
        }
    },
    computed: {
        hasValidTime() {
            for (let day of this.days) {
                if (day.temp < 14 || day.weather == 5) continue
                return true
            }
            return false
        },
        canContinue() {
            return (
                this.days.filter(x => x.selected && !x.disabled).length > 0 &&
                this.times.filter(x => x.selected && !x.disabled).length > 0
            )
        }
    },
    template: /*html*/`
        <div style="display: flex; flex-direction: column; margin: 1rem; font-size: 2rem">
            <div style="margin-bottom: 1rem; display: flex">
                <div style="width: 0px; flex-grow: 1">
                    <template v-if="loading">Loading the weather...</template>
                    <template v-else-if="hasValidTime">Please select a date and time.</template>
                    <template v-else>
                        Due to the weather, there are currently
                        no available departure times.
                        Please check back later.
                    </template>
                </div>
            </div>
            <div class="weather-days" style="margin-bottom: 1rem">
                <WeatherDay
                    v-for="day in days" v-bind="day"
                    :loading="loading"
                    @click="selectDay(day)"
                    @pointerenter="hoverDay(day)"
                    @pointerleave="unhover"
                />
            </div>
            <div class="times">
                <button
                    class="time" v-for="time in times" v-bind="time"
                    @pointerenter="hoverTime(time)"
                    @pointerleave="unhover"
                    @click="selectTime(time)"
                    :class="{ selected: time.selected }"
                >
                    {{ to12hour(time.hour) }}
                </button>
                <!--<button class="time" disabled>10 AM</button>
                <button class="time" disabled>2 PM</button>-->
            </div>
            <div style="display: grid; margin-top: 1rem">
                <button
                    @click="store.nextStep()"
                    :disabled="!canContinue"
                >
                    Continue
                </button>
            </div>
        </div>
        <Tooltip :visible="showTooltip">{{tooltipContent}}</Tooltip>
    `
}