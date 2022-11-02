import { utilService } from "./util.service.js"
import { storageService } from "./storage.service.js"

export const locService = {
    getLocs,
    deleteLoc,
    addLocation,
}

const LOCS_STORAGE_KEY = 'locsDB'
const locs = storageService.loadFromStorage(LOCS_STORAGE_KEY) || []

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
    saveLocs()
}

function addLocation(name, lat, lng) {
    locs.push({ id: utilService.makeId(), name, lat, lng })
    saveLocs()

    console.log(locs);
}

function saveLocs() {
    storageService.saveToStorage(LOCS_STORAGE_KEY, locs)
}
