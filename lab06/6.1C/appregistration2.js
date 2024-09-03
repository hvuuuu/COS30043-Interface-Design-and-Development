// create new app instance 
const app = Vue.createApp({}) 
const vuetify = Vuetify.createVuetify()
// creating component for the lookup table 
app.component('app-registration2', { 
    data: () => ({ 
        fname: '',
        lname: '',
        username: '',
        password: '',
        cpassword: '',
        email: '',
        add: '',
        sub: '',
        postcode: '',
        mobile: '',
        showTerms: false,
        nameRules: [
            v => (!!v && v.trim() != '') || 'Name is required',
            v => (v && /^[A-Za-z]+$/.test(v)) || 'Name must contain only letters',
        ],
        usernameRules: [ 
            v => (!!v && v.trim() != '') || 'Username is required',
            v => (v && v.length >= 3) || 'Username must be have at least 3 characters',
        ],
        passwordRules: [
            v => (!!v) || 'Password is required',
            v => (v && v.length >= 8) || 'Password must be at least 8 characters',
            v => (v && /[$%^&*]/.test(v)) || 'Password must contain at least one special character ($, %, ^, &, *)',
        ],
        emailRules: [
            v => (!!v) || 'Email is required',
            v => (v.includes('@')) || 'Email must contain @',
        ],
        addRules: [
            v => (v.length <= 40) || 'Street Address must be less than 40 characters',
        ],
        subRules: [
            v => (v.length <= 20) || 'Suburb must be less than 20 characters',
        ],
        postcodeRules: [
            v => (!!v && v.trim() != '') || 'Postcode is required',
            v => (/^\d{4}$/.test(v)) || 'Postcode must be exactly 4 numeric digits',
        ],
        mobileRules: [
            v => (!!v && v.trim() != '') || 'Mobile Number is required',
            v => (/^04\d{8}$/.test(v)) || 'Mobile Number must be 10 digits and start with 04',
        ],
        streetRules: [
            v => (!!v && v.trim() != '') || 'Street Address is required',
        ],
    }), 
    computed: {
        cpasswordRules() {
            return [
                v => (!!v ) || 'Confirm Password is required',
                v => (v === this.password) || 'Confirm Password must match Password',
            ];
        },
    },
    //defining template for the app 
    template:   
        `
        <v-container fluid>
            <v-row align="center" justify="center">
                <v-col cols="12" sm="8" md="4">
                    <v-form ref="myForm" method="post" action="http://mercury.swin.edu.au/it000000/formtest.php" class="mx-4 my-4">
                        <v-text-field v-model="fname" name="fname" :rules="nameRules" label="First Name" class="mb-3"></v-text-field>
                        <v-text-field v-model="lname" name="lname" :rules="nameRules" label="Last Name" class="mb-3"></v-text-field>
                        <v-text-field v-model="username" name="username" :rules="usernameRules" label="Username" class="mb-3"></v-text-field>
                        <v-text-field type="password" name="password" :rules="passwordRules" v-model="password" label="Password" class="mb-3"></v-text-field>
                        <v-text-field type="password" name="cpassword" :rules="cpasswordRules" v-model="cpassword" label="Confirm Password" class="mb-3"></v-text-field>
                        <v-text-field v-model="email" name="email" :rules="emailRules" label="Email" class="mb-3"></v-text-field>
                        <v-text-field v-model="add" name="add" :rules="streetRules" label="Street Address" class="mb-3"></v-text-field>
                        <v-text-field v-model="sub" name="sub" :rules="subRules" label="Suburb" class="mb-3"></v-text-field>
                        <v-text-field v-model="postcode" name="postcode" :rules="postcodeRules" label="Postcode" class="mb-3"></v-text-field>
                        <v-text-field v-model="mobile" name="mobile" :rules="mobileRules" label="Mobile Number" class="mb-3"></v-text-field>
                        <v-btn type="submit" color="primary">Submit</v-btn>
                    </v-form>
                    <v-btn @click="showTC" class="mx-4 my-4">Terms and Conditions</v-btn>
                    <div v-if="showTerms" class="mx-4 my-4">
                        <p>These are the terms and conditions...</p>
                    </div>
                </v-col>
            </v-row>
        </v-container>
        `,
    methods: {
        showTC() {
            this.showTerms = !this.showTerms;
        },
    },
});
    
app.use(vuetify).mount('#app')