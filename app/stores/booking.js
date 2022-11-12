const { useStorage } = VueUse

export const useBookingStore = Pinia.defineStore('booking', {
    state: () => ({
        transitioning: false,
        step: 3,
        selectedMonth: useStorage('bookingMonth', null),
        selectedDay: useStorage('bookingDay', null),
        selectedTime: useStorage('bookingTime', 0),
        selectedBoat: useStorage('bookingBoat', null),
        selectedSeats: useStorage('bookingSeats', []),
        selectedMenuItems: useStorage('bookingMenuItems', {})
    }),
    actions: {
        back() {
            if (!this.transitioning && this.step > 0)
                this.step--
        },
        next() {
            if (!this.transitioning && this.step < 4)
                this.step++
        }
    }
})

