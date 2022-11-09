export default {
    props: {
        selected: Boolean,
        day: Number,
        weekDay: String,
        weather: String,
        temp: Number,
        loading: Boolean
    },
    template: /*html*/`
        <div class="weather-day" :class="weather">
            <div v-if="loading">
                Loading...
            </div>
            <template v-if="!loading">
                <div class="weather-temp">{{ Math.floor(temp) }}&deg;</div>
                <div class="weather-date">
                    <div class="weather-day-ofweek">{{ weekDay }}</div>
                    <div class="weather-day-number">{{ day }}</div>
                </div>
            </template>
        </div>
    `
}