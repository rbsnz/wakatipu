const StartRadius = 6
const EndRadius = 20
const GrowthTime = 5000
const GrowthTime2 = 3000

export class Bug {

    stage = 1
    stageStart
    color1 = { r: 255, g: 255, b: 0 }
    color2 = { r: 255, g: 255, b: 0 }
    x
    y
    radius = StartRadius
    radius2 = 0
    trans = 0

    constructor(x, y) {
        this.x = x
        this.y = y
    }

    update({ current, delta }) {
        switch (this.stage) {
            // Stage 1 - a small yellow bug with a radius of 6px appears
            case 1: {
                this.stageStart = current
                this.stage++
            } break
            // Stage 2 - bug grows to a size of 20px over 5 seconds
            case 2: {
                const t = Math.min(1, (current - this.stageStart) / GrowthTime)
                this.radius = StartRadius + (EndRadius - StartRadius) * t
                if (this.radius >= 20) {
                    this.stageStart = current
                    this.stage++
                }
            } break
            // Stage 3 - bug changes from yellow to red over 3 seconds
            case 3: {
                const t = Math.min(1, (current - this.stageStart) / GrowthTime2)
                this.trans = t * t
                this.radius2 = EndRadius * 10 * t
                if (t >= 1) {
                    this.stageStart = current
                    this.stage++
                }
            } break
            case 4: {
                this.y -= delta / 1000 * 100
            } break
        }
    }

    draw(/** @type{CanvasRenderingContext2D} */ctx) {

        ctx.fillStyle = this.stage > 3 ? 'red' : 'yellow'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()

        if (this.stage == 3) {
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 20)
            grad.addColorStop(0, '#ff0000')
            grad.addColorStop(this.trans, '#ff000000')
            ctx.fillStyle = grad
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
            ctx.fill()
        }

    }
}