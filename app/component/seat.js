export default {
    props: {
        id: String,
        available: Boolean,
        selected: Boolean,
        col: Number,
        row: Number
    },
    template: /*html*/`
        <button
            class="seat"
            :class="{ available, selected }"
            :style="{ gridColumn: col, gridRow: row, aspectRatio: 1 }"
            @click="$emit('clicked')"
            :disabled="!available"
        >
            {{ id }}
        </button>
    `
}