const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 8000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Configure session middleware
app.use(session({
    secret: '104177995@student.swin.edu.au', // Use a secure, unique secret key
    resave: false, // Do not save session if unmodified
    saveUninitialized: true, // Save uninitialized sessions
    cookie: { secure: false } // Set to true if using https
}));

app.get('/', (req, res) => {
    
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    if (req.session.user) {
        res.status(400).send("User already logged in.");
    } else {
        const { email, password } = req.body;

        const dataFilePath = path.join(__dirname, '../../public/demo/data/data.json');

        try {
            const data = await fs.promises.readFile(dataFilePath);
            const users = JSON.parse(data.toString());
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                req.session.user = { email }; // Store user email in session
                res.send("Login successful!");
            } else {
                res.status(401).send("Invalid email or password.");
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("An error occurred on the server.");
        }
    }
});

// Middleware to check if a user is logged in
const checkLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next(); 
    } else {
        res.status(401).send("You must be logged in to view this content.");
    }
};

// Endpoint to check login status
app.get('/api/check-login', checkLoggedIn, async (req, res) => {
    res.json({
        message: "This is protected content only visible to logged-in users.",
        user: req.session.user
    });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    if (req.session.user) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).send("Could not log out.");
            }
            res.send("Logout successful!");
        });
    } else {
        res.status(400).send("No user logged in.");
    }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    const newUser = { email, password };

    const dataFilePath = path.join(__dirname, '../../public/demo/data/data.json');

    try {
        const data = await fs.promises.readFile(dataFilePath);
        let users;
        try {
            users = JSON.parse(data.toString());
        } catch (parseError) {
            console.error(parseError);
            users = [];
        }

        if (users.some(user => user.email === email)) {
            return res.status(400).send("Email already exists.");
        }

        users.push(newUser);
        
        await fs.promises.writeFile(dataFilePath, JSON.stringify(users, null, 2));
        res.send("Registration successful!");
    } catch (err) {
        console.error(err);
        return res.status(500).send("An error occurred on the server.");
    }
});

// Endpoint to get standings
app.get('/api/standings', async (req, res) => {
    const url = 'https://api.football-data.org/v4/competitions/2001/standings';
    const config = {
        headers: { 'X-Auth-Token': 'bfa7e348a9364ba8a1a7e33b1413f66b' }
    };

    try {
        const response = await axios.get(url, config);
        const groups = response.data.standings.reduce((acc, standing) => {
            const groupName = standing.group;
            if (!acc[groupName]) {
                acc[groupName] = [];
            }
            acc[groupName].push(...standing.table);
            return acc;
        }, {});
        res.setHeader('Content-Type', 'application/json');
        res.json(groups);
    } catch (error) {
        console.error('Error fetching standings:', error);
        res.status(500).send("An error occurred while fetching the standings.");
    }
});

// Endpoint to get matches
app.get('/api/matches', async (req, res) => {
    const url = 'https://api.football-data.org/v4/competitions/2001/matches?season=2023';
    const config = {
        headers: { 'X-Auth-Token': 'bfa7e348a9364ba8a1a7e33b1413f66b' }
    };

    try {
        const response = await axios.get(url, config);
        res.setHeader('Content-Type', 'application/json');
        res.json(response.data.matches);
    } catch (error) {
        console.error('Error fetching matches:', error.response.data);
        res.status(500).send("An error occurred while fetching the matches.");
    }
});

// Endpoint to get match by ID
app.get('/api/matches/:matchId', async (req, res) => {
    const matchId = req.params.matchId;
    const url = `https://api.football-data.org/v4/matches/${matchId}`;
    const config = {
        headers: { 'X-Auth-Token': 'bfa7e348a9364ba8a1a7e33b1413f66b' }
    };

    try {
        const response = await axios.get(url, config);
        res.setHeader('Content-Type', 'application/json');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).send("An error occurred while fetching the matches.");
    }
});

