

export class Sounds {
    
    volume = 1

    constructor() {
        this.swish = []
        for (let i = 1; i < 10; i++) {
            this.swish.push(new Audio(`media/game/sound/swish-${i}.wav`))
        }

        this.jump = []
        for (let i = 1; i <= 3; i++) {
            this.jump.push(new Audio(`media/game/sound/jump${i}.wav`))
        }

        this.hurt = []
        for (let i = 1; i <= 3; i++) {
            this.hurt.push(new Audio(`media/game/sound/damaged${i}.wav`))
        }

        this.collect = new Audio(`media/game/sound/Rise02.wav`)
    }

    play(sound) {
        const copy = sound.cloneNode()
        copy.volume = this.volume
        copy.play()
    }

    playRandom(sounds) {
        this.play(sounds[Math.floor(Math.random() * sounds.length)])
    }

    playSwish() {
        this.playRandom(this.swish)
        this.playRandom(this.jump)
    }

    playHurt() {
        this.playRandom(this.hurt)
    }

    playCollect() {
        this.play(this.collect)
    }
}

export const SoundManager = new Sounds()