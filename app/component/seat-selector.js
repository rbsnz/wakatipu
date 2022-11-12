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
        hoveringSeat: null
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
            
            const index = this.bookingStore.selectedSeats.indexOf(seat.id)
            if (seat.selected) {
                if (index == -1)
                    this.bookingStore.selectedSeats.push(seat.id)
            } else {
                if (index != -1)
                    this.bookingStore.selectedSeats.splice(index, 1)
            }
        },
        hoverSeat(seat, e) {
            this.hoveringSeat = seat
            this.$refs.tt.onMouseMove(e)
        },
        unhover() {
            this.hoveringSeat = null
        }
    },
    computed: {
        selectedSeats() { return this.seats.filter(x => x.selected) },
        totalPrice() {
             return this.selectedSeats.length
                ? this.selectedSeats.map(x => x.price).reduce((a,b)=>a+b)
                : 0
        }
    },
    template: /*html*/`
        <div class="glass-container">
            <Tooltip ref="tt" :visible="hoveringSeat != null">
                <div v-if="hoveringSeat.available">Price: $\{{ hoveringSeat.price }}</div>
                <div v-else>This seat is unavailable.</div>
            </Tooltip>
            <h2 style=" margin-bottom: 1rem; font-size: 2rem; text-align: center">Please select your seats.</h2>
            <div class="seats" :style="{ gridTemplateColumns: \`repeat($\{cols}, 1fr)\` }">
                <div v-if="loading">Loading...</div>
                <div v-if="error">{{ error }}</div>
                <Seat
                    v-if="seats"
                    v-for="seat in seats" v-bind="seat"
                    @clicked="seatClicked(seat)"
                    @pointerenter="(e) => hoverSeat(seat, e)"
                    @pointerleave="unhover"
                />
            </div>
            <div class="seat-info" style="margin-bottom: 1rem">
                <div>
                    Selected seats: {{ seats.filter(x => x.selected).length }}
                </div>
                <div>
                    Total price: $\{{totalPrice}}
                </div>
            </div>
            <div class="uniform-grid-columns">
                <button @click="bookingStore.back()">Back</button>
                <button @click="bookingStore.next()">Continue</button>
            </div>
        </div>
    `
}