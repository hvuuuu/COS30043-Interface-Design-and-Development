<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute , useRouter} from 'vue-router';

const route = useRoute();
const router = useRouter();
const matchDetails = ref(null);
const isLoading = ref(false);
const isLoadingThoughts = ref(false);
const selectedThoughtId = ref(null);
const userThought = ref('');
const thought = ref('');
const thoughts = ref([]);
const matchId = ref(null);
const currentUserEmail = ref(null);

const toggleEditMode = (thought) => {
    if (thought.isEditMode) {
        updateThought(thought);
    } else {
        thought.isEditMode = true;
        selectedThoughtId.value = thought.id;
        userThought.value = thought.message;
    }
};

const checkUserLogin = async () => {
    try {
        const response = await axios.get('/api/check-login');
        currentUserEmail.value = response.data.user.email; // Set currentUserEmail
        console.log('User logged in:', currentUserEmail.value);
        fetchMatch();
        fetchThoughts();
    } catch (error) {
        console.error('User not logged in:', error);
        alert('Please log in to view match details.');
        // Redirect to error page if user is not logged in
        // router.push('/auth/error');
    }
};

const fetchMatch = async () => {
    isLoading.value = true;
    matchId.value = route.path.split('-').pop();
    const url = `/api/matches/${matchId.value}`; // Adjust the URL as needed
    try {
        const response = await axios.get(url);
        matchDetails.value = response.data; 
        console.log('Matches fetched successfully:', matchDetails);
    } catch (error) {
        console.error('Error fetching match:', error);
    } finally {
        isLoading.value = false; // End loading
    }
};

const fetchThoughtEmail = async (thought) => {
    try {
        const response = await axios.get(`/api/matches/${matchId.value}/thoughts/${thought.id}/email`);
        thought.email = response.data.email;
        console.log('Thought email fetched successfully:', thought.email);
    } catch (error) {
        console.error('Error fetching thought email:', error.response ? error.response.data : error.message);
    }
};

const fetchThoughts = async () => {
    isLoadingThoughts.value = true;
    try {
        const response = await axios.get(`/api/matches/${matchId.value}/thoughts`);
        thoughts.value = response.data;
        // Fetch email for each thought
        for (const thought of thoughts.value) {
            await fetchThoughtEmail(thought);
        }
    } catch (error) {
        console.error('Error fetching thoughts:', error);
    } finally {
        isLoadingThoughts.value = false; // End loading
    }
};

const saveThought = async () => {
    try {
        const response = await axios.post(`/api/matches/${matchId.value}/thoughts`, {
            message: thought.value,
        });
        thoughts.value.push(response.data);
        thought.value = '';
    } catch (error) {
        console.error('Error saving thought:', error);
    }
};

const updateThought = async (thought) => {
    try {
        const response = await axios.put(`/api/matches/${matchId.value}/thoughts/${thought.id}`, {
            message: thought.message,
        });
        const index = thoughts.value.findIndex(t => t.id === thought.id);
        thoughts.value[index] = response.data;
        thought.isEditMode = false;
        selectedThoughtId.value = null;
    } catch (error) {
        console.error('Error updating thought:', error);
    }
};

const deleteThought = async (thoughtId) => {
    try {
        await axios.delete(`/api/matches/${matchId.value}/thoughts/${thoughtId}`);
        thoughts.value = thoughts.value.filter(thought => thought.id !== thoughtId);
    } catch (error) {
        console.error('Error deleting thought:', error);
    }
};

const likeThought = async (thoughtId) => {
    try {
        const response = await axios.post(`/api/matches/${matchId.value}/thoughts/${thoughtId}/like`);
        const index = thoughts.value.findIndex(thought => thought.id === thoughtId);
        thoughts.value[index] = response.data;
    } catch (error) {
        console.error('Error liking thought:', error);
    }
};

const dislikeThought = async (thoughtId) => {
    try {
        const response = await axios.post(`/api/matches/${matchId.value}/thoughts/${thoughtId}/dislike`);
        const index = thoughts.value.findIndex(thought => thought.id === thoughtId);
        thoughts.value[index] = response.data;
    } catch (error) {
        console.error('Error disliking thought:', error);
    }
};

const isOwner = (thoughtEmail) => {
    return currentUserEmail.value === thoughtEmail;
};

onMounted(() => {
    checkUserLogin(); // Check login before fetching match details
});
</script>

