const { useStorage } = VueUse

const MenuItemTypes = {
    'V': {
        id: 'V',
        name: 'Vegetarian'
    },
    'GF': {
        id: 'GF',
        name: 'Gluten Free'
    },
    'EF': {
        id: 'EF',
        name: 'Egg Free'
    }
}

const toItemTypes = (s) => {
    if (!s) return []
    return s.split(',').map(x => MenuItemTypes[x] || undefined)
}

export const useBookingStore = Pinia.defineStore('booking', {
    state: () => ({
        transitioning: false,
        step: 0,
        boats: {},
        menuItems: {},
        maxMenuItems: 10,
        selectedDate: useStorage('wakatipuSelectedDate', null),
        selectedTime: useStorage('wakatipuSelectedTime', -1),
        selectedBoat: useStorage('wakatipuSelectedBoat', null),
        selectedSeats: useStorage('wakatipuSelectedSeats', []),
        selectedMenuItems: useStorage('wakatipuSelectedMenuItems', {}),
        bookedSeats: useStorage('wakatipuBookedSeats', {})
    }),
    actions: {
        back() {
            if (!this.transitioning && this.step > 0)
                this.step--
        },
        next() {
            if (!this.transitioning && this.step < 5)
                this.step++
        },
        confirm() {
            if (!this.selectedBoat || !this.selectedSeats) return
            const boat = this.selectedBoat.toLowerCase()
            const date = this.selectedDate
            const hour = this.selectedTime.toString().padStart(2, '0')
            const key = `${boat}-${date}-${hour}:00`
            if (!(key in this.bookedSeats))
                this.bookedSeats[key] = []
            this.bookedSeats[key].push(...this.selectedSeats)
            this.reset()
        },
        restart() {
            this.reset()
            this.step = 0
        },
        reset() {
            this.selectedDate = null
            this.selectedTime = -1
            this.selectedBoat = null
            this.selectedSeats = []
            this.selectedMenuItems = {}
        },
        calculatePriceFromSeatId(seatId) {
            const row = Number(seatId.charCodeAt(0) - 65)
            return this.calculatePriceFromRow(row)
        },
        calculatePriceFromRow(rowNum) {
            if (rowNum <= 2) return 30
            else if (rowNum <= 5) return 25
            else return 20
        },
        /* Boats */
        async loadBoats() {
            if (!this.boats || !this.boats.length) {
                const res = await fetch('data/boats.xml')
                const xml = await res.text()

                const xmlDoc = new DOMParser().parseFromString(xml, 'text/xml')
                const xmlBoats = xmlDoc.querySelectorAll('boats > boat')

                for (const xmlBoat of xmlBoats) {
                    const xmlSeats = xmlBoat.querySelector('seats')
                    const xmlRows = xmlSeats.querySelectorAll('row')
                    const seats = []
                    let rowNum = 1
                    for (const xmlRow of xmlRows) {
                        let seatNum = 1
                        for (const xmlSeat of xmlRow.querySelectorAll('seat')) {
                            const id = `${xmlRow.getAttribute('id')}${seatNum}`
                            seats[id] = {
                                id,
                                row: rowNum,
                                col: parseInt(xmlSeat.getAttribute('col')),
                                price: this.calculatePriceFromRow(rowNum),
                                available: true
                            }
                            seatNum++
                        }
                        rowNum++
                    }

                    const id = xmlBoat.getAttribute('id')
                    this.boats[id] = {
                        id,
                        name: xmlBoat.getAttribute('name'),
                        image: xmlBoat.querySelector('image').textContent,
                        rows: parseInt(xmlSeats.getAttribute('rows')),
                        cols: parseInt(xmlSeats.getAttribute('cols')),
                        seats
                    }
                }
            }

            // Update seat availability

            if (this.selectedDate && this.selectedTime) {
                for (const boat of Object.values(this.boats)) {
                    for (const seatId in boat.seats)
                        boat.seats[seatId].available = true

                    const key = `${boat.id}-${this.selectedDate}-${this.selectedTime}:00`

                    if (!(key in this.bookedSeats)) {
                        // Set random seats as unavailable to simulate seats booked by other customers
                        this.bookedSeats[key] = []
                        for (const seatId in boat.seats) {
                            if (Math.random() < 0.05) {
                                this.bookedSeats[key].push(seatId)
                            }
                        }
                    }

                    for (let seatId of this.bookedSeats[key])
                        boat.seats[seatId].available = false
                }
            }
        },
        selectBoat(boat) {
            for (const boat of Object.values(this.boats))
                boat.selected = false
            
            boat.selected = true
            this.selectedBoat = boat.id
            this.selectedSeats = []
        },
        /* Menu */
        async loadMenu() {
            if (this.items && this.items.length) return

            const res = await fetch('data/menu.xml')
            const xml = await res.text()

            const xmlDoc = new DOMParser().parseFromString(xml, 'text/xml')
            const xmlMenu = xmlDoc.querySelector('menu')
            const xmlMenuItems = xmlMenu.querySelectorAll('item')

            for (let xmlItem of xmlMenuItems) {
                const id = xmlItem.getAttribute('id')
                this.menuItems[id] = {
                    id,
                    name: xmlItem.querySelector('name').textContent,
                    description: xmlItem.querySelector('description').textContent,
                    image: xmlItem.querySelector('image').textContent,
                    price: parseFloat(xmlItem.querySelector('price').textContent),
                    types: toItemTypes(xmlItem.querySelector('type')?.textContent),
                    count: this.selectedMenuItems[id] || 0
                }
            }
        },
        getMenuItemById(id) {
            for (const item of this.maxMenuItems) {
                if (item.id == id) {
                    return item
                }
            }
            return null
        },
        addMenuItem(item) {
            if (item.count >= this.maxMenuItems) return
            item.count++
            this.selectedMenuItems[item.id] = item.count
        },
        removeMenuItem(item) {
            if (item.count == 0) return
            item.count--
            this.selectedMenuItems[item.id] = item.count
        }
    }
})

