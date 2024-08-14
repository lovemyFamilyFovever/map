// let url = 'http://gisserver.tianditu.gov.cn/TDTService/wfs'
// const params = {
//     service: 'WFS',
//     version: '1.1.0',
//     request: 'GetFeature',
//     typeName: 'TDTService:RESA',
//     outputFormat: 'application/json',
//     srsName: 'EPSG:4326'
// }
// const url_str = url + L.Util.getParamString(params, url)

// $.ajax({
//     url: url_str,
//     dataType: 'json',
//     success: loadWfsHandler
// });
// var layer
// function loadWfsHandler(data) {
//     console.log(data);
//     layer = L.geoJson(data, {
//         pointToLayer: function (feature, latlng) {
//             var title = feature.properties.name;
//             var marker = L.marker(L.latLng(feature.properties.lat, feature.properties.lon));
//             marker.bindPopup(title);
//             markers.addLayer(marker);
//         }
//     }).addTo(map)
// }
