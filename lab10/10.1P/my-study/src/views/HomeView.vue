<template>
    <h2>Welcome {{fname}} {{lname}}!</h2>
    <p>What is your name ?</p>
	<label for="fname">First Name: </label>
    <input type="text" v-model="fname">
    <br>
	<label for="lname">Last Name: </label>
	<input type="text" v-model="lname">
    <br><br>
    <input type="radio" id="ocean" value="ocean" name="choice" v-model="choice">
    <label for="ocean">Ocean</label>
    <input type="radio" id="mountain" value="mountain" name="choice" v-model="choice">
    <label for="mountain">Mountain</label>
    <div v-if="choice === 'ocean'">
        <img src="https://storage.needpix.com/rsynced_images/sea-1547609_1280.jpg">
    </div>
    <div v-else-if="choice === 'mountain'">
        <img src="https://cdn.britannica.com/88/158788-050-314EBC88/Mount-Triumph-height-North-Cascades-National-Park.jpg">
    </div>
</template>

<script>
export default {
    data() {
        return {
        fname: '',
        lname: '',
        choice: ''
        }
    }
}
</script>
