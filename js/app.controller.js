import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
export const appController = {
    renderLocs,
}

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onDeleteLoc = onDeleteLoc
window.onAddLoc = onAddLoc


function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))
    locService.getLocs().then(renderLocs)
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            onPanTo(pos.coords.latitude, pos.coords.longitude)
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}

function onPanTo(lat = 35.6895, lng = 139.6917) {
    console.log('Panning the Map to,', lat, lng)
    mapService.panTo(lat, lng)
}

function onDeleteLoc(locId) {
    locService.deleteLoc(+locId)
    locService.getLocs().then(renderLocs)
}

function renderLocs(locs) {
    const strHtmls = locs.map(({ id, lat, lng, name }) => `
    <article class="loc flex flex-column">
    <div class="head flex space-between">
        <span>${name}</span>
        <div class="btns-container">
            <button class="go" onclick="onPanTo(${lat},${lng})">Go</button>
            <button class="delete" onclick="onDeleteLoc(${id})">Delete</button>
        </div>
    </div>
    <small>Lat:${lat}, Lang:${lng}</small>
    
</article>
    `)

    document.querySelector('.saved-locs').innerHTML = strHtmls.join('')
}

function onAddLoc(ev) {
    ev.preventDefault()
    const keyword = document.querySelector('header input').value
    locService.getLocationByName(keyword)
        .then(({ address , pos }) => {
            onPanTo(pos.lat, pos.lng)
            document.querySelector('form span').innerHTML = address
            locService.addLocation(address, pos.lat, pos.lng)
            locService.getLocs().then(renderLocs)
        })
}
