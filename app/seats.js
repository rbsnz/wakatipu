
export default {
    data: () => ({
        cols: 0,
        rows: 0,
        seats: [],
        loading: true,
        error: null,
        hover: false,
        hoverX: 0,
        hoverY: 0,
        hoverSeat: ''
    }),
    async created() {
        const res = await fetch('data/boats.xml')
        const xml = await res.text()
        const doc = new DOMParser().parseFromString(xml, 'text/xml')
        const boat = doc.querySelector('boat[id=tere]')

        const seats = boat.querySelector('seats')
        this.loading = false

        this.rows = +seats.getAttribute('rows')
        this.cols = +seats.getAttribute('cols')

        const rows = [...boat.querySelectorAll('seats > row')]
        let rowNumber = 1
        for (let row of rows) {
            const rowId = row.getAttribute('id')
            for (let i = 0; i < row.children.length; i++) {
                this.seats.push({
                    id: `${rowId}${i+1}`,
                    pos: {
                        col: +row.children[i].getAttribute('col'),
                        row: rowNumber
                    },
                    available: (row.children[i].getAttribute('available') || '1') === '1'
                })
            }
            rowNumber++
        }
    },
    methods: {
        seatClicked(seat) {
            if (!seat.available) return;
            seat.selected = !seat.selected;
        },
        onMouseEnter(seat) {
          this.hover = true
          this.hoverSeat = seat.id
        },
        onMouseMove(e) {
          this.hoverX = `${(e.x + 10)}px`
          this.hoverY = `${(e.y + 10)}px`
        },
        onMouseLeave() {
          this.hover = false
        }
    },
    template: /*html*/`
        <div>
            <div class="seats blur-bg" :style="{ gridTemplateColumns: \`repeat($\{cols}, 1fr)\` }">
                <div v-if="loading">Loading...</div>
                <div v-if="error">{{ error }}</div>
                <Seat
                    v-if="seats"
                    v-for="seat in seats" v-bind="seat"
                    @clicked="seatClicked(seat)"
                    @mouseenter="onMouseEnter(seat)"
                    @mouseleave="onMouseLeave()"
                    @mousemove="(e) => onMouseMove(e)"
                />
            </div>
        </div>
        <div
          class="seat-popup"
          v-if="hover"
          :style="{ top: hoverY, left: hoverX }"
        >
          {{ hoverSeat }}
        </div>
    `
}