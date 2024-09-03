// create students' marks array
const studMarks = [
    {name: 'Amy', mark: 90},
    {name: 'Bill', mark: 80},
    {name: 'Casey', mark: 78},
    {name: 'David', mark: 84},
    {name: 'Ella', mark: 88},
    {name: 'Frank', mark: 85},
    {name: 'Grace', mark: 82},
    {name: 'Harry', mark: 79},
    {name: 'Ivy', mark: 87},
    {name: 'Jack', mark: 91},
    {name: 'Kate', mark: 83},
    {name: 'Liam', mark: 89},
    {name: 'Mia', mark: 92},
    {name: 'Nick', mark: 76},
    {name: 'Olivia', mark: 77},
    {name: 'Peter', mark: 86},
    {name: 'Queenie', mark: 75},
    {name: 'Robert', mark: 74},
    {name: 'Sally', mark: 73},
    {name: 'Tom', mark: 72},
    {name: 'Uma', mark: 71},
    {name: 'Vicky', mark: 70},
    {name: 'Will', mark: 69},
    {name: 'Xavier', mark: 68},
    {name: 'Yvonne', mark: 67},
    {name: 'Zack', mark: 66},
];
// create new app instance 
const app = Vue.createApp({}) 
// creating component for the lookup table 
app.component('app-mark', { 
    components: {
        paginate: VuejsPaginateNext,
    },
    data: function() {
        return {
            studMarks,
            name: '',
            currentPage: 1,
            perPage: 3,
        }
    },
    //defining template for the app 
    template:   
        `
        <div class="table-responsive">
            <table class="table table-striped table-hover caption-top" aria-label="Student Marks">
                <caption class="h2">Student Marks</caption>
                <thead>
                    <tr>
                        <th id="studentName" scope="col">Student Name</th>
                        <th id="studentMark" scope="col">Marks</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="studMark in getItems">
                        <td headers="studentName">{{studMark.name}}</td>
                        <td headers="studentMark">{{studMark.mark}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <paginate :page-count="getPageCount" :page-range= "3" :margin-pages="1" :click-handler="clickCallback" :prev-text="'Previous Page'" :next-text="'Next Page'" :container-class="'pagination'" :page-class="'page-item'" :page-link-class="'page-link'" :active-class="'active'"></paginate>
        `,
    computed: {
        getItems: function() {
            const current = this.currentPage * this.perPage;
            const start = current - this.perPage;
            return this.studMarks.slice(start, current);
        },
        getPageCount: function() {
            return Math.ceil(this.studMarks.length / this.perPage);
        },
    },
    methods: {
        clickCallback(pageNum) {
            this.currentPage = Number(pageNum);
        },
    }

});
    
app.mount('#app')