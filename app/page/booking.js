export default {
    data: () => ({
        step: 0
    }),
    template: /*html*/`
        <div class="glass-container">
            <DateSelector v-if="step == 0" />
            <Seats v-if="step == 1" />
        </div>
    `
}