import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
export const appController = {
    renderLocs,
    renderMarkers,
}

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onDeleteLoc = onDeleteLoc
window.onSearchLoc = onSearchLoc
window.onCopyLink = onCopyLink
window.onUserAns = onUserAns


function onInit() {
    mapService.initMap()
        .then(() => {
            const queryStringParams = new URLSearchParams(window.location.search)
            const name = queryStringParams.get('name') || 'tokyo'
            const lat = queryStringParams.get('lat') || 35.6895
            const lng = queryStringParams.get('lng') || 139.6917
            onPanTo(name, lat, lng)
        })

        .catch(() => console.log('Error: cannot init map'))
    locService.getLocs().then(renderLocs).then(renderMarkers)
}

function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            locService.getNameByLoc(pos.coords.latitude, pos.coords.longitude)
                .then(loc => {
                    onPanTo(loc.address, pos.coords.latitude, pos.coords.longitude)
                })
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}

function onPanTo(name, lat = 35.6895, lng = 139.6917) {
    mapService.panTo(lat, lng)
    const queryStringParams = `?name='${name}'&lat=${lat}&lng=${lng}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

    document.querySelector('.user-pos').innerText = name
}

function onDeleteLoc(locId, name) {
    locService.deleteLoc(locId)
    locService.getLocs().then(renderLocs).then(renderMarkers)
    flashMsg(`${name} has been delete`)
}

function onCopyLink() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const name = queryStringParams.get('name')
    const lat = queryStringParams.get('lat')
    const lng = queryStringParams.get('lng')
    const link =
        `https://barbenshi.github.io/travel-tip/?name='${name}'&lat=${lat}&lng=${lng}`
    navigator.clipboard.writeText(link)

    flashMsg('Copy to clipboard')
}

function renderLocs(locs) {
    const strHtmls = locs.map(({ id, lat, lng, name }) => `
    <article class="loc flex flex-column">
    <div class="head flex space-between">
        <span>${name}</span>
        <div class="btns-container">
            <button class="go" onclick="onPanTo('${name}',${lat},${lng})">Go</button>
            <button class="delete" onclick="onDeleteLoc('${id}','${name}')">Delete</button>
        </div>
    </div>
    <small>Lat:${lat}, Lang:${lng}</small>
    
    </article>
    `)

    document.querySelector('.saved-locs').innerHTML = strHtmls.join('')
    return Promise.resolve(locs)
}

function renderMarkers(locs) {
    mapService.resetMarkers()
    locs.forEach(loc => {
        mapService.addMarker(loc)
    })
}

function onSearchLoc(ev) {
    ev.preventDefault()
    const keyword = document.querySelector('header input').value
    locService.getLocationByName(keyword)
        .then(({ address, pos }) => {
            onPanTo(keyword, pos.lat, pos.lng)
            document.querySelector('form span').innerHTML = address
            locService.addLocation(address, pos.lat, pos.lng)
            locService.getLocs().then(renderLocs).then(renderMarkers)
        })
}


function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => {
        el.classList.remove('open')
    }, 3000)
}
function onUserAns(ans, lat, lng) {
    if (!ans) return mapService.closeWindow()
    const placeName = document.querySelector('.place-input').value
    if (!placeName.trim()) return
    locService.addLocation(placeName, lat, lng)
    locService.getLocs().then(renderLocs).then(renderMarkers)
    mapService.closeWindow()
}

