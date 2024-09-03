// create new app instance 
const app = Vue.createApp({}) 
// creating component for the lookup table 
app.component('app-request', { 
    data: function() { 
        return {items: []}
    },
    //defining template for the app 
    template:   
        `
            <div v-for="item in items">
                <span>{{item.id}}<span>
                <span>--</span>
                <span>{{item.title}}</span>
            </div>
        `,
    mounted() {
        var self = this;
        $.getJSON('https://jsonplaceholder.typicode.com/posts', function(data) {
            self.items = data;
            })
        .fail(function() {
            alert('An error has occurred');
        })
    }
});
    
app.mount('#app')