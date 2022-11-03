import App from './app.js'
import Home from './home.js'
import Booking from './booking.js'
import Seats from './seats.js'
import Seat from './seat.js'

const routes = [
    { path: '/', component: Home },
    { path: '/booking', component: Booking },
    { path: '/seats', component: Seats }
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
})

const app = Vue.createApp(App)
app
    .component('Seats', Seats)
    .component('Seat', Seat)
app.use(router)
app.mount('#app')