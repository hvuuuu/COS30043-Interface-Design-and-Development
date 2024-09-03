const Login = {
    // defining variables to be used in the component
    data() {
        return {
            msg:'',
            input: {
                username: "",
                password: ""
            },
            valid: true,
            //defining username rules for validation
            usernameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length <= 10) || 'Name must be less than 10 characters',
                ],
                //defining username rules for validation
                passwordRules: [
                v => !!v || 'Password is required',
                v => (v && v.length >= 8) || 'Password must be more than 8 characters',
            ],
        }
    },
    methods: {
        login() {
            if (this.$refs.form.validate()) {
                //this.$refs.form.validate() will validate all inputs and return if they are all valid or not.
                var self = this; 
                // GET request using fetch with error handling
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: this.input.username,
                        password: this.input.password 
                    })
                };
        
                fetch("api_user.php/", requestOptions)
                .then( response =>{
                    //turning the response into the usable data
                    return response.json();
                })
                .then( data =>{ 
                //This is the data you wanted to get from url
                    if (data == null) {// didn't find this username password pair
                        self.msg="username or password incorrect.";
                    }
                    else{
                        this.$emit("authenticated", true);//$emit() function allows you to pass custom events up the component tree.
                        this.$router.replace({ name: "Dashboard" });
                    }
                })
                .catch(error => {
                    self.msg = "Error: "+error;
                });        
            }
        },
        reset() {
            this.$refs.form.reset()
        }
    },

    // define the template for the component
    template: `
        <v-row>
            <v-col class="center" cols="12" md="6">
                <v-card class="mx-auto" max-width="90%">
                    <v-card-title>
                        <h2> User Login</h2>
                    </v-card-title>
                    <v-card-text>
                        <v-form ref="form" v-model="valid">
                            <v-text-field v-model="input.username" :counter="10" :rules="usernameRules" label="Username" required></v-text-field>

                            <v-text-field v-model="input.password" label="Password" type="password" :rules="passwordRules" required></v-text-field>

                            <v-btn   color="success" class="mr-4" @click="login()">
                                Login
                            </v-btn>

                            <v-btn color="error" class="mr-4" @click="reset">
                                Reset
                            </v-btn>

                        </v-form>
                        <p>{{msg}}</p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    `
}

const Dashboard = {
    // defining data to be used in the component
    data: function() {
      return {
        tab: null,
        items: [
          'View', 'Insert', 'Update', 'Delete',
        ]
      }
    },
  
    // define the template for the component
    template: `
    <div id="dashboard">
  
        <v-card>
            <v-card-title class="text-center justify-center py-6">
                <h1 class="font-weight-bold display-3 basil--text">
                Dashboard
                </h1>
            </v-card-title>
            <v-card-text>
            <v-tabs
                v-model="tab"
                background-color="transparent"
                color="basil"
                grow
            >
                <v-tab
                v-for="item in items"
                :key="item"
                >
                {{ item }}
                </v-tab>
            </v-tabs>
        
            <v-tabs-items v-model="tab">
        
                <v-tab-item  >
                <v-card flat>
                    <app-readmysql v-if="tab==0"></app-readmysql>
                        
                    <app-postdata v-show="tab==1"></app-postdata>
                    
                    <app-putdata v-show="tab==2"></app-putdata>
        
                    <app-deldata v-show="tab==3"></app-deldata>
        
                </v-card>
                </v-tab-item>
        
            </v-tabs-items>
        
            </v-card-text>
        </v-card>

    </div>
    `
}

