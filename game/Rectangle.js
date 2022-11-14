export class Rectangle {
    x = 0
    y = 0
    w = 0
    h = 0

    get left() { return this.x }
    get right() { return this.x + this.w }
    get top() { return this.y }
    get bottom() { return this.y + this.h }

    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    contains(point) {
        return (
            point.x >= this.left && point.x <= this.right &&
            point.y >= this.top && point.y <= this.bottom
        )
    }

    intersectsWith(other) {
        return (
            this.left <= other.right && this.right >= other.left &&
            this.top <= other.bottom && this.bottom >= other.top
        )
    }

    /**
     * @param {CanvasRenderingContext2D} context
     */
    stroke(context) {
        context.strokeRect(this.x, this.y, this.w, this.h)
    }

    /**
     * @param {CanvasRenderingContext2D} context
     */
    fill(context) {
        context.fillRect(this.x, this.y, this.w, this.h)
    }
}