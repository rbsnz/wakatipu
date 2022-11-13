import { useBookingStore } from '../stores/booking.js'

export default {
    data: () => ({
        store: useBookingStore(),
        loading: true,
        tooltipText: '',
        showTooltip: false
    }),
    async mounted() {
        await this.store.loadMenu()
        this.loading = false
    },
    computed: {
        totalPrice() {
            if (!this.store.menuItems) return 0
            const values = Object.values(this.store.menuItems)
            if (!values.length) return 0
            return Object.values(this.store.menuItems)
                .map(item => item.price * item.count)
                .reduce((a,b) => a+b)
        }
    },
    methods: {
        hoverItemType(type) {
            this.tooltipText = type.name
            this.showTooltip = true
        },
        unhover() {
            this.showTooltip = false
        }
    },
    template: /*html*/`
        <div class="glass-container" style="max-width: 60rem">
            <Tooltip :visible="showTooltip">{{ tooltipText }}</Tooltip>
            <div style="margin-bottom: 1rem">Please select any meals or refreshments you would like during your trip.</div>
            <div class="menu-items" style="margin-bottom: 1rem">
                <div
                    v-for="item in store.menuItems"
                    class="menu-item"
                >
                    <!-- Image -->
                    <div class="menu-image" :style="{ backgroundImage: \`url(media/menu/$\{item.image})\` }"></div>
                    <!-- Description -->
                    <div class="menu-item-info">
                        <div class="menu-item-name">
                            <div>{{ item.name }}</div>
                            <!-- Menu item types -->
                            <div class="menu-item-types">
                                <div
                                    v-for="type in item.types"
                                    class="menu-item-type"
                                    @pointerenter="hoverItemType(type)"
                                    @pointerleave="unhover()"
                                >
                                    {{ type.id }}
                                </div>
                            </div>
                        </div>
                        <div class="menu-item-description">{{ item.description }}</div>
                        <!-- Count -->
                        <div class="menu-item-count">
                            <button
                                class="menu-item-step-btn"
                                :disabled="!item.count || item.count == 0"
                                @click="store.removeMenuItem(item)"
                            >
                                -
                            </button>
                            <div>{{ item.count || 0 }}</div>
                            <button
                                class="menu-item-step-btn"
                                :disabled="item.count >= store.maxMenuItems"
                                @click="store.addMenuItem(item)"
                            >
                                +
                            </button>
                            <div>&times;</div>
                            <div class="menu-item-price">$\{{ item.price.toFixed(2) }}</div>
                        </div>
                    </div>
                  
                </div>
            </div>
            <div style="margin-bottom: 1rem; text-align: right">
                Total: $\{{ totalPrice.toFixed(2) }}
            </div>
            <div class="uniform-grid-columns">
                <button @click="store.back()">Back</button>
                <button @click="store.next()">Continue</button>
            </div>
        </div>
    `
}
