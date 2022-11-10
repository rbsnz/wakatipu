export default {
    props: {
        visible: Boolean
    },
    data: () => ({
        x: 0,
        y: 0
    }),
    mounted() {
        window.addEventListener('pointermove', this.onMouseMove)
    },
    unmounted() {
        window.removeEventListener('pointermove', this.onMouseMove)
    },
    methods: {
        show() {
            this.visible = true
        },
        hide() {
            this.visible = false
        },
        onMouseMove(/** @type{MouseEvent} */e) {
            this.x = e.clientX + 16
            this.y = e.clientY + 16
        }
    },
    computed: {
        positionX() { return `${this.x}px` },
        positionY() { return `${this.y}px` }
    },
    template: /*html*/`
        <teleport to="body">
            <div class="tooltip-container" ref="container">
                <div
                    v-if="visible"
                    class="tooltip"
                    :style="{ top: positionY, left: positionX }"
                >
                    <slot />
                </div>
            </div>
        </teleport>
    `
}