// app-readmysql component
const ReadMysql ={
    components: {
        paginate: VuejsPaginateNext,
    },
    data: function() {
        return {
            units: [],
            currentPage: 1,
            perPage: 5,
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
        `,
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
    },
    created() {
        var self = this
        var readSQLApiURL = 'apis.php/' //define url for api
    
        // GET request using fetch with error handling
    
        fetch(readSQLApiURL )
        .then( response =>{
            //turning the response into the usable data
            return response.json( );
        })
        .then( data =>{
            //This is the data you wanted to get from url
            self.units=data;
        })
        .catch(error => {
            self.errorMessage = error;
        });
        
    }
} 

const PostData = {
    template: `
        <v-row>
            <v-col cols="12" md="6" >

                <v-card
                    class="mx-auto"
                    max-width="90%"
                    >

                    <v-card-text>
                        <v-form>
                            <v-text-field label="Unit Code" v-model="unitCode1" /></v-text-field>
                            <v-text-field label="Description" v-model="description1" /></v-text-field>
                            <v-text-field label="CP" v-model="cp1" /></v-text-field>
                            <v-text-field label="Type" v-model="type1" /></v-text-field>

                        <v-btn
                        depressed
                        v-on:click="postData(unitCode, description, cp, type)"
                        color="primary">
                        Add
                        </v-btn>

                        </v-form>
                    </v-card-text>

                </v-card>

            </v-col >
                    <!-- Output -->
            <v-col cols="12" md="6">
                <v-card
                    class="mx-auto"
                    max-width="90%"
                    >
                    <v-card-text>
                        <p>Output Message : {{ msg }}</p>
                        <p>Status Code: {{statusVal}}</p>
                        <p>Status: {{statusText}}</p>
                        <p>Response Headers: {{headers}}</p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
  
     `,
    data: function() {
      return {
        unitCode1: '',
        description1: '',
        cp1: '',
        type1: '',
        msg: '',
        statusVal: '',
        statusText: '',
        headers: '',
        savingSuccessful: false,
      }
    },
    methods: {
        postData: function(unitCode1, description1, cp1, type1) {
            // Check if cp is a valid number
            if (isNaN(cp1)) {
                this.msg = "CP must be a valid number.";
                return;
            }
            //define url for api
            var postSQLApiURL = 'apis.php/'
    
            var self = this;
            // POST request using fetch with error handling
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: unitCode1,
                    desc: description1,
                    cp: cp1,
                    type: type1
                })
            };
    
            fetch(postSQLApiURL, requestOptions)
            .then( response =>{
                //turning the response into the usable data
                return response.json();
            })
            .then( data =>{
                //This is the data you wanted to get from url
                self.msg = "Data Inserted Successfully.";
            })
            .catch(error => {
                self.msg = 'There was an error!' + error;
            });	
        }
  
    }
};

const PutData = {
    template: `
        <!-- Updating mySQL Table With Unit Code as Key -->
        <v-row>
            <v-col cols="12" md="6">
                <v-card class="mx-auto" max-width="90%">
                    <v-card-text>
                        <!-- Input -->
                        <v-form name="myForm2" class="form-horizontal">
                            <v-text-field label="Unit Code" v-model="unitCode" />
                            <v-text-field label="Description" v-model="description" />
                            <v-text-field label="CP" v-model="cp" />
                            <v-text-field label="Type" v-model="type" />
                            <v-btn depressed v-on:click="putData(unitCode, description, cp, type)" color="primary">
                                Update
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
            <!-- Output -->
            <v-col cols="12" md="6">
                <v-card>
                    <v-card-text>
                        <p>Output Message : {{msg}}</p>
                        <p>Status Code: {{statusVal}}</p>
                        <p>Status: {{statusText}}</p>
                        <p>Response Headers: {{headers}}</p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    `,
    //variable initialization
    data: function() {
        return {
            unitCode: '',
            description: '',
            cp: '',
            type: '',
            msg: '',
            statusVal: '',
            statusText: '',
            headers: '',
        }
    },
    methods: {
        putData: function(unitCode, description, cp, type) {
            var putSQLApiURL = 'apis.php/code/' + unitCode;
            var self = this;
            // PUT request using fetch with error handling
            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: unitCode,
                    desc: description,
                    cp: cp,
                    type: type
                })
            };

            fetch(putSQLApiURL, requestOptions)
            .then( response =>{
                //turning the response into the usable data
                return response.json();
            })
            .then( data =>{
                //This is the data you wanted to get from url
                self.msg="Update successful";
            })
            .catch(error => {
                self.msg='There was an error: ' + error;
            });
        }
    }
}

// app-deldata  component  
const DelData = {
    template: `
        <v-row>
            <v-col cols="12" md="6 ">
                <v-card class="mx-auto" max-width="90%">
                    <v-card-text>
                        <v-form>
                            <v-text-field label="Unit Code" v-model="unitcode2" />
                            </v-text-field>
                            <v-btn depressed v-on:click="delData(unitcode2)" color="primary">Delete</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
            <!-- Output -->
            <v-col cols="12" md="6">
                <v-card class="mx-auto" max-width="90%">
                    <v-card-text>
                        <!-- Output -->
                        <p>Output Message : {{msg}}</p>
                        <p>Status Code: {{statusVal}}</p>
                        <p>Status: {{statusText}}</p>
                        <p>Response Headers: {{headers}}</p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    `,
    // variable initialization
    data: function() {
        return {
            unitcode2: '',
            msg: '',
            statusVal: '',
            statusText: '',
            headers: '',
        }
    },
    methods: {
        delData: function(unitCode) {
            var delSQLApiURL = 'apis.php/code/' + unitCode;
            var self = this;
            // DELETE request using fetch with error handling
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: unitCode // Assuming the API requires the unit code in the body, though it's not typical for DELETE requests
                })
            };
            fetch(delSQLApiURL, requestOptions)
            .then( response =>{
                //turning the response into the usable data
                return response.json( );
            })
            .then( data =>{
            //This is the data you wanted to get from url
                self.msg = "Data deleted Successfully"
            })
            .catch(error => {
                self.msg = 'There was an error!';
                self.statusText = error;
            });	
        }
    }
}
  
// Creating the VueRouter 
const router = VueRouter.createRouter({ 
    history: VueRouter.createWebHashHistory(), 
    routes: [
        { 
            path: '/login', 
            name: 'Login',
            component: Login,
        },
        {
            path: '/logout',
            name: 'logout',
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: Dashboard,
        }
    ] 
}) 
// create new app instance 
const app = Vue.createApp({
    data: function () {
        return{
            authenticated: false,
            authenticatedUser: '',
            error:false,
            errorMsg:'',
        }
    },
    mounted() {
        if(!this.authenticated) {
                this.$router.replace({ name: "Login" });
            }
        },
    methods: {
        setAuthenticated(status) {
            this.authenticated = status;
        },
        logout(){
            this.authenticated=false;
        }
    },  
}) 
// creating component for the lookup table 
app.component('single-page', { 
    //defining template for the app 
    template:   
        `
        <div>
            <v-spacer></v-spacer>
            <v-btn>
                <router-link  to="/login" v-on:click="logout()" replace>Logout<v-icon>mdi-logout</v-icon></router-link>
                        <!-- replace: the navigation will not leave a history record.  -->
            </v-btn>
        </div>
        `,
    methods: {
        logout() {
            this.$root.logout();
        }
    }
});
app.component('app-readmysql', ReadMysql)
app.component('app-postdata', PostData)
app.component('app-putdata', PutData)
app.component('app-deldata', DelData)


const vuetify = Vuetify.createVuetify( )   
app.use(vuetify)
app.use(router) 
app.mount('#app')