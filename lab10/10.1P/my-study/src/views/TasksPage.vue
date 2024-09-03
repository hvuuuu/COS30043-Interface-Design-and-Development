<template>
    <div class="task">
        <label for="status">Tasks: </label>
        <input v-model="strStatus" id="status">
        <input type="button" value="Post" @click="add">
        <div v-for="(status, index) in statPosts" :key="index">
            <span>{{status}}</span>
            <input type="button" value="Remove" @click="remove(index)">
        </div>
    </div>
</template>

<script>
export default {
    data() { 
        return { 
            statPosts: [], 
            strStatus: ''
        } 
    },
    methods: { 
        add() { 
            // Add status to statPosts
            this.statPosts.unshift(this.strStatus);
            this.strStatus = ''; // Clear the input field after posting
        }, 
        remove(index) { 
            // Delete status from statPosts using index 
            this.statPosts.splice(index, 1);
        } 
    }
}
</script>
<style>
    .task {
        margin-top: 1%;
    }
</style>