import axios from 'axios';

const FootballApi = axios.create({
  baseURL: '/api', // Use the proxy
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  async getStanding() {
    const response = await FootballApi.get('/competitions/2001/standings');
    return response.data.standings;
  }
};