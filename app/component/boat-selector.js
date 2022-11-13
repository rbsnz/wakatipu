import { useBookingStore } from "../stores/booking.js"

export default {
    data: () => ({ store: useBookingStore() }),
    async mounted() {
        await this.store.loadBoats()
        for (const boat of Object.values(this.store.boats))
            boat.selected = (boat.id == this.store.selectedBoat)
    },
    computed: {
        canMoveNext() {
            return Object.values(this.store.boats).some(boat => boat.selected)
        }
    },
    template: /*html*/`
        <div class="glass-container">
            <div style="margin-bottom: 1rem; display: flex">Please select a boat.</div>
            <div class="uniform-grid-columns" style="margin-bottom: 1rem">
                <button v-for="boat in store.boats" @click="store.selectBoat(boat)" :class="{ selected: boat.selected }">
                    <div class="boat-name">{{ boat.name }}</div>
                    <div class="boat-image" :style="{ backgroundImage: 'url(media/' + boat.image + ')' }"></div>
                    <div>Maximum capacity: {{ Object.keys(boat.seats).length }}</div>
                    <div>Seats available: {{ Object.values(boat.seats).filter(x => x.available).length }}</div>
                </button>
            </div>
            <div class="uniform-grid-columns">
                <button @click="store.back()">Back</button>
                <button @click="store.next()" :disabled="!canMoveNext">Continue</button>
            </div>
        </div>
    `
}