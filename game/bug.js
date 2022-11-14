import { Rectangle } from './rectangle.js'

const StartRadius = 6
const EndRadius = 20
const GrowthTime = 5
const GrowthTime2 = 3

export class Bug {

    state = 'growth'
    growth = 1

    stateStartTime
    color1 = { r: 255, g: 255, b: 0 }
    color2 = { r: 255, g: 255, b: 0 }
    x
    y
    radius = StartRadius
    maxSpeed = 50 + (100 * Math.random())
    swayAmount = 10 + (50 * Math.random())
    swayFrequency = 2 + (4 * Math.random())

    transition = 0
    lifetime = 0
    speed = 0
    dead = false
    caught = false
    bitten = false
    
    speedUp = 1
    bitePosition = null

    get bounds() {
        return new Rectangle(
            this.x - this.radius,
            this.y - this.radius,
            this.radius * 2,
            this.radius * 2
        )
    }

    constructor(x, y) {
        this.x = x
        this.y = y
    }

    update({ current, delta }) {
        this.lifetime += delta
        if (this.caught) {
            this.radius += -this.radius * 0.01 * delta
        }
        switch (this.state) {
            case 'growth': {
                switch (this.growth) {
                    // Stage 1 - a small yellow bug with a radius of 6px appears
                    case 1: {
                        this.stateStartTime = current
                        this.growth++
                    } break
                    // Stage 2 - bug grows to a size of 20px over 5 seconds
                    case 2: {
                        const t = Math.min(1, (current - this.stateStartTime) / GrowthTime)
                        this.radius = StartRadius + (EndRadius - StartRadius) * t
                        if (this.radius >= 20) {
                            this.stateStartTime = current
                            this.growth++
                        }
                    } break
                    // Stage 3 - bug changes from yellow to red over 3 seconds
                    case 3: {
                        const t = Math.min(1, (current - this.stateStartTime) / GrowthTime2)
                        this.transition = t * t
                        if (t >= 1) {
                            this.stateStartTime = current
                            this.growth++
                        }
                    } break
                    // Stage 4 - bug will stay on the bottom for a duration of 4 seconds
                    case 4: {
                        if ((current - this.stateStartTime) >= 4) {
                            this.growth++
                            this.state = 'flying'
                        }
                    } 
                }
            } break
            case 'flying': {
                this.speed += (this.maxSpeed - this.speed) * delta * this.speedUp
                this.y -= delta * this.speed
                this.x += Math.sin(current / this.swayFrequency * Math.PI * 2) * delta * this.swayAmount
            } break
            case 'biting': {
                this.x += (this.bitePosition.x - this.x) * delta * 10
                this.y += (this.bitePosition.y - this.y) * delta * 10
                if (Math.abs(this.bitePosition.x - this.x) <= 1 &&
                    Math.abs(this.bitePosition.y - this.y) <= 1) {
                    this.state = 'flying'
                }
            } break
            case 'caught': {
                this.radius += -this.radius * delta * 4
                if (this.radius <= 1)
                    this.dead = true
            }
        }
    }

    bite(position) {
        this.bitten = true
        this.bitePosition = position
        this.maxSpeed *= 4
        this.speedUp *= 4
        this.state = 'biting'
    }

    draw(/** @type{CanvasRenderingContext2D} */ctx) {

        ctx.fillStyle = this.stage > 3 ? '#ff0000' : '#ffff00'

        let gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius)
        gradient.addColorStop(0, ctx.fillStyle + Math.round(255 - this.transition * 255).toString(16).padStart(2, '0'))
        gradient.addColorStop(1, ctx.fillStyle + '00')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()

        if (this.growth >= 3) {
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius)
            grad.addColorStop(0, '#ff0000')
            grad.addColorStop(this.transition, '#ff000000')
            ctx.fillStyle = grad
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
            ctx.fill()
        }
    }
}