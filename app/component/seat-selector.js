import { useBookingStore } from '../stores/booking.js'
import { useBoatStore } from '../stores/boat.js'

export default {
    setup() {
        return {
            bookingStore: useBookingStore(),
            boatStore: useBoatStore()
        }
    },
    data: () => ({
        cols: 0,
        rows: 0,
        seats: [],
        loading: true,
        error: null,
        hover: null,
        hoverX: 0,
        hoverY: 0
    }),
    async created() {
        const boats = await this.boatStore.loadBoats()
        const boat = boats.filter(boat => boat.id.toLowerCase() == this.bookingStore.selectedBoat.toLowerCase())[0]

        this.rows = boat.rows
        this.cols = boat.cols

        this.seats = boat.seats

        for (let seat of this.seats) {
            seat.selected = this.bookingStore.selectedSeats.includes(seat.id)
        }

        console.log(this.seats)

        this.loading = false
    },
    methods: {
        async load() {
            try {
                this.loading = true
                this.error = null
                const res = await fetch('data/seats/tere.xml')
                if (!res.ok) {
                    this.error = `Error: ${res.statusText}`
                    return null
                }
                return await res.text()
            } finally {
                this.loading = false    
            }
        },
        seatClicked(seat) {
            if (!seat.available) return;
            seat.selected = !seat.selected;
            const arr = []
            const index = this.bookingStore.selectedSeats.indexOf(seat.id)
            if (seat.selected) {
                if (index == -1)
                    this.bookingStore.selectedSeats.push(seat.id)
            } else {
                if (index != -1)
                    this.bookingStore.selectedSeats.splice(index, 1)
            }
        },
        mouseEnter(seat) {
            this.hover = seat
        },
        mouseMove(/** @type{MouseEvent} */e) {
            this.hoverX = e.target.offsetLeft + e.offsetX + 16
            this.hoverY = e.target.offsetTop + e.offsetY + 16
        },
        mouseLeave() {
            this.hover = null
        }
    },
    computed: {
        popupX() { return `${this.hoverX}px` },
        popupY() { return `${this.hoverY}px` },
        selectedSeats() { return this.seats.filter(x => x.selected) },
        totalPrice() {
             return this.selectedSeats.length
                ? this.selectedSeats.map(x => x.price).reduce((a,b)=>a+b)
                : 0
        }
    },
    template: /*html*/`
        <div>
            <h2 :style="{ textAlign: 'center', margin: '8px', fontSize: '2rem' }">Please select your seats.</h2>
            <div class="seats" :style="{ gridTemplateColumns: \`repeat($\{cols}, 1fr)\` }">
                <div v-if="loading">Loading...</div>
                <div v-if="error">{{ error }}</div>
                <Seat
                    v-if="seats"
                    v-for="seat in seats" v-bind="seat"
                    @clicked="seatClicked(seat)"
                    @pointerenter="mouseEnter(seat)"
                    @pointermove="mouseMove"
                    @pointerleave="mouseLeave"
                />
            </div>
            <div class="seat-info" :style="{ marginBottom: '1rem' }">
                <div>
                    Selected seats: {{ seats.filter(x => x.selected).length }}
                </div>
                <div>
                    Total price: $\{{totalPrice}}
                </div>
            </div>
            <div v-if="hover" class="seat-popup" :style="{ left: popupX, top: popupY }">
                <div v-if="hover.available">Price: $\{{ hover.price }}</div>
                <div v-else>This seat is unavailable.</div>
            </div>
            <div style="margin: 1rem" class="uniform-grid-columns">
                <button @click="bookingStore.back()">Back</button>
                <button @click="bookingStore.next()">Continue</button>
            </div>
        </div>
    `
}