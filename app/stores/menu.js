const itemTypes = {
    'V': {
        id: 'V',
        name: 'Vegetarian'
    },
    'GF': {
        id: 'GF',
        name: 'Gluten Free'
    },
    'EF': {
        id: 'EF',
        name: 'Egg Free'
    }
}

const unknownItemType = { id: '?', name: '?' }

const toItemTypes = (s) => {
    if (!s) return []
    return s.split(',').map(x => itemTypes[x] || unknownItemType)
}

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
                    id: xmlItem.getAttribute('id'),
                    name: xmlItem.querySelector('name').textContent,
                    description: xmlItem.querySelector('description').textContent,
                    image: xmlItem.querySelector('image').textContent,
                    price: parseFloat(xmlItem.querySelector('price').textContent),
                    types: toItemTypes(xmlItem.querySelector('type')?.textContent),
                    count: 0
                })
            }
        }
    }
})