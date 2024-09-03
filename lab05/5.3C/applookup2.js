//Defining the list of units in an array 
const units = [
    {code:'ICT10001', desc:'Problem Solving with ICT', cp:12.5, type:'Core'},
    {code:'COS10005', desc:'Web Development', cp:12.5, type:'Core'},
    {code:'INF10003', desc:'Introduction to Business Information Systems', cp:12.5, type:'Core'},
    {code:'INF10002', desc:'Database Analysis and Design', cp:12.5, type:'Core'},
    {code:'COS10009', desc:'Introduction to Programming', cp:12.5, type:'Core'},
    {code:'INF30029', desc:'Information Technology Project Management', cp:12.5, type:'Core'},
    {code:'ICT30005', desc:'Professional Issues in Information Technology', cp:12.5, type:'Core'},
    {code:'ICT30001', desc:'Information Technology Project', cp:12.5, type:'Core'},
]; 
// creating a component for the units to pass in the router 
const Unit = { 
    props: ['id', 'units'], // declare units as a prop
    template:   
        `<div>
            <h2>Unit Code: {{ id }}</h2>
            <ul v-for="unit in filteredUnit">
                <li>{{unit.code}}</li>
                <li>{{unit.desc}}</li>
                <li>{{unit.cp}}</li>
                <li>{{unit.type}}</li>
            </ul>
        </div>`,
    computed: { 
        filteredUnit: function() { 
            return this.units.filter(unit => unit.code.toLowerCase().match(this.id.toLowerCase()));
        } 
    } 
} 
// Creating the VueRouter 
const router = VueRouter.createRouter({ 
    history: VueRouter.createWebHashHistory(), 
    routes: [{ 
        path: '/course/:id', 
        component: Unit,
        props: (route) => ({ id: route.params.id, units: units }) // pass units as a prop
        } //defining path and the component 
    ] 
}) 
// create new app instance 
const app = Vue.createApp({}) 
// creating component for the lookup table 
app.component('app-lookup2', { 
    data: function() { 
        return { 
            units 
        } 
    }, 
    //defining template for the app 
    template:   
        `<div class="table-responsive">
            <table class="table table-striped table-hover" aria-label="Unit Data">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Description</th>
                        <th>More info</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="unit in units">
                        <td>{{unit.code}}</td>
                        <td>{{unit.desc}}</td>
                        <td>
                            <router-link :to="'/course/'+unit.code">
                            Show Details
                            </router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        `,
}) 
// use router, mount to app 
app.use(router) 
app.mount('#app') 