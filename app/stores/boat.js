export const useBoatStore = Pinia.defineStore('boat', {
    state: () => ({
        boats: []
    }),
    actions: {
        calculatePrice(rowNum) {
            if (rowNum <= 2) return 30
            else if (rowNum <= 5) return 25
            else return 20
        },
        async loadBoats() {
            if (!this.boats || !this.boats.length) {
                // Load the xml and convert it into a javascript object ...
                const res = await fetch('/data/boats.xml')
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
                            seats.push({
                                id: `${xmlRow.getAttribute('id')}${seatNum}`,
                                row: rowNum,
                                col: parseInt(xmlSeat.getAttribute('col')),
                                price: this.calculatePrice(rowNum),
                                available: xmlSeat.getAttribute('booked') != '1'
                            })
                            seatNum++
                        }
                        rowNum++
                    }

                    this.boats.push({
                        id: xmlBoat.getAttribute('id'),
                        name: xmlBoat.getAttribute('name'),
                        image: xmlBoat.querySelector('image').textContent,
                        rows: parseInt(xmlSeats.getAttribute('rows')),
                        cols: parseInt(xmlSeats.getAttribute('cols')),
                        seats
                    })
                }
            }
            return this.boats
        }
    }
})