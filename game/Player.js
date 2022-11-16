import { Rectangle } from './Rectangle.js'

import { SoundManager } from './Sounds.js'

export class Player {

    walkingSpeed = 130

    scale = 0.3
    x
    y
    frame = 0
    frameTime = 0
    left = false
    swingTime = 0
    hitTime = 0

    bounds = new Rectangle(0, 0, 416, 454)
    hitbox = new Rectangle(147, 91, 177, 360)
    net = { x: 0, y: 0, radius: 30, offset: { x: 79, y: -61 } }

    currentAnimation
    animations = {
        idle: {
            name: 'Idle',
            origin: { x: 244, y: 327 },
            frameCount: 16,
            frames: []
        },
        walk: {
            name: 'Walk',
            origin: { x: 244, y: 330 },
            frameCount: 20,
            frames: []
        },
        swing: {
            name: 'Jump',
            origin: { x: 244, y: 330 },
            frameStart: 20,
            frameCount: 10,
            frames: []
        },
        hit: {
            name: 'Dead',
            origin: { x: 182, y: 324 },
            offset: {
                x: 15, y: 0
            },
            frameStart: 1,
            frameCount: 1,
            frames: []
        }
    }

    imgNet

    state = 'idle'

    constructor(x, y) {
        this.x = x
        this.y = y

        for (const anim of Object.values(this.animations)) {
            const start = anim.frameStart || 1
            for (let i = 0; i < anim.frameCount; i++) {
                const img = new Image()
                img.src = `media/game/character/${anim.name} (${start+i}).png`
                anim.frames.push({ img })
            }
        }

        this.currentAnimation = this.animations.idle

        this.hitbox.w *= this.scale
        this.hitbox.h *= this.scale

        const net1 = new Image()
        net1.src = 'media/game/net1.png'
        const net2 = new Image()
        net2.src = 'media/game/net2.png'

        this.imgNet = [net1, net2]
    }

    setAnimation(animation) {
        this.currentAnimation = animation
        this.frame = 0
    }

    keyPressed({code, repeat}) {
        if (this.state == 'hit') return
        if (code == 'Space') {
            if (this.state != 'swing') {
                SoundManager.playSwish()
                this.state = 'swing'
                this.swingTime = 0
            }
        }
    }

    update({current, delta}, keys) {

        this.frameTime += delta
        if (this.frameTime >= 0.05) {
            this.frameTime = 0
            this.frame = (this.frame + 1) % this.currentAnimation.frames.length
        }
        
        if (this.state == 'swing') {
            this.swingTime += delta
            if (this.swingTime >= 0.3) {
                this.state = 'idle'
                this.swing = false
            }
        } else if (this.state == 'hit') {
            this.hitTime += delta
            if (this.hitTime >= 0.5) {
                this.state = 'idle'
            }
        } else {
            let direction = { x: 0, y: 0 }
            if (keys['ArrowLeft'] || keys['KeyA']) direction.x--
            if (keys['ArrowRight'] || keys['KeyD']) direction.x++
            if (keys['ArrowUp'] || keys['KeyW']) direction.y--
            if (keys['ArrowDown'] || keys['KeyS']) direction.y++
            const speed = delta * this.walkingSpeed
            const xSpeed = speed * direction.x
            const ySpeed = speed * direction.y
            if (xSpeed < 0) this.left = true
            else if (xSpeed > 0) this.left = false
            if (xSpeed != 0 || ySpeed != 0) {
                this.x += xSpeed
                this.y += ySpeed
                this.state = 'walk'
            } else {
                this.state = 'idle'
            }
        }

        switch (this.state) {
            case 'walk':
                if (this.currentAnimation != this.animations.walk)
                    this.setAnimation(this.animations.walk)
                break
            case 'idle':
                if (this.currentAnimation != this.animations.idle)
                    this.setAnimation(this.animations.idle)
                break
            case 'swing':
                if (this.currentAnimation != this.animations.swing)
                    this.setAnimation(this.animations.swing)
                break
            case 'hit':
                if (this.currentAnimation != this.animations.hit)
                    this.setAnimation(this.animations.hit)
                break
        }

        this.hitbox.x = this.x - this.hitbox.w / 2
        this.hitbox.y = this.y - this.hitbox.h / 2 - 15

        this.net.x = this.x + this.net.offset.x * (this.left ? -1 : 1)
        this.net.y = this.y + this.net.offset.y
    }

    hit() {
        if (this.state != 'hit') {
            SoundManager.playHurt()
            this.state = 'hit'
            this.hitTime = 0
        }
    }

    draw(/** @type{CanvasRenderingContext2D} */ctx, debug = false) {
        const anim = this.currentAnimation
        const img = anim.frames[this.frame].img

        ctx.translate(this.x, this.y)
        ctx.scale(this.scale, this.scale)
        if (this.left)
            ctx.scale(-1, 1)
        if (anim.origin) {
            ctx.translate(
                -anim.origin.x,
                -anim.origin.y
            )
        }

        if (this.state == 'swing') {
            ctx.drawImage(this.imgNet[1], 220, 0, this.imgNet[1].width, this.imgNet[1].height)
        } else {        
            let zx = -40, zy = 70
            if (anim == this.animations.hit) {
                zx = -100
            }
            ctx.drawImage(this.imgNet[0], zx, zy, this.imgNet[0].width, this.imgNet[0].height)
        }

        ctx.drawImage(anim.frames[this.frame].img,
            0, 0,
            img.width, img.height
        )
        ctx.resetTransform()

        if (debug) {
            ctx.lineWidth = 2
            ctx.strokeStyle = 'beige'
            ctx.strokeRect(
                this.x - this.currentAnimation.origin.x * this.scale,
                this.y - this.currentAnimation.origin.y * this.scale,
                img.width * this.scale, img.height * this.scale
            )

            if (this.state == 'swing') {
                ctx.strokeStyle = 'cyan'
                ctx.beginPath()
                ctx.arc(this.net.x, this.net.y, this.net.radius, 0, Math.PI * 2)
                ctx.stroke()
            }

            ctx.strokeStyle = 'yellow'
            this.hitbox.stroke(ctx)
        }
    }
}