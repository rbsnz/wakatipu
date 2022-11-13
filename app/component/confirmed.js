import { useBookingStore } from "../stores/booking.js"

export default {
    data: () => ({ store: useBookingStore() }),
    mounted() {
        this.store.confirm()
    },
    template: /*html*/`
        <div class="glass-container">
            <div style="margin-bottom: 1rem">Your booking has been completed!</div>
            <div class="uniform-grid-columns">
                <button @click="store.restart()">OK</button>
            </div>
        </div>
    `
}