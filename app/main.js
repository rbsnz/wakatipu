import App from './app.js'
import Seats from './component/seats.js'
import Seat from './component/seat.js'
import DateSelector from './component/date-selector.js'
import WeatherDay from './component/weather-day.js'

import router from './router.js'

const app = Vue.createApp(App)
app
    .component('DateSelector', DateSelector)
    .component('WeatherDay', WeatherDay)
    .component('Seats', Seats)
    .component('Seat', Seat)
app.use(router)
app.mount('#app')