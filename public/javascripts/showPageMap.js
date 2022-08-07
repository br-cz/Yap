mapboxgl.accessToken = mbToken;
const map = new mapboxgl.Map( {
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: restaurant.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
    projection: 'globe' // display the map as a 3D globe
} );
map.on( 'style.load', () => {
    map.setFog( {} ); // Set the default atmosphere style
} );

new mapboxgl.Marker()
    .setLngLat( restaurant.geometry.coordinates )
    .setPopup(
        new mapboxgl.Popup( { offset: 10 } )
            .setHTML(
                `<h5>${restaurant.title}</h5><p>${restaurant.location}</p>`
            )
    )
    .addTo( map )