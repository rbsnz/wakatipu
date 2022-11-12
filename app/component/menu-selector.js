import { useBookingStore } from '../stores/booking.js'
import { useMenuStore } from '../stores/menu.js'

export default {
    setup: () => ({
        bookingStore: useBookingStore(),
        menuStore: useMenuStore()
    }),
    data: () => ({
        loading: true
    }),
    async mounted() {
        await this.menuStore.load()
        this.loading = false
    },
    data: () => ({ }),
    template: /*html*/`
        <div class="glass-container">
            <div style="margin-bottom: 1rem">Please select any meals or refreshments you would like during your trip.</div>
            <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem">
                <div v-for="item of menuStore.items" style="border: 1px solid rgba(255,255,255,0.4); border-radius: 2px; padding: 1rem">
                    {{ item.name }}
                </div>
            </div>
            <div class="uniform-grid-columns">
                <button @click="bookingStore.back()">Back</button>
                <button @click="bookingStore.next()">Continue</button>
            </div>
        </div>
    `
}
