<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const groups = ref({});
const isLoading = ref(false);

const fetchData = async () => {
    isLoading.value = true;
    const url = "/api/standings";
    try {
        const response = await axios.get(url);
        groups.value = response.data;
        console.log('Data fetched successfully:', groups.value);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        isLoading.value = false; // End loading
    }
};

onMounted(fetchData);

// Custom directive to highlight team name on hover
const vHighlight = {
    beforeMount(el) {
        el.addEventListener('mouseenter', () => {
            el.style.fontWeight = 'bold';
        });
        el.addEventListener('mouseleave', () => {
            el.style.fontWeight = '';
        });
    }
};
</script>

<template>
    <div>
        <div v-if="isLoading">Loading...</div>
        <div v-else>
            <div v-for="(group, groupName) in groups" :key="groupName" class="card">
                <h2>{{ groupName }}</h2>
                <DataTable :value="group" responsiveLayout="scroll" class="fixed-width-table">
                    <Column field="position" header="#" style="width: 50px;">
                        <template #body="slotProps">
                            <span>{{ slotProps.data.position }}</span>
                        </template>
                    </Column>
                    
                    <Column field="name" header="Team" style="width: 180px;">
                        <template #body="slotProps">
                            <div class="team-info" v-highlight>
                                <img :src="slotProps.data.team.crest" alt="Logo" width="24" />
                                <span class="team-name">{{ slotProps.data.team.name }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="playedGames" header="P" style="width: 50px;">
                        <template #body="slotProps">
                            <span>{{ slotProps.data.playedGames }}</span>
                        </template>
                    </Column>
                    <Column field="won" header="W" style="width: 50px;">
                        <template #body="slotProps">
                            <span>{{ slotProps.data.won }}</span>
                        </template>
                    </Column>
                    <Column field="draw" header="D" style="width: 50px;">
                        <template #body="slotProps">
                            <span>{{ slotProps.data.draw }}</span>
                        </template>
                    </Column>
                    <Column field="lost" header="L" style="width: 50px;">
                        <template #body="slotProps">
                            <span>{{ slotProps.data.lost }}</span>
                        </template>
                    </Column>
                    <Column field="goals" header="Goals" style="width: 60px;">
                        <template #body="slotProps">
                            <span>{{ slotProps.data.goalsFor }}:{{ slotProps.data.goalsAgainst }}</span>
                        </template>
                    </Column>
                    <Column field="points" header="PTS" style="width: 50px;">
                        <template #body="slotProps">
                            <span>{{ slotProps.data.points }}</span>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>     
    </div>
</template>

<style scoped>
.card {
    margin-bottom: 20px;
}

.team-info {
    display: flex;
    align-items: center;
}

.team-info img {
    margin-right: 8px;
}

.team-info .team-name {
    display: inline-block;
    vertical-align: middle;
}
</style>
