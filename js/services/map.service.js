import { locService } from './loc.service.js'
import { appController } from '../app.controller.js'


export const mapService = {
    initMap,
    addMarker,
    panTo,
    closeWindow,
}


// Var that is used throughout this Module (not global)
var gMap
let gInfoWindow

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
            gInfoWindow = new google.maps.InfoWindow({
                content: 'Click the map to get Lat/Lng!',
                position: myLatlng,
            })

            // infoWindow.open(gMap);

            // Configure the click listener.
            gMap.addListener('click', (ev) => {
                // Close the current InfoWindow.
                gInfoWindow.close()

                // Create a new InfoWindow.
                gInfoWindow = new google.maps.InfoWindow({
                    position: ev.latLng,
                });
                // infoWindow.setContent(
                //     JSON.stringify(ev.latLng.toJSON(), null, 2)

                // );
                const lat = ev.latLng.lat()
                const lng = ev.latLng.lng()
                const inputForm =
                    `
                <div class="loc-modal flex flex-column justify-center align-center">    
                Place Name: <input type="text" class="place-input">
                <small>pos:${JSON.stringify(ev.latLng.toJSON(), null, 2)}</small>
                <div class="confirm-btns flex ">
                <button onclick="onUserAns(true,${lat},${lng})">Save Place</button>
                <button onclick="onUserAns(false)">Cancel</button>
                </div>
                </div>
                `
                gInfoWindow.setContent(inputForm)
                gInfoWindow.open(gMap);
                // console.log(ev.latLng.toJSON())
            });
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


function closeWindow() {
    gInfoWindow.close()
}