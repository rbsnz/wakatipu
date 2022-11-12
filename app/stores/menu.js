
export const useMenuStore = Pinia.defineStore('menu', {
    state: () => ({
        items: []
    }),
    actions: {
        async load() {
            if (this.items && this.items.length) return
            
            const res = await fetch('/data/menu.xml')
            const xml = await res.text()

            const xmlDoc = new DOMParser().parseFromString(xml, 'text/xml')
            const xmlMenu = xmlDoc.querySelector('menu')
            const xmlMenuItems = xmlMenu.querySelectorAll('item')

            for (let xmlItem of xmlMenuItems) {
                this.items.push({
                    name: xmlItem.querySelector('name').textContent
                })
            }
        }
    }
})