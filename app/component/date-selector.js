import { toDateString } from '../util/time.js'
import { useBookingStore } from '../stores/booking.js'
import weatherService from '../services/weather.js'

export default {
    data: () => ({
        store: useBookingStore(),
        loading: true,
        days: Array.from({ length: 5 }, _ => ({
            day: 0,
            weekDay: '',
            weatherId: 0,
            weatherType: 'xx',
            temp: 0,
            selected: false,
            disabled: true
        })),
        times: [
            { hour: 10, selected: false, disabled: true },
            { hour: 14, selected: false, disabled: true }
        ],
        showTooltip: false,
        tooltipContent: ''
    }),
    async created() {
        const weather = await weatherService.getWeather()

        for (let i = 0; i < this.days.length; i++)
            Object.assign(this.days[i], weather[i])

        this.loading = false
        this.updateValidDays()
        this.updateSelectedDate()
    },
    mounted() {
        for (let time of this.times) {
            if (this.store.selectedTime == time.hour)
                time.selected = true
        }
    },
    methods: {
        updateValidDays() {
            for (let day of this.days) {
                day.disabled = day.temp < 14 || day.weatherType == 'rainy'
            }
        },
        updateSelectedDate() {
            for (let day of this.days) {
                if (this.store.selectedDate == toDateString(day.date)) {
                    this.selectDay(day)
                    break
                }
            }
        },
        selectDay(day) {
            for (const day of this.days) {
                day.selected = false
            }
            day.selected = true
            const dateString = toDateString(day.date)
            this.store.selectedDate = toDateString(day.date)
            const now = new Date()
            if (dateString == toDateString(now)) {
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
            this.store.selectedTime = time.hour
        },
        to12hour(hour) {
            const period = hour >= 12 ? 'PM' : 'AM'
            hour = hour > 12 ? hour - 12 : hour
            return `${hour} ${period}`
        },
        hoverDay(day) {
            if (day.disabled && !this.loading) {
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
        hasValidWeatherDay() {
            for (const day of this.days) {
                if (!day.disabled)
                    return true
            }
            return false
        },
        hasSelectedDay() {
            return this.days.some(x => !x.disabled && x.selected)
        },
        canContinue() {
            return (
                this.days.filter(x => x.selected && !x.disabled).length > 0 &&
                this.times.filter(x => x.selected && !x.disabled).length > 0
            )
        },
        isUsingLiveWeather() {
            return !localStorage.getItem('wakatipuUseRandomWeather')
        }
    },
    template: /*html*/`
        <div>
            <div class="glass-container" style="display: flex; flex-direction: column">
                <Tooltip :visible="showTooltip">{{tooltipContent}}</Tooltip>
                <div style="margin-bottom: 1rem; display: flex">
                    <div style="width: 0px; flex-grow: 1">
                        <template v-if="loading">Loading the weather...</template>
                        <template v-else-if="hasValidWeatherDay">Please select a date and time.</template>
                        <template v-else>
                            Due to the weather, there are currently
                            no available departure times.
                            Please check back later.
                            <router-link to="/game">Click here</router-link> to
                            play a game while you wait!
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
                        :disabled="!hasSelectedDay || time.disabled"
                    >
                        {{ to12hour(time.hour) }}
                    </button>
                </div>
                <div style="display: grid; margin-top: 1rem">
                    <button
                        @click="store.next()"
                        :disabled="!canContinue"
                    >
                        Continue
                    </button>
                </div>
            </div>
            <!-- OpenWeather attribution -->
            <div v-if="isUsingLiveWeather" style="font-size: 1.2rem; display: flex; flex-direction: row; align-items: center; justify-content: center;">
                <div style="opacity: 0.8">Weather data provided by</div>
                <a href="https://openweathermap.org/" target="_blank" class="no-line">
                    <img src="media/OpenWeather-Negative-Logo RGB.png" style="max-width: 8rem">
                </a>
            </div>
        </div>
    `
}