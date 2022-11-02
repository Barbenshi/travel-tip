import { utilService } from "./util.service.js"
import { storageService } from "./storage.service.js"

export const locService = {
    getLocs,
    deleteLoc,
    addLocation,
    getLocationByName,
    getNameByLoc,
}

const LOCS_STORAGE_KEY = 'locsDB'
const locs = storageService.loadFromStorage(LOCS_STORAGE_KEY) || []
const API_KEY = `AIzaSyBX-t9hQNd1M5-aEGol3kXf6F-wZIDrjaI`

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
    locs.push({ id: utilService.makeId(), name, lat, lng, createdAt: Date.now() })
    saveLocs()
}

function saveLocs() {
    storageService.saveToStorage(LOCS_STORAGE_KEY, locs)
}

function getLocationByName(keyword) {
    const locUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${keyword}&key=${API_KEY}`
    return axios.get(locUrl)
        .then(({ data }) => {
            if (!data.results[0]) return Promise.reject('no places found')
            return {
                address: data.results[0].formatted_address,
                pos: data.results[0].geometry.location
            }
        }
        )
}

function getNameByLoc(lat, lng) {
    const locUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
    return axios.get(locUrl)
        .then(({ data }) => {
            if (!data.results[0]) return Promise.reject('no places found')
            return {
                address: data.results[0].formatted_address,
                pos: data.results[0].geometry.location
            }
        }
        )
}