<template>
    <div class="match-container">
        <div v-if="isLoading">Loading...</div>
        <div v-else-if="matchDetails">
            <div class="match">
                <div class="match-details">
                    <div class="team">
                        <img :src="matchDetails.homeTeam.crest" alt="Home Team Logo" class="team-logo" />
                        <span>{{ matchDetails.homeTeam.name }}</span>
                    </div>
                    <div class="score">{{ matchDetails.score.fullTime.home }} - {{ matchDetails.score.fullTime.away }}</div>
                    <div class="team">
                        <img :src="matchDetails.awayTeam.crest" alt="Away Team Logo" class="team-logo" />
                        <span>{{ matchDetails.awayTeam.name }}</span>
                    </div>
                </div>
            </div>
            <div class="statistic-detail">
                <div class="statistic flex">
                    <i class="pi pi-calendar"></i>
                    <div>
                        <span>Datetime: </span>
                        <span>{{ new Date(matchDetails.utcDate).toLocaleDateString() }} • {{ new Date(matchDetails.utcDate).toLocaleTimeString() }}</span>
                    </div>
                </div>
                <div class="statistic">
                    <i class="pi pi-flag"></i>
                    <div>
                        <span>Competition: </span>
                        <span v-if="matchDetails.matchday == null && matchDetails.group == null">
                            <span>Football,Europe,UEFA Champions League,{{matchDetails.stage }}</span>
                        </span>
                        <span v-else>
                            <span>Football,Europe,UEFA Champions League,Round {{matchDetails.matchday}},{{matchDetails.group}}, {{matchDetails.stage }} </span>
                        </span>
                    </div>
                </div>
                <div class="statistic">
                    <i class="pi pi-map-marker"></i>
                    <div>
                        <span>Stadium: </span>
                        <span>{{ matchDetails.venue }}</span>
                    </div>
                </div>
                <div class="statistic">
                    <i class="pi pi-users"></i>
                    <div>
                        <span>Referee: </span>
                        <span>{{matchDetails.referees[0].name}}</span>
                    </div>
                </div>
            </div>
            <div class="message-box mt-5">
                <FloatLabel>
                    <Textarea v-model="thought" autoResize rows="7" cols="50"></Textarea>
                    <label>Share your thoughts about this match !</label>
                </FloatLabel>
                <Button class="mt-3" label="Save" icon="pi pi-check" iconPos="right" @click="saveThought"></Button>
            </div>
            <div v-if="isLoadingThoughts">Loading thoughts...</div>
            <div v-else-if="thoughts.length > 0">
                <div class="thoughts">
                    <div v-for="thought in thoughts" :key="thought.id" class="thought">
                        <div class="thought-details mt-5">
                            <div class="user flex">
                                <i class="pi pi-user mr-2"></i>
                                <span>{{ thought.email }}</span>
                                <div class="react flex ml-4">
                                    <i class="pi pi-thumbs-up mr-3" @click="likeThought(thought.id)"></i>
                                    <span class="mr-3">{{ thought.likes }}</span>
                                    <i class="pi pi-thumbs-down mr-3" @click="dislikeThought(thought.id)"></i>
                                    <span>{{ thought.dislikes }}</span>
                                </div>
                            </div>
                            <div class="content-actions mt-3">
                                <FloatLabel class="fullwidth">
                                    <InputText
                                        v-model="thought.message"
                                        :disabled="!thought.isEditMode"
                                        class="thought-content"
                                    />
                                </FloatLabel>
                                
                                <div class="action-buttons ml-3" v-if="isOwner(thought.email)">
                                    <i class="pi pi-pencil"  @click="toggleEditMode(thought)"></i>
                                    <i class="pi pi-trash" @click="deleteThought(thought.id)"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<style scoped>
.match {
    margin-bottom: 20px;
    border-radius: 8px;
    overflow: hidden;
}

.match-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
}

.team {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
    margin-left: 17.5%;
    font-size: 24px;
}

.team-logo {
    width: 36px;
    margin-right: 10px;
}

.team-name {
    flex: 1;
    text-align: left;
}

.score {
    font-size: 48px;
    font-weight: bold;
    min-width: 100px;
    text-align: center;
    flex: 0 0 auto;
}

.statistic-detail {
    border: 1px solid #ccc;
    padding: 3%;
    border-radius: 8px;
    font-size: 16px;
}

.statistic {
    display: flex;
    gap: 20px;
    margin-bottom: 2%;
}

i {
    font-size: 20px;
}

.thought-details {
    display: flex;
    flex-direction: column;
    background-color: #f4f4f4;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem;
}

.user {
    align-items: center;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.content-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.thought-content {
  flex-grow: 1;
  font-size: 1.1rem;
}

.fullwidth {
    width: 100%;
}

.fullwidth input {
    width: 100%;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  cursor: pointer;
}

.action-buttons i:hover {
  color: #333;
}

@media (max-width: 600px) {
    .team {
        margin: 0;
        font-size: 16px;
    }
    .score {
        font-size: 16px;
    }

}
</style>