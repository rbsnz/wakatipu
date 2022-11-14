import { useBookingStore } from '../stores/booking.js'

export default {
    data: () => ({
        store: useBookingStore(),
        cols: 0,
        rows: 0,
        seats: {},
        loading: true,
        error: null,
        hoveringSeat: null
    }),
    async created() {
        await this.store.loadBoats()
        const boat = Object.values(this.store.boats)
            .filter(boat => boat.id.toLowerCase() == this.store.selectedBoat.toLowerCase())[0]

        this.rows = boat.rows
        this.cols = boat.cols
        this.seats = boat.seats

        for (let seat of Object.values(this.seats)) {
            const index = this.store.selectedSeats.indexOf(seat.id)
            seat.selected = seat.available && index >= 0
            if (!seat.available && index >= 0) {
                this.store.selectedSeats.splice(index, 1)
            }
        }

        this.loading = false
    },
    methods: {
        seatClicked(seat) {
            if (!seat.available) return;
            seat.selected = !seat.selected;
            
            const index = this.store.selectedSeats.indexOf(seat.id)
            if (seat.selected) {
                if (index == -1)
                    this.store.selectedSeats.push(seat.id)
            } else {
                if (index != -1)
                    this.store.selectedSeats.splice(index, 1)
            }
        },
        hoverSeat(seat, e) {
            this.hoveringSeat = seat
            if (this.$refs.tt)
                this.$refs.tt.onMouseMove(e)
        },
        unhover() {
            this.hoveringSeat = null
        }
    },
    computed: {
        canContinue() { return Object.values(this.seats).some(x => x.selected) },
        selectedSeats() { return Object.values(this.seats).filter(x => x.selected) },
        totalPrice() {
            const seats = this.selectedSeats
            return seats.length ? seats.map(x => x.price).reduce((a,b) => a+b) : 0
        }
    },
    template: /*html*/`
        <div class="glass-container">
            <Tooltip ref="tt" :visible="hoveringSeat != null">
                <div v-if="hoveringSeat.available">Price: $\{{ hoveringSeat.price }}</div>
                <div v-else>This seat is unavailable.</div>
            </Tooltip>
            <div style=" margin-bottom: 1rem; font-size: 2rem; text-align: center">Please select your seats.</div>
            <div class="seats" :style="{ gridTemplateColumns: \`repeat($\{cols}, 1fr)\` }">
                <div v-if="loading">Loading...</div>
                <div v-if="error">{{ error }}</div>
                <div v-for="seat in seats">x</div>
                <Seat
                    v-for="seat in Object.values(seats)"
                    v-bind="seat"
                    @clicked="seatClicked(seat)"
                    @pointerenter="(e) => hoverSeat(seat, e)"
                    @pointerleave="unhover"
                />
            </div>
            <div class="seat-info" style="margin-bottom: 1rem">
                <div>
                    Selected seats: {{ Object.values(seats).filter(x => x.selected).length }}
                </div>
                <div>
                    Total price: $\{{totalPrice}}
                </div>
            </div>
            <div class="uniform-grid-columns">
                <button @click="store.back()">Back</button>
                <button @click="store.next()" :disabled="!canContinue">Continue</button>
            </div>
        </div>
    `
}