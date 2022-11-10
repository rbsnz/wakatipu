export default {
    data: () => ({}),
    props: {
        id: String,
        available: Boolean,
        selected: Boolean,
        pos: {
            col: Number,
            row: Number
        }
    },
    template: /*html*/`
        <button
            class="seat"
            :class="{ available, selected }"
            :style="{ gridColumn: pos.col, gridRow: pos.row }"
            @click="$emit('clicked')"
            :disabled="!available"
        >
            {{ id }}
        </button>
    `
}