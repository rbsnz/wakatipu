import { useBookingStore } from '../stores/booking.js'

export default {
    setup: () => ({
        store: useBookingStore()
    }),
    template: /*html*/`
        <div class="glass-container">
            <Transition mode="out-in">
                <div v-if="store.step == 0">
                    <DateSelector />
                </div>
                <div v-else-if="store.step == 1">
                    <BoatSelector />
                </div>
                <div v-else-if="store.step == 2">
                    <SeatSelector />
                </div>
            </Transition>
        </div>
    `
}
