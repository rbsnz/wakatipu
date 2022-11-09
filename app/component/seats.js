
export default {
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
        const xml = await this.load()
        if (!xml) return
        const doc = new DOMParser().parseFromString(xml, 'text/xml')
        const seats = doc.querySelector('seats')

        this.rows = +seats.getAttribute('rows')
        this.cols = +seats.getAttribute('cols')

        const defaultPrice = 20

        const rows = [...seats.querySelectorAll('row')]
        let rowNumber = 1
        for (let row of rows) {
            const rowId = row.getAttribute('id')
            const rowPrice = row.getAttribute('price')
            const price = rowPrice ? parseFloat(rowPrice) : defaultPrice
            for (let i = 0; i < row.children.length; i++) {
                this.seats.push({
                    id: `${rowId}${i+1}`,
                    pos: {
                        col: +row.children[i].getAttribute('col'),
                        row: rowNumber
                    },
                    available: (row.children[i].getAttribute('available') || '1') === '1',
                    price
                })
            }
            rowNumber++
        }
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
                    @mouseenter="mouseEnter(seat)"
                    @mousemove="(e) => mouseMove(e)"
                    @mouseleave="mouseLeave()"
                />
            </div>
            <div class="seat-info">
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
        </div>
    `
}