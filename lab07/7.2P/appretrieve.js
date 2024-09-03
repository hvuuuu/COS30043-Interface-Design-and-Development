// create new app instance 
const app = Vue.createApp({}) 
// creating component for the lookup table 
app.component('app-retrieve', { 
    data: function() { 
        return {
            units: [],
            err: null,
        }
    },
    //defining template for the app 
    template:   
        `
        <div class="table-responsive">
            <table class="table table-striped table-hover" aria-label="Unit Data">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Description</th>
                        <th>cp</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="unit in units">
                        <td>{{unit.code}}</td>
                        <td>{{unit.desc}}</td>
                        <td>{{unit.cp}}</td>
                        <td>{{unit.type}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
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
            this.units=data; 
        })
        .catch(error => { 
            this.err = { message: "Failed to load data: " + error.message };
        });
    }
});
    
app.mount('#app')