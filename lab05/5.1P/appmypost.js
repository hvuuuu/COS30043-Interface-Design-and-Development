const app = Vue.createApp({ }) 

app.component('app-mypost',{ 
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
        `<label for="status">Status</label>
        <input v-model="strStatus" id="status">
        <input type="button" value="Post" @click="add(strStatus)">
        <div v-for="(status, index) in statPosts">
            <span>{{status}}</span>
            <input type="button" value="Remove" @click="remove(index)">
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
}); 

app.mount('#app') 