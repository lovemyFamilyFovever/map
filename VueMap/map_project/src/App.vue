<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet-wfst/dist/leaflet-wfst.src'


export default {
  name: 'App',
  components: {
    HelloWorld
  },
  created() {
    const map = L.map('map', {
      center: [28, 111],
      zoom: 7
    })
    const boundaries = new L.WFS({
      url: 'http://localhost:8080/geoserver/ne/ows',
      typeNS: "ne",
      typeName: "layername",
      crs: L.CRS.EPSG4326,
      style: {
        color: "green",
        weight: 2
      }
    }).addTo(map)
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
