import App from './app.js'
import BoatSelector from './component/boat-selector.js'
import SeatSelector from './component/seat-selector.js'
import Seat from './component/seat.js'
import DateSelector from './component/date-selector.js'
import WeatherDay from './component/weather-day.js'
import Tooltip from './component/tooltip.js'
import Game from '../game/game.js'

import router from './router.js'

const app = Vue.createApp(App)
const pinia = Pinia.createPinia()

app
    .component('Tooltip', Tooltip)
    .component('DateSelector', DateSelector)
    .component('BoatSelector', BoatSelector)
    .component('WeatherDay', WeatherDay)
    .component('SeatSelector', SeatSelector)
    .component('Seat', Seat)
    .component('Game', Game)
    .use(pinia)
    .use(router)
    .mount('#app')