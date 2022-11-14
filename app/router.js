import Home from './page/home.js'
import Booking from './page/booking.js'
import Game from '../game/Game.js'

const routes = [
    { path: '/', component: Home },
    { path: '/booking', component: Booking },
    { path: '/game', component: Game }
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
})

export default router