<template>
  <div>
    <div v-for="group in standings" :key="group.group" class="p-5 border rounded m-5">
      <h2 class="text-start">{{ group.group }}</h2>
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th class="w-25 text-start">Team</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>Goals</th>
            <th>PTS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="team in group.table" :key="team.team.id">
            <td>{{ team.position }}</td>
            <td class="d-flex">
              <img :src="team.team.crest" style="width: 30px;"/>
              <span class="ms-4">{{ team.team.name }}</span>
            </td>
            <td>{{ team.playedGames }}</td>
            <td>{{ team.won }}</td>
            <td>{{ team.draw }}</td>
            <td>{{ team.lost }}</td>
            <td>{{ team.goalsFor }}:{{ team.goalsAgainst }}</td>
            <td>{{ team.points }}</td>
          </tr>
        </tbody>
    </table>
    </div>
  </div>
</template>

<script>
import FootballAPI from '../api/api';

export default {
  name: 'HelloWorld',
  data () {
    return {
      standings: []
    }
  },
  created() {
    this.fetchStandings();
  },
  methods: {
    async fetchStandings() {
      try {
        const standingsData = await FootballAPI.getStanding();
        // Assuming the standings data is in the first element of the array
        this.standings = standingsData;
      } catch (error) {
        console.error('Error fetching standings:', error);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>