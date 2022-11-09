export default {
    data: () => ({
        show: false,
        position: { x: 0, y: 0 }
    }),
    template: /*html*/`
        <div class="tooltip-parent">
            <div class="tooltip-child">
                <slot />
            </div>
        </div>
    `
}