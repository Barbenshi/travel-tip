
export const mapService = {
    initMap,
    addMarker,
    panTo,
    closeWindow,
    resetMarkers,
}

var gMap
let gInfoWindow
let gMarkers = []

function resetMarkers() {
    gMarkers.forEach(marker => marker.setMap(null))
}

function initMap() {
    const myLatlng = { lat: 32.0749831, lng: 34.9120554 }
    return _connectGoogleApi()
        .then(() => {
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: myLatlng,
                zoom: 15
            })

            gInfoWindow = new google.maps.InfoWindow({
                content: 'Click the map to get Lat/Lng!',
                position: myLatlng,
            })

            gMap.addListener('click', (ev) => {
                gInfoWindow.close()
                gInfoWindow = new google.maps.InfoWindow({
                    position: ev.latLng,
                });
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
            });
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    gMarkers.push(marker)
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