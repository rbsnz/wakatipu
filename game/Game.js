import { Bug } from './Bug.js'
import { Player } from './Player.js'
import { Rectangle } from './Rectangle.js'
import { SoundManager } from './Sounds.js'

const { useStorage } = VueUse

export default {
    data: () => ({
        timer: 0,
        currentTime: 0,
        lastUpdateTime: 0,
        keys: {},
        bugs: [],
        nextBugTime: 0,
        width: 800,
        height: 800,
        player: null,
        paused: false,
        score: 0,
        volume: useStorage('wakatipuGameVolume', 80),
        bounds: new Rectangle(50, 350, 700, 300),
        playing: false,
        state: 'menu',
        debug: false,
        timeLeft: 0,
        durations: [1, 2, 4, 5],
        selectedDuration: useStorage('wakatipuGameDuration', 4),
        backgroundMusic: null,
        musicVolume: useStorage('wakatipuGameVolumeMusic', 40)
    }),
    watch: {
        volume(value) {
            SoundManager.volume = value / 100
        },
        musicVolume(value) {
            this.backgroundMusic.volume = value / 100
        }
    },
    mounted() {
        this.player = new Player(
            this.bounds.x + this.bounds.w / 2,
            this.bounds.y + this.bounds.h / 2
        )
        this.timer = setInterval(this.tick, 1000 / 60)

        const audio = new Audio('media/game/TownTheme.mp3')
        audio.volume = this.musicVolume / 100
        audio.loop = true
        audio.autoplay = true

        this.backgroundMusic = audio
        this.playBackgroundMusic()
    },
    beforeUnmount() {
        clearInterval(this.timer)
        this.backgroundMusic.pause()
    },
    methods: {
        async playBackgroundMusic() {
            try {
                await this.backgroundMusic.play()
            } catch {
                setTimeout(this.playBackgroundMusic, 250)
            }
        },
        reset() {
            this.state = 'menu'
            this.playing = false
            this.paused = true
        },
        start() {
            this.startTime = this.lastUpdateTime = Date.now()
            this.currentTime = 0
            this.keys = {}

            this.bugs = []

            this.state = 'playing'
            this.playing = true
            this.paused = false
            this.score = 0

            this.timeLeft = 60 * this.selectedDuration

            this.$refs.canvas.focus()
        },
        pause() {
            this.paused = true
        },
        unpause() {
            this.lastUpdateTime = Date.now()
            this.paused = false
            this.$refs.canvas.focus()
        },
        tick() {
            this.update()
            this.draw()
        },
        update() {
            if (this.paused || !this.playing) return

            const now = Date.now()
            const delta = (now - this.lastUpdateTime) / 1000
            this.currentTime += delta
            this.lastUpdateTime = now

            this.timeLeft -= delta
            if (this.timeLeft <= 0){
                this.timeLeft = 0
                this.state = 'gameover'
                this.playing = false
                return
            }

            const time = { current: this.currentTime, delta }
            
            this.player.update(time, this.keys)
            if (this.player.x < this.bounds.left) this.player.x = this.bounds.left
            if (this.player.x > this.bounds.right) this.player.x = this.bounds.right
            if (this.player.y < this.bounds.top) this.player.y = this.bounds.top
            if (this.player.y > this.bounds.bottom) this.player.y = this.bounds.bottom

            this.nextBugTime -= delta
            if (this.nextBugTime <= 0) {
                this.nextBugTime = Math.random() * 2
                this.bugs.push(new Bug(Math.random() * this.width, this.height - 40 + Math.random() * 20))
            }
            
            for (let i = 0; i < this.bugs.length; i++) {
                const bug = this.bugs[i]
                bug.update(time)

                if (bug.y < -50)
                    bug.dead = true

                if (bug.dead) {
                    this.bugs.splice(i, 1)
                    continue
                }

                if (bug.bounds.intersectsWith(this.player.hitbox) && !bug.bitten && !bug.caught && this.player.state != 'hit') {
                    this.player.hit()
                    bug.bite({ x: this.player.x, y: this.player.y })
                    if (this.score > 0)
                        this.score--
                }


                if (this.player.state == 'swing' && !bug.caught) {
                    const dist = Math.sqrt(Math.pow(this.player.net.x - bug.x, 2) + Math.pow(this.player.net.y - bug.y, 2))
                    if (dist <= this.player.net.radius) {
                        bug.caught = true
                        bug.state = 'caught'
                        this.score++
                        SoundManager.playCollect()
                    }
                }
            }
        },
        draw() {
            /** @type{HTMLCanvasElement} */
            const canvas = this.$refs.canvas
            const ctx = canvas.getContext('2d')
            const width = canvas.clientWidth
            const height = canvas.clientHeight

            ctx.clearRect(0, 0, width, height)

            this.player.draw(ctx, this.debug)

            for (let bug of this.bugs)
                bug.draw(ctx)
            
            if (this.debug) {
                ctx.strokeStyle = 'orange'
                this.bounds.stroke(ctx)
            }
        },
        onKeyDown(/** @type{KeyboardEvent} */e) {
            if (e.code == 'Escape' || e.code == 'KeyP')
                this.pause()
            if (e.repeat || this.paused) return
            this.keys[e.code] = true
            if (e.code == 'KeyD')
                this.debug = !this.debug
            if (this.paused) return
            this.player.keyPressed(e)
        },
        onKeyUp(/** @type{KeyboardEvent} */e) {
            this.keys[e.code] = false
        },
        selectDuration(duration) {
            for (let duration of this.durations)
                duration.selected = false
            duration.selected = true
        }
    },
    computed: {
        timerText() {
            const total = Math.ceil(this.timeLeft)
            const seconds = Math.floor(total % 60)
            const minutes = Math.floor(total / 60)
            return `${minutes}:${seconds.toString().padStart(2, '0')}`
        }
    },
    template: /*html*/`
        <div ref="container" class="game-container" style="display: grid; align-items: stretch">
            <canvas
                ref="canvas"
                tabindex="0"
                class="game-canvas"
                :width="width"
                :height="height"
                @keydown="onKeyDown"
                @keyup="onKeyUp"
                @blur="pause"
            />
            <div v-if="state == 'menu'" class="game-menu-container">
                <div class="game-menu-title">
                    Bug Catcher Annie
                </div>
                <div class="game-menu">
                    <div class="mb-1 fs-3 text-center">Select a duration</div>
                    <div class="mb-1" style="display: flex; gap: 1rem">
                        <button
                            v-for="duration in durations"
                            :class="{ selected: selectedDuration == duration }"
                            @click="selectedDuration = duration"
                        >
                            {{ duration }} minute{{ duration == 1 ? '' : 's' }}
                        </button>
                    </div>
                    <div class="fs-3 text-center">
                        <div>Sound Volume: {{ volume }}%</div>
                        <input type="range" min="0" max="100" step="1" v-model="volume" style="width: 400px">
                    </div>
                    <div class="fs-3 text-center mb-1">
                        <div>Music Volume: {{ musicVolume }}%</div>
                        <input type="range" min="0" max="100" step="1" v-model="musicVolume" style="width: 400px">
                    </div>
                    <button class="btn-start" @click="start">Start!</button>
                </div>
            </div>
            <div class="dimmer" :class="{ dimmed: (playing && paused) || state == 'gameover' }"></div>
            <div v-if="playing && paused" class="pause-container">
                <div style="font-size: 4rem; margin-bottom: 1rem">PAUSED</div>
                <div class="mb-1" style="font-size: 3rem; text-align: center">
                    <div>Sound Volume: {{ volume }}%</div>
                    <input type="range" min="0" max="100" step="1" v-model="volume" style="width: 400px">
                </div>
                <div class="mb-1" style="font-size: 3rem; text-align: center">
                    <div>Music Volume: {{ musicVolume }}%</div>
                    <input type="range" min="0" max="100" step="1" v-model="musicVolume" style="width: 400px">
                </div>
                <div style="display: flex; gap: 1rem">
                    <button @click="reset" style="background: #ff000055">Quit</button>
                    <button @click="unpause">Continue</button>
                </div>
            </div>
            <div v-if="playing" class="overlay game-overlay">
                <div>
                    Score: {{ score }}
                </div>
                <div style="justify-self: end">
                    Time: {{ timerText }}
                </div>
            </div>
            <div v-if="state == 'gameover'" class="game-over-container">
                <div>Time's up!</div>
                <div>Your score: {{ score }}</div>
                <button @click="state = 'menu'">Return to menu</button>
            </div>
        </div>
    `
}