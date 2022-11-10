import { useBookingStore } from '../stores/booking.js'

export default {
    setup() {
        return { store: useBookingStore() }
    },
    data: () => ({
        step: 0
    }),
    template: /*html*/`
        <div class="glass-container">
            <Transition mode="out-in">
                <div v-if="store.step == 0">
                    <DateSelector />
                </div>
                <div v-else-if="store.step == 1">
                    <Seats />
                </div>
            </Transition>
        </div>
    `
}