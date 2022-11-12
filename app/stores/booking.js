const { useStorage } = VueUse

export const useBookingStore = Pinia.defineStore('booking', {
    state: () => ({
        step: 3,
        selectedMonth: useStorage('bookingMonth', null),
        selectedDay: useStorage('bookingDay', null),
        selectedTime: useStorage('bookingTime', 0),
        selectedBoat: useStorage('bookingBoat', null),
        selectedSeats: useStorage('bookingSeats', []),
        selectedMenuItems: useStorage('bookingMenuItems', {})
    }),
    actions: {
        back() { this.step-- },
        next() { this.step++ }
    }
})

