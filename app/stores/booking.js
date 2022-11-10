const { useStorage } = VueUse

export const useBookingStore = Pinia.defineStore('booking', {
    state: () => ({
        step: useStorage('bookingStep', 0),
        selectedDate: useStorage('bookingDate', null),
        selectedTime: useStorage('bookingTime', 0),
        selectedBoat: useStorage('bookingBoat', 0),
        selectedSeats: useStorage('bookingSeats', [])
    }),
    actions: {
        nextStep() {
            this.step++
        },
        previousStep() {
            this.step--
        }
    }
})

