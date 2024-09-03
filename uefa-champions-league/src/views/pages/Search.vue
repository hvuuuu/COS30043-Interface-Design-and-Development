<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { debounce } from 'lodash';

const goalsFilter = ref([]);
const countryFilter = ref([]);
const matches = ref([]);
const currentPage = ref(1);
const itemsPerPage = 16;
const isLoading = ref(false);
const searchQuery = ref('');

const goalsOptions = [
    { name: '0 Goals', value: '0' },
    { name: '1 Goal', value: '1' },
    { name: '2-3 Goals', value: '2-3' },
    { name: '4-5 Goals', value: '4-5' },
    { name: '6+ Goals', value: '6+' }
];
const countryOptions = [
    { name: 'England', value: 'England' },
    { name: 'Spain', value: 'Spain' },
    { name: 'Italy', value: 'Italy' },
    { name: 'Germany', value: 'Germany' },
    { name: 'France', value: 'France' }
];


// Debounce the fetchMatchesByFilters function
const debouncedFetchMatches = debounce(async () => {
    isLoading.value = true;
    let url = "/api/matchesByFilters";
    const params = new URLSearchParams();
    // Always append filters, even if they are empty, to ensure a well-formed request
    params.append('goals', goalsFilter.value.map(goal => goal.value).join(',') || '');
    params.append('country', countryFilter.value.map(country => country.value).join(',') || '');
    params.append('searchQuery', searchQuery.value.toLowerCase() || '');
    url += `?${params.toString()}`;
    console.log('Fetching matches with filters:', url);
    try {
        const response = await axios.get(url);
        matches.value = response.data || [];
        console.log('Matches fetched successfully with filters:', matches.value);
    } catch (error) {
        console.error('Error fetching matches:', error);
        // Handle error appropriately
    } finally {
        isLoading.value = false;
    }
}, 2500);

watch([goalsFilter, countryFilter, searchQuery], debouncedFetchMatches, { deep: true });

const paginatedMatches = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return matches.value.slice(start, end);
});

const onPageChange = (event) => {
    currentPage.value = event.page + 1; // Adjust for 0-indexed page
};

onMounted(debouncedFetchMatches);
</script>

<template>
    <div class="matches-container">
        <div class="group-filter">
                <MultiSelect v-model="countryFilter" :options="countryOptions" optionLabel="name" placeholder="Select by Country" display="chip" />
                <MultiSelect v-model="goalsFilter" :options="goalsOptions" optionLabel="name" placeholder="Select by Goal" display="chip" />
            <div class="search-box">
                <IconField>
                    <InputIcon class="pi pi-search" />
                    <InputText v-model="searchQuery" placeholder="Search Team" />
                </IconField>
            </div>
        </div> 
        <div v-if="isLoading">Loading...</div>
        <div v-else>
            <div v-if="matches.length === 0">No result found</div>
            <div v-else v-for="match in paginatedMatches" :key="match.id" class="match">
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
    text-decoration: none; 
    color: inherit; 
    display: block; 
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
.group-filter {
    margin-bottom: 3%;
    display: flex;
    align-items: center;
    gap: 10px;
}

.search-box {
    display: flex;
    align-items: center;
    gap: 10px;
}

@media (max-width: 600px) {
    .team {
        justify-content: center;
        margin-bottom: 10px;
    }
    .score {
        margin-bottom: 10px;
        font-size: 16px;
    }
    .group-filter {
        display: block;
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
</style>