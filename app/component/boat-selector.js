import { useBookingStore } from "../stores/booking.js"
import { useBoatStore } from '../stores/boat.js'

export default {
    setup() {
        return {
            bookingStore: useBookingStore(),
            boatStore: useBoatStore()
        }
    },
    data: () => ({
        boats: []
    }),
    async mounted() {
        this.boats = await this.boatStore.loadBoats()
        for (let boat of this.boats) {
            boat.selected = (boat.name == this.bookingStore.selectedBoat)
        }
    },
    methods: {
        selectBoat(boat) {
            for (let boat of this.boats)
                boat.selected = false
            this.bookingStore.selectedBoat = boat.name
            boat.selected = true
        }
    },
    computed: {
        canMoveNext() {
            return this.boats.some((boat) => boat.selected)
        }
    },
    template: /*html*/`
        <div class="glass-container">
            <div style="margin-bottom: 1rem; display: flex">Please select a boat.</div>
            <div class="uniform-grid-columns" style="margin-bottom: 1rem">
                <button v-for="boat in boats" @click="selectBoat(boat)" :class="{ selected: boat.selected }">
                    <div class="boat-name">{{ boat.name }}</div>
                    <div class="boat-image" :style="{ backgroundImage: 'url(media/' + boat.image + ')' }"></div>
                    <div>Maximum capacity: {{ boat.seats.length }}</div>
                    <div>Seats available: {{ boat.seats.filter(x => x.available).length }}</div>
                </button>
            </div>
            <div class="uniform-grid-columns">
                <button @click="bookingStore.back()">Back</button>
                <button @click="bookingStore.next()" :disabled="!canMoveNext">Continue</button>
            </div>
        </div>
    `
}