// Endpoint to get matches by filters
app.get('/api/matchesByFilters', async (req, res) => {
    const { country, goals, searchQuery } = req.query;

    const countries = country ? country.split(',').map(c => c.trim().toLowerCase()) : [];
    const goalsFilter = goals ? goals.split(',').map(g => g.trim()) : [];
    const searchQueryLower = searchQuery ? searchQuery.toLowerCase() : '';

    const teamsUrl = 'https://api.football-data.org/v4/competitions/2001/teams?season=2023';
    const matchesUrl = 'https://api.football-data.org/v4/competitions/2001/matches?season=2023';

    const config = {
        headers: { 'X-Auth-Token': 'bfa7e348a9364ba8a1a7e33b1413f66b' }
    };

    try {
        const [teamsResponse, matchesResponse] = await Promise.all([
            axios.get(teamsUrl, config),
            axios.get(matchesUrl, config)
        ]);

        const teamCountryMap = new Map(teamsResponse.data.teams.map(team => [team.id, team.area.name.toLowerCase()]));

        // If no filters are applied, return all matches
        if (countries.length === 0 && goalsFilter.length === 0 && searchQueryLower === '') {
            res.json(matchesResponse.data.matches);
            return;
        }
        
        let filteredMatches = matchesResponse.data.matches.filter(match => {
            const homeTeamName = match.homeTeam.name.toLowerCase();
            const awayTeamName = match.awayTeam.name.toLowerCase();
            const homeTeamCountry = teamCountryMap.get(match.homeTeam.id);
            const awayTeamCountry = teamCountryMap.get(match.awayTeam.id);
            const matchGoals = (match.score.fullTime.home ?? 0) + (match.score.fullTime.away ?? 0);

            const countryMatch = countries.length === 0 || countries.includes(homeTeamCountry) || countries.includes(awayTeamCountry);
            // Check if the match satisfies the goals filter
            const goalsMatch = goalsFilter.length === 0 || goalsFilter.some(goalFilter => {
                if (goalFilter.includes('+')) {
                    const minGoals = parseInt(goalFilter.replace('+', ''));
                    return matchGoals >= minGoals;
                } else if (goalFilter.includes('-')) {
                    const [minGoals, maxGoals] = goalFilter.split('-').map(Number);
                    return matchGoals >= minGoals && matchGoals <= maxGoals;
                } else {
                    return matchGoals === parseInt(goalFilter);
                }
            });
            const searchMatch = searchQueryLower === '' || homeTeamName.includes(searchQueryLower) || awayTeamName.includes(searchQueryLower);

            return countryMatch && goalsMatch && searchMatch;
        });
        res.setHeader('Content-Type', 'application/json');
        res.json(filteredMatches);
    } catch (error) {
        console.error('Error fetching matches by filters:', error);
        if (error.response) {
            res.status(error.response.status).send(`Error from football API: ${error.response.data.message}`);
        } else if (error.request) {
            res.status(500).send("No response received from football API.");
        } else {
            res.status(500).send("An error occurred while processing your request.");
        }
    }
});

// POST a new thought
app.post('/api/matches/:matchId/thoughts', checkLoggedIn, async (req, res) => {
    const { matchId } = req.params;
    const { message } = req.body;
    const email = req.session.user.email;

    const dataFilePath = path.join(__dirname, '../../public/demo/data/thoughts.json');

    try {
        const data = await fs.promises.readFile(dataFilePath);
        const thoughts = JSON.parse(data.toString());

        const newThought = { id: Date.now().toString(), matchId, email, message, likes: 0, dislikes: 0 };
        thoughts.push(newThought);

        await fs.promises.writeFile(dataFilePath, JSON.stringify(thoughts, null, 2));
        res.status(201).send(newThought);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred on the server.");
    }
});

// GET thoughts for a match
app.get('/api/matches/:matchId/thoughts', async (req, res) => {
    const { matchId } = req.params;

    const dataFilePath = path.join(__dirname, '../../public/demo/data/thoughts.json');

    try {
        const data = await fs.promises.readFile(dataFilePath);
        const thoughts = JSON.parse(data.toString());

        const matchThoughts = thoughts.filter(thought => thought.matchId === matchId);
        res.setHeader('Content-Type', 'application/json');
        res.send(matchThoughts);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred on the server.");
    }
});

// PUT (update) a thought
app.put('/api/matches/:matchId/thoughts/:thoughtId', checkLoggedIn, async (req, res) => {
    const { matchId, thoughtId } = req.params;
    const { message } = req.body;
    const email = req.session.user.email;

    const dataFilePath = path.join(__dirname, '../../public/demo/data/thoughts.json');

    try {
        const data = await fs.promises.readFile(dataFilePath);
        const thoughts = JSON.parse(data.toString());

        const thoughtIndex = thoughts.findIndex(thought => thought.id === thoughtId && thought.matchId === matchId && thought.email === email);
        if (thoughtIndex !== -1) {
            thoughts[thoughtIndex].message = message;
            await fs.promises.writeFile(dataFilePath, JSON.stringify(thoughts, null, 2));
            res.send(thoughts[thoughtIndex]);
        } else {
            res.status(403).send("You can only edit your own thoughts.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred on the server.");
    }
});

// DELETE a thought
app.delete('/api/matches/:matchId/thoughts/:thoughtId', checkLoggedIn, async (req, res) => {
    const { matchId, thoughtId } = req.params;
    const email = req.session.user.email;

    const dataFilePath = path.join(__dirname, '../../public/demo/data/thoughts.json');

    try {
        const data = await fs.promises.readFile(dataFilePath);
        const thoughts = JSON.parse(data.toString());

        const thoughtIndex = thoughts.findIndex(thought => thought.id === thoughtId && thought.matchId === matchId && thought.email === email);
        if (thoughtIndex !== -1) {
            thoughts.splice(thoughtIndex, 1);
            await fs.promises.writeFile(dataFilePath, JSON.stringify(thoughts, null, 2));
            res.status(204).send();
        } else {
            res.status(403).send("You can only delete your own thoughts.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred on the server.");
    }
});

// POST a like for a thought
app.post('/api/matches/:matchId/thoughts/:thoughtId/like', checkLoggedIn, async (req, res) => {
    const { matchId, thoughtId } = req.params;

    const dataFilePath = path.join(__dirname, '../../public/demo/data/thoughts.json');

    try {
        const data = await fs.promises.readFile(dataFilePath);
        const thoughts = JSON.parse(data.toString());
        
        const thoughtIndex = thoughts.findIndex(thought => thought.id === thoughtId && thought.matchId === matchId);
        if (thoughtIndex !== -1) {
            thoughts[thoughtIndex].likes += 1;
            await fs.promises.writeFile(dataFilePath, JSON.stringify(thoughts, null, 2));
            res.send(thoughts[thoughtIndex]);
        } else {
            res.status(404).send("Thought not found.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred on the server.");
    }
});

// POST a dislike for a thought
app.post('/api/matches/:matchId/thoughts/:thoughtId/dislike', checkLoggedIn, async (req, res) => {
    const { matchId, thoughtId } = req.params;

    const dataFilePath = path.join(__dirname, '../../public/demo/data/thoughts.json');

    try {
        const data = await fs.promises.readFile(dataFilePath);
        const thoughts = JSON.parse(data.toString());

        const thoughtIndex = thoughts.findIndex(thought => thought.id === thoughtId && thought.matchId === matchId);
        if (thoughtIndex !== -1) {
            thoughts[thoughtIndex].dislikes += 1;
            res.setHeader('Content-Type', 'application/json');
            await fs.promises.writeFile(dataFilePath, JSON.stringify(thoughts, null, 2));
            res.send(thoughts[thoughtIndex]);
        } else {
            res.status(404).send("Thought not found.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred on the server.");
    }
});

// GET the email of a user by thoughtId
app.get('/api/matches/:matchId/thoughts/:thoughtId/email', async (req, res) => {
    const { matchId, thoughtId } = req.params;
    const dataFilePath = path.join(__dirname, '../../public/demo/data/thoughts.json');

    try {
        const data = await fs.promises.readFile(dataFilePath);
        const thoughts = JSON.parse(data.toString());
        
        const thoughtIndex = thoughts.findIndex(thought => thought.id === thoughtId && thought.matchId === matchId);
        if (thoughtIndex !== -1 && thoughts[thoughtIndex].email) {
            res.setHeader('Content-Type', 'application/json');
            res.send({ email: thoughts[thoughtIndex].email });
        } else {
            console.error(`Thought not found or email not available. ThoughtId: ${thoughtId}, MatchId: ${matchId}`);
            res.status(404).send("Thought not found or email not available.");
        }
    } catch (err) {
        console.error(`An error occurred on the server. Error: ${err.message}`);
        res.status(500).send("An error occurred on the server.");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
