<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const matches = ref([]);
const currentPage = ref(1);
const itemsPerPage = 16;
const isLoading = ref(false);

const fetchMatches = async () => {
    isLoading.value = true;
    const url = "/api/matches"; // Adjust the URL as needed
    try {
        const response = await axios.get(url);
        matches.value = response.data; // Assuming the data structure based on your description
        console.log('Matches fetched successfully:', matches.value);
    } catch (error) {
        console.error('Error fetching matches:', error.response.data);
    } finally {
        isLoading.value = false; // End loading
    }
};

const paginatedMatches = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return matches.value.slice(start, end);
});

const onPageChange = (event) => {
  currentPage.value = event.page + 1; // PrimeVue Paginator page is 0-indexed
};
onMounted(fetchMatches);
</script>

<template>
    <div class="matches-container">
        <div v-if="isLoading">Loading...</div>
        <div v-else>
            <h2>UEFA Champions League Matches (2023-2024)</h2>
            <div v-for="match in paginatedMatches" :key="match.id" class="match">
                <a :href="`match-details-${match.id}`" class="match-link">
                    <div class="match-header">
                        <span>{{ match.stage }}</span>
                        <span>{{ new Date(match.utcDate).toLocaleDateString() }} - {{ new Date(match.utcDate).toLocaleTimeString() }}</span>
                    </div>
                    <div class="match-details row">
                        <div class="team col-12 col-md-5">
                            <img :src="match.homeTeam.crest" alt="Home Team Logo" class="team-logo" />
                            <span>{{ match.homeTeam.name }}</span>
                        </div>
                        <div class="score col-12 col-md-2">{{ match.score.fullTime.home }} - {{ match.score.fullTime.away }}</div>
                        <div class="team col-12 col-md-5">
                            <img :src="match.awayTeam.crest" alt="Away Team Logo" class="team-logo" />
                            <span>{{ match.awayTeam.name }}</span>
                        </div>
                    </div>
                </a>
            </div>
            <Paginator :totalRecords="matches.length" :rows="itemsPerPage" :pageLinkSize="3" @page="onPageChange" />
        </div>
    </div>
</template>

<style scoped>
.match-link {
    text-decoration: none; /* Removes underline from links */
    color: inherit; /* Keeps text color consistent */
    display: block; /* Ensures the link covers the entire match section */
}
.match {
    border: 1px solid #ccc;
    margin-bottom: 20px;
    border-radius: 8px;
    overflow: hidden;
}
.match-header {
    background-color: #f4f4f4;
    padding: 10px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
}
.match-details {
    padding: 20px;
}
.team {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
.team-logo {
    width: 24px;
    margin-right: 10px;
}
.score {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
}
@media screen and (max-width: 600px) {
    .team {
        justify-content: center;
        margin-bottom: 10px;
    }
    .score {
        margin-bottom: 10px;
        font-size: 16px;
    }
    .matches-container .col-12 {
        padding-left: 0;
    }
    .col-md-5 {
        padding-left: 0%;
    }
}
.pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
.pagination button {
    margin: 0 10px;
}
.row {
    display: flex;
    flex-wrap: wrap;
}
.col-12 {
    flex: 0 0 100%;
    max-width: 100%;
    padding-right: 15px;
    padding-left: 15px;
}
.col-md-5 {
    flex: 0 0 41.6667%;
    max-width: 41.6667%;
    padding-left: 17%;
}
.col-md-2 {
    flex: 0 0 16.6667%;
    max-width: 16.6667%;
}
</style>