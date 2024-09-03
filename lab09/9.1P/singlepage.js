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

const StudentMarks = {
    components: {
        paginate: VuejsPaginateNext,
    },
    data: function() {
        return {
            studMarks,
            currentPage: 1,
            perPage: 3,
        }
    },
    template: `
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
        getItems() {
            const current = this.currentPage * this.perPage;
            const start = current - this.perPage;
            return this.studMarks.slice(start, current);
        },
        getPageCount() {
            return Math.ceil(this.studMarks.length / this.perPage);
        },
    },
    methods: {
        clickCallback(pageNum) {
            this.currentPage = Number(pageNum);
        },
    }
};

const PostManagement = {
    // defining data to be used in the component 
    data:function(){ 
        return{ 
            statPosts:[], 
            strStatus:'' 
        } 
    }, 
    // define the template for the component 
    template: 
    // your code here 
        `
            <div>
                <h2>Post Management</h2>
                <label for="status">Status</label>
                <input v-model="strStatus" id="status">
                <input type="button" value="Post" @click="add(strStatus)">
                <div v-for="(status, index) in statPosts">
                    <span>{{status}}</span>
                    <input type="button" value="Remove" @click="remove(index)">
                </div>
            </div>
        `,
    // defining the methods for add and remove status messages
    methods:{ 
        add:function(status){ 
            //add status to statPost
            this.statPosts.unshift(status);
            this.strStatus = ''; // clear the input field after posting
        }, 
        remove:function(index){ 
            //delete status from statPost using index 
            this.statPosts.splice(index, 1);
        } 
    } 
};

const NameTest = {
    data() {
        return {
            strName: ''
        }
    },
    template:
        `
            <div>
                <h2>Name Test</h2>
                <label for="strName">Please enter your name:</label>
                <input v-model="strName" id="strName">
                <div v-if="strName.toLowerCase() == 'vu'">
                    <p>Awesome name!</p>
                </div>
                <div v-else-if="strName.trim() == ''">
                    <p></p>
                </div>
                <div v-else="strName != 'vu'">
                    <p>{{ strName }} is not my name</p>
                </div>
            </div>
        `,
};

// Creating the VueRouter 
const router = VueRouter.createRouter({ 
    history: VueRouter.createWebHashHistory(), 
    routes: [
        { 
            path: '/nametest', 
            name: 'NameTest',
            component: NameTest
        },
        {
            path: '/postmanagement',
            name: 'Post Management',
            component: PostManagement,
        },
        {
            path: '/studentmarks',
            name: 'Student Marks',
            component: StudentMarks,
        }
    ] 
}) 
// create new app instance 
const app = Vue.createApp({}) 
// creating component for the lookup table 
app.component('single-page', { 
    //defining template for the app 
    template:   
        `
        <div>
            <v-spacer></v-spacer>
            <v-btn>
                <router-link to="/nametest" class="h3">
                    Name Test
                </router-link>
            </v-btn>
            <v-btn>
                <router-link to="/postmanagement" class="h3">
                    Post Management 
                </router-link>
            </v-btn>
            <v-btn>
                <router-link to="/studentmarks" class="h3">
                    Student Marks
                </router-link>
            </v-btn>
            <router-view class="mt-3"></router-view>
        </div>
        `,
    
});
app.use(router) 
app.mount('#app')