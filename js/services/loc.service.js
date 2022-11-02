export const locService = {
    getLocs,
    deleteLoc
}


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}

function deleteLoc(locId) {
    const locIdx = locs.findIndex(loc => loc.id === locId)
    locs.splice(locIdx, 1)
}

