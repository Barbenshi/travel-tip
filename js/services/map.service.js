import { locService } from './loc.service.js'
import { appController } from '../app.controller.js'


export const mapService = {
    initMap,
    addMarker,
    panTo
}


// Var that is used throughout this Module (not global)
var gMap

function initMap() {
    const myLatlng = { lat: 32.0749831, lng: 34.9120554 }
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: myLatlng,
                zoom: 15
            })
            console.log('Map!', gMap)

            // Create the initial InfoWindow.
            let infoWindow = new google.maps.InfoWindow({
                content: 'Click the map to get Lat/Lng!',
                position: myLatlng,
            })

            // infoWindow.open(gMap);

            // Configure the click listener.
            gMap.addListener('click', (ev) => {
                // Close the current InfoWindow.
                infoWindow.close()

                // Create a new InfoWindow.
                infoWindow = new google.maps.InfoWindow({
                    position: ev.latLng,
                })
                infoWindow.setContent(
                    JSON.stringify(ev.latLng.toJSON(), null, 2)

                )
                infoWindow.open(gMap);
                // console.log(ev.latLng.toJSON())

                const name = prompt('Enter place name', 'place')
                if (!name) return
                const lat = ev.latLng.lat()
                const lng = ev.latLng.lng()
                locService.addLocation(name, lat, lng)
                locService.getLocs().then(appController.renderLocs).then(appController.renderMarkers)
            })
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyB9i88rnLvNncgVs0Mm7m_I_ejiaMyDKb8'
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

