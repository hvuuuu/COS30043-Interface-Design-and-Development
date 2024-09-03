// create new app instance 
const app = Vue.createApp({}) 
// creating component for the lookup table 
app.component('app-table', { 
    components: {
        paginate: VuejsPaginateNext,
    },
    data: function() {
        return {
            units: [],
            currentPage: 1,
            perPage: 1,
            err: null,
        }
    },
    //defining template for the app 
    template:   
        `
        <div class="table-responsive">
            <table class="table table-striped table-hover caption-top" aria-label="Unit Data">
                <caption class="h2">Unit Data Overview</caption>
                <thead>
                    <tr>
                        <th id="code" scope="col">Code</th>
                        <th id="description" scope="col">Description</th>
                        <th id="cp" scope="col">cp</th>
                        <th id="type" scope="col">Type</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="unit in getItems">
                        <td headers="code">{{unit.code}}</td>
                        <td headers="description">{{unit.desc}}</td>
                        <td headers="cp">{{unit.cp}}</td>
                        <td headers="type">{{unit.type}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <paginate :page-count="getPageCount" :page-range= "3" :margin-pages="1" :click-handler="clickCallback" :prev-text="'Previous Page'" :next-text="'Next Page'" :container-class="'pagination'" :page-class="'page-item'" :page-link-class="'page-link'" :active-class="'active'"></paginate>
        <div v-if="err">
            <p>There was an error: {{ err.message }}</p>
        </div>
        `,
    mounted() {
        var self = this;
        var url = 'units.json'
        fetch(url)
        .then(response =>{ 
            //turning the response into the usable data 
            return response.json( ); 
        })
        .then(data =>{ 
            //This is the data you wanted to get from url 
            self.units=data; 
        })
        .catch(error => { 
            this.err = { message: "Failed to load data: " + error.message };
        });
    },
    computed: {
        getItems: function() {
            const current = this.currentPage * this.perPage;
            const start = current - this.perPage;
            return this.units.slice(start, current);
        },
        getPageCount: function() {
            return Math.ceil(this.units.length / this.perPage);
        },
    },
    methods: {
        clickCallback: function(pageNum) {
            this.currentPage = pageNum;
        }
    }

});
    
app.mount('#app')