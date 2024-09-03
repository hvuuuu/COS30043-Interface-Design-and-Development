const app = Vue.createApp({
    data() {
        return {
            number: '',
            num_target: Math.floor(Math.random() * 100) + 1,
            message: ''
        }
    },
    methods: {
        checkGuess() {
            if (this.number < 1 || this.number > 100 || this.number === '') {
                this.message = 'Invalid guess';
            } else if (this.number < this.num_target) {
                this.message = 'Guess higher';
            } else if (this.number > this.num_target) {
                this.message = 'Guess lower';
            } else if (this.number == this.num_target) {
                this.message = 'Correct guess!';
                
            }
        },
        giveUp() {
            this.message = 'The correct number was ' + this.num_target;
            
        },
        startOver() {
            this.number = '';
            this.num_target = Math.floor(Math.random() * 100) + 1;
            this.message = '';
        }
    }
});

app.mount('#app')