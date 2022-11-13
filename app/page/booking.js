import { useBookingStore } from '../stores/booking.js'

export default {
    setup: () => ({ store: useBookingStore() }),
    template: /*html*/`
        <Transition mode="out-in" @leave="store.transitioning=true" @after-leave="store.transitioning=false">
            <DateSelector v-if="store.step == 0" />
            <BoatSelector v-else-if="store.step == 1" />
            <SeatSelector v-else-if="store.step == 2" />
            <MenuSelector v-else-if="store.step == 3" />
            <Confirmation v-else-if="store.step == 4" />
            <Confirmed v-else-if="store.step == 5" />
        </Transition>
    `
}
