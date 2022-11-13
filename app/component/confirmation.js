import { useBookingStore } from '../stores/booking.js'

import { to12hour, getMonthName } from '../util/time.js'

export default {
    data: () => ({
        store: useBookingStore(),
        loading: true
    }),
    async mounted() {
        await Promise.all([this.store.loadBoats(), this.store.loadMenu()])
        this.loading = false
    },
    methods: { to12hour, getMonthName },
    computed: {
        selectedDate() {
            const split = this.store.selectedDate.split('-')
            const day = parseInt(split[2])
            const month = parseInt(split[1]) - 1
            return `${day} ${getMonthName(month)}`
        },
        selectedTime() {
            return to12hour(this.store.selectedTime)
        },
        selectedItems() {
            return Object.values(this.store.menuItems).filter(item => item.count > 0)
        },
        selectedSeatsTotal() {
            return this.store.selectedSeats
                .map(seatId => this.store.calculatePriceFromSeatId(seatId))
                .reduce((a,b) => a+b)
        },
        menuTotal() {
            if (!this.selectedItems.length) return 0
            return this.selectedItems
                .map(item => item.count * item.price)
                .reduce((a,b) => a+b)
        },
        totalCost() {
            return this.selectedSeatsTotal + this.menuTotal
        }
    },
    template: /*html*/`
        <div class="glass-container">
            <div>Please confirm your booking details.</div>
            <div v-if="!loading" class="confirmation" style="display: grid; gap: 1rem; grid-template-columns: auto 1fr; grid-auto-flow: row;">
                <!-- Date -->
                <div>Date</div>
                <div>{{ selectedDate }}</div>
                <!-- Time -->
                <div>Time</div>
                <div>{{ selectedTime }}</div>
                <!-- Boat -->
                <div>Boat</div>
                <div>{{ store.boats[store.selectedBoat].name }}</div>
                <!-- Seats -->
                <div>Seats</div>
                <div>
                    <div v-for="seat in store.selectedSeats">
                        {{ seat }} ($\{{ store.calculatePriceFromSeatId(seat) }})
                    </div>
                </div>
                <div>Seats total</div>
                <div>$\{{ selectedSeatsTotal.toFixed(2) }}</div>
                <!-- Menu items -->
                <div>Menu items</div>
                <div>
                    <div v-if="selectedItems.length" v-for="item in selectedItems">
                        {{ item.name }} ($\{{ item.price.toFixed(2) }}) x {{ item.count }}
                    </div>
                    <div v-else>
                        None
                    </div>
                </div>
                <div>Menu total</div>
                <div>$\{{ menuTotal.toFixed(2) }}</div>
                <!-- Total -->
                <div>Total cost</div>
                <div>$\{{ totalCost.toFixed(2) }}</div>
            </div>
            <div class="uniform-grid-columns">
                <button @click="store.back()">Back</button>
                <button class="confirm" @click="store.next()">Confirm</button>
            </div>
        </div>
    `
}