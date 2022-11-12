import { useBookingStore } from '../stores/booking.js'

export default {
    setup: () => ({ store: useBookingStore() }),
    template: /*html*/`
        <Transition mode="out-in">
            <DateSelector v-if="store.step == 0" />
            <BoatSelector v-else-if="store.step == 1" />
            <SeatSelector v-else-if="store.step == 2" />
            <MenuSelector v-else-if="store.step == 3" />
        </Transition>
    `
}
