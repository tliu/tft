const inventory = []
const combinations = []
let recipes = new Set()
let oneMoreMap = {}

window.addEventListener("load", ev => {
    const items = document.getElementsByClassName("base-item")
    Array.from(items).forEach(item => {
        item.innerHTML = baseItem(item.dataset.id)
        addItemListener(item)
    })
})

const addItemListener = item => {
    item.addEventListener("click", ev => {
        inventory.push(inventoryItem(item.dataset.id));
        updateInventory();
    })
} 

const baseItem = id => {
    const name = BASE[id]
    const url = `items/${name}`
    return `<img src="${url}"/>`
}

const inventoryItem = id => {
    const item = document.createElement("span")
    item.className = "inv-item"
    item.innerHTML = `${baseItem(id)}`
    item.dataset.id = id
    addSellListener(item)
    return item
}

const addSellListener = item => {
    item.addEventListener("click", ev => {
        inventory.splice(inventory.indexOf(item), 1)
        item.remove()
        updateCombos()
    })
}

const updateInventory = () => {
    inv = document.getElementById("inventory")
    inv.innerHTML = ""
    inventory.forEach(item => {
        inv.appendChild(item)
    })
    updateCombos()
}

const combinedItem = id => {
    const item = document.createElement("span")
    item.dataset.id = id
    item.classList.add("combined-item")
    const name = COMBINED[id]
    const url = `items/${name}`
    item.innerHTML = `<img src="${url}"/>`
    item.enabled = true
    addHoverListener(item)
    return item
}

const findDeps = id => {
    let deps;
    recipes.forEach(recipe => {
        r = JSON.parse(recipe)
        if (r.c == id) {
            deps = r
        }
    })
    return deps
}

const useItem = (recipe, gray) => {
    deps = [recipe.a, recipe.b]
    inventory.forEach(item => {
        id = parseInt(item.dataset.id)
        if (deps.indexOf(id) != -1) {
            deps.splice(deps.indexOf(id), 1) 
            if (gray) {
                item.classList.add("gray")
            } else {
                item.classList.remove("gray")
            }
        }
    });
}

const addHoverListener = item => {
    item.addEventListener("mouseenter", ev => {
        const recipe = findDeps(parseInt(item.dataset.id))
        item.classList.add("selected")     
        useItem(recipe, true)
    })
    item.addEventListener("mouseleave", ev => {
        const recipe = findDeps(parseInt(item.dataset.id))
        item.classList.remove("selected")     
        useItem(recipe, false)
    })

}

const updateCombos = () => {
    const comboDiv = document.getElementById("combos")
    comboDiv.innerHTML = ""
    if (inventory.length <= 1) {
        oneItemAway()
        return
    }
    const combos = new Set()
    const inv = inventory.map(item => {
        return parseInt(item.dataset.id)
    })
    recipes = new Set()
    for (let i = 0; i < inv.length - 1; i++) {
        for (let j = i + 1; j < inv.length; j++) {
            const combined = inv[i] | inv[j]
            recipes.add(JSON.stringify({
                a: inv[i],
                b: inv[j],
                c: combined
            }));
            combos.add(combined)
        }
    }
    combos.forEach(combo => {
        const c = combinedItem(combo)
        combinations.push(c)
        comboDiv.appendChild(c)
    })
    oneItemAway()
}

const renderOneMore = combos => {
    let h = ""
    for (let [k, v] of Object.entries(oneMoreMap)) {
        console.log(k)
        const b = `items/${BASE[v]}`
        const c = `items/${COMBINED[k]}`
        h += `<div class="onemore"><img class="small" src=${b}><div class=v-center> makes </div><img class="small" src=${c}></div>`
    }
    
    document.getElementById("onemore").innerHTML = h
}

const oneItemAway = () => {
    const inv = inventory.map(item => {
        return parseInt(item.dataset.id)
    })

    const comb = combinations.map(combo => {
        return parseInt(combo.dataset.id)
    })

    oneMoreMap = {}
    const combos = new Set()
    Object.keys(BASE).forEach(base => {
        id = parseInt(base)
        const oneMore = [id, Array.from(inv)].flat()
        for (let i = 0; i < oneMore.length - 1; i++) {
            for (let j = i + 1; j < oneMore.length; j++) {
                const a = oneMore[i]
                const b = oneMore[j]
                const combined = a | b 
                if (comb.indexOf(combined) == -1) {
                    if (inv.indexOf(a) == -1) {
                        oneMoreMap[combined] = a
                    } else {
                        oneMoreMap[combined] = b
                    }
                    combos.add(combined)
                }
            }
        }
    })

    renderOneMore(combos)
}
