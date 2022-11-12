import { useBookingStore } from '../stores/booking.js'
import { useMenuStore } from '../stores/menu.js'

export default {
    setup: () => ({
        bookingStore: useBookingStore(),
        menuStore: useMenuStore()
    }),
    data: () => ({
        loading: true,
        tooltipText: '',
        showTooltip: false
    }),
    async mounted() {
        await this.menuStore.load()
        this.loading = false
    },
    computed: {
        totalPrice() {
            if (!this.menuStore.items.length) return 0
            return this.menuStore.items.map(item => item.price * item.count).reduce((a, b) => a + b)
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
                    v-for="item of menuStore.items"
                    class="menu-item"
                >
                    <!-- Image -->
                    <div class="menu-image" :style="{ backgroundImage: \`url(/media/menu/$\{item.image})\` }"></div>
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
                                @click="item.count--"
                            >
                                -
                            </button>
                            <div>{{ item.count || 0 }}</div>
                            <button
                                class="menu-item-step-btn"
                                :disabled="item.count == 10"
                                @click="item.count++"
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
                <button @click="bookingStore.back()">Back</button>
                <button @click="bookingStore.next()">Continue</button>
            </div>
        </div>
    `
}
