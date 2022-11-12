import { useBookingStore } from '../stores/booking.js'

import weatherService from '../services/weather.js'

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
        bookingStore: useBookingStore(),
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
            { hour: 14, selected: false, disabled: true }
        ],
        showTooltip: false,
        tooltipContent: ''
    }),
    async created() {

        const data = await weatherService.getWeather()

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
                selected: false
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
        this.updateValidDays()
        this.updateSelectedDate()
    },
    mounted() {
        for (let time of this.times) {
            if (this.bookingStore.selectedTime == time.hour)
                time.selected = true
        }
    },
    methods: {
        updateValidDays() {
            for (let day of this.days) {
                day.disabled = day.temp < 14 || day.weather == 'rainy'
            }
        },
        updateSelectedDate() {
            for (let day of this.days) {
                const month = day.date.getMonth()
                const dayOfMonth = day.date.getDate()
                if (month == this.bookingStore.selectedMonth
                    && dayOfMonth == this.bookingStore.selectedDay) {
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
            this.bookingStore.selectedMonth = day.date.getMonth()
            this.bookingStore.selectedDay = day.date.getDate()
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
            this.bookingStore.selectedTime = time.hour
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
                        :disabled="!hasSelectedDay"
                    >
                        {{ to12hour(time.hour) }}
                    </button>
                </div>
                <div style="display: grid; margin-top: 1rem">
                    <button
                        @click="bookingStore.next()"
                        :disabled="!canContinue"
                    >
                        Continue
                    </button>
                </div>
            </div>
            <!-- OpenWeather attribution -->
            <div style="font-size: 1.2rem; display: flex; flex-direction: row; align-items: center; justify-content: center;">
                <div style="opacity: 0.8">Weather data provided by</div>
                <a href="https://openweathermap.org/" target="_blank" class="no-line">
                    <img src="media/OpenWeather-Negative-Logo RGB.png" style="max-width: 8rem">
                </a>
            </div>
        </div>
    `
}