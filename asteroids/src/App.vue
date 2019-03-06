<template>
  <div id="app">
    <AsteroidGrid @remove="removeAsteroid" :asteroids="asteroids" header="Near-Earth Objects"/>
  </div>
</template>

<script>
import AsteroidGrid from './components/AsteroidGrid.vue'
import axios from 'axios'

export default {
    name: 'app',
    components: {
        AsteroidGrid
    },
    data() {
        return {
            asteroids: []
        }
    },
    created: function () {
      this.fetchAsteroids();
    },
    methods: {
        fetchAsteroids: function() {
            let apiKeyNASA = "T4UuzeSu0ti874ibE2PvT7pUS0YYrlxHaUFIH6oa";
            let urlMeteor = 'https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=' + apiKeyNASA;

            axios.get(urlMeteor)
                .then(res => {
                    this.asteroids = res.data.near_earth_objects.slice(0, 20);
                });
        },
        removeAsteroid: function(index) {
            this.asteroids.splice(index, 1);
        },
    }
}
</script>

<style>
  [v-cloak] {
    display: none;
  }
  div#app {
    padding-bottom: 5px;
    padding-top: 5px;
  }
</style>
