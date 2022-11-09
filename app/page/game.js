export default {
    data: () => ({
        timer: 0,
        startTime: 0,
        lastUpdateTime: 0,
        pos: { x: 0, y: 0 },
        keys: {}
    }),
    mounted() {
        this.startTime = Date.now()
        this.lastUpdateTime = Date.now()
        this.timer = setInterval(this.update, 1000 / 60)
        this.$refs.canvas.focus()
    },
    beforeUnmount() {
        clearInterval(this.timer)
    },
    methods: {
        update() {
            const time = Date.now()
            const totalTime = time - this.startTime
            const delta = time - this.lastUpdateTime
            this.lastUpdateTime = time

            const speed = delta / 1000 * 250
            if (this.keys['ArrowUp'])
                this.pos.y -= speed
            if (this.keys['ArrowDown'])
                this.pos.y += speed
            if (this.keys['ArrowLeft'])
                this.pos.x -= speed
            if (this.keys['ArrowRight'])
                this.pos.x += speed

            this.draw()
        },
        draw() {
            /** @type{HTMLCanvasElement} */
            const canvas = this.$refs.canvas
            const ctx = canvas.getContext('2d')
            const width = canvas.clientWidth
            const height = canvas.clientHeight

            ctx.clearRect(0, 0, width, height)
        
            ctx.fillStyle = document.activeElement == canvas ? 'white' : 'gray'
            ctx.fillRect(0, 0, width, height)

            ctx.fillStyle = 'red'
            ctx.beginPath()
            ctx.arc(this.pos.x, this.pos.y, 20, 0, Math.PI * 2)
            ctx.fill()
        },
        onKeyDown(/** @type{KeyboardEvent} */e) {
            if (e.repeat) return
            this.keys[e.key] = true
        },
        onKeyUp(/** @type{KeyboardEvent} */e) {
            this.keys[e.key] = false
        }
    },
    template: /*html*/`
        <div>
            <canvas
                ref="canvas"
                tabindex="0"
                class="game-canvas"
                width="800"
                height="600"
                @keydown="onKeyDown"
                @keyup="onKeyUp"
            />
        </div>
    `
}