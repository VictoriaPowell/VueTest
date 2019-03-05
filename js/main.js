Vue.component('a-pod', {
    template: '' +
        '<div>' +
            '<slot name="title"><h3>Untitled</h3></slot>' +
            '<img width="300" height="200" :src="imgSrc" :title="imgTitle">' +
            '<slot name="caption" :date="date"><p>unknown date</p></slot></div>',
    props: ['date'],
    data: function() {
        return {
            imgSrc: '',
            imgTitle: ''
        };
    },
    created: function() {
        this.fetchApod();
    },
    methods: {
        fetchApod: function() {
            let apiKeyNASA = "T4UuzeSu0ti874ibE2PvT7pUS0YYrlxHaUFIH6oa";
            let urlPOD = 'https://api.nasa.gov/planetary/apod?api_key=' + apiKeyNASA;
            if(this.date){
                urlPOD += '&date=' + this.date;
            }
            let self = this;
            axios.get(urlPOD)
                .then(function (res){
                    self.imgSrc = res.data.url;
                    self.imgTitle = res.data.title;
                });
        },
    }
});

let anotherComponent = {
    data: function () {
        return {
            msg: 'Hello from another component!'
        }
    },
    template: '<h1>{{msg}}</h1>'
};

Vue.component('my-component',{
    template: '<strong>A static element...</strong>'
});

let vm = new Vue({
    el: '#app',
    components: {
        'another-component': anotherComponent
    },
    data: {
        email: 'anonymous@example.com',
        submitted: false,
        imgSrc: '',
        imgTitle: '',
        asteroids: [],
        showSummary: true
    },
    computed: {
        numAsteroids: function () {
            return this.asteroids.length;
        },
        closestObject: function () {
            let neosHavingData = this.asteroids.filter(function (neo){
                return neo.close_approach_data.length > 0;
            });
            let simpleNeos = neosHavingData.map(function (neo){
                return {name: neo.name, miles: neo.close_approach_data[0].miss_distance.miles};
            });
            let sortedNeos = simpleNeos.sort(function (a,b){
                return a.miles - b.miles;
            });
            return sortedNeos[0].name;
        }
    },
    created: function () {
        this.fetchApod();
        this.fetchMeteor();
    },
    methods: {
        processSubmit: function() {
            this.submitted = true;
        },
        fetchApod: function() {
            let apiKeyNASA = "T4UuzeSu0ti874ibE2PvT7pUS0YYrlxHaUFIH6oa";
            let urlPOD = 'https://api.nasa.gov/planetary/apod?api_key=' + apiKeyNASA;

            axios.get(urlPOD)
                .then(function (res){
                    vm.imgSrc = res.data.url;
                    vm.imgTitle = res.data.title;
                });
        },
        fetchMeteor: function() {
            let apiKeyNASA = "T4UuzeSu0ti874ibE2PvT7pUS0YYrlxHaUFIH6oa";
            let urlMeteor = 'https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=' + apiKeyNASA;

            axios.get(urlMeteor)
                .then(function (res){
                    vm.asteroids = res.data.near_earth_objects.slice(0, 20);
                });
        },
        getCloseApproachDate: function(a){
            if(a.close_approach_data.length > 0){
                return a.close_approach_data[0].close_approach_date;
            }
            return 'N/A';
        },
        removeAsteroid: function(index) {
            this.asteroids.splice(index, 1);
        },
        getRowStyle: function(a) {
            if (a.close_approach_data.length == 0){
                return {
                    border: 'solid 3px red',
                    color: 'red'
                };
            }
        },
        isMissingData: function (a) {
            return a.close_approach_data.length == 0;
        }
    }
});