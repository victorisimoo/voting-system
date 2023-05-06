const express = require('express');
const app = express();
app.use(express.json());

let votes = [];
let fraudAttempts = 0;
let state = "vote";

/**
 * @description: POST /cast -
 *  This endpoint records a vote for a specific candidate from a specific voter, along with the voter's IP address
 *  and the date of the vote. It ensures that the state of the voting phase is "vote" before accepting the vote, 
 *  and also checks for any existing votes from the same voter. If a vote has already been cast by the same voter, 
 *  it increments the fraudAttempts counter and returns an error message. If the vote is successfully cast, it is 
 *  added to the votes array and the endpoint returns the vote object.
 * 
 * @auth: victorisimoo
 */
app.post('/cast', (req, res) => {
    if (state !== "vote") {
        return res.status(400).send('[SERVER]: ¡No se puede votar en esta fase!');
    }
    const { voterId, candidateId, ipAddress } = req.body;
    const existingVote = votes.find(vote => vote.voterId === voterId);
    if (existingVote) {
        fraudAttempts++;
        return res.status(400).send('[SERVER]: ¡Ya has votado, no puedes votar de nuevo!');
    }
    const vote = {
        voterId,
        candidateId,
        ipAddress,
        date: new Date(),
    };
    votes.push(vote);
    res.status(201).send(vote);
});

/**
 * @description: POST /admin/open - This endpoint opens the voting phase by changing the state variable to 
 * "vote". This endpoint can only be accessed by an admin user.
 * 
 * @auth: victorisimoo
 */
app.post('/admin/open', (req, res) => {
    state = "vote";
    res.status(200).send('[SERVER]: ¡Fase de votación abierta!');
});

/**
 * @description: POST /admin/close - 
 * POST /admin/close - This endpoint closes the voting phase by changing the state variable to "closed". 
 * This endpoint can only be accessed by an admin user.
 */
app.post('/admin/close', (req, res) => {
    state = "closed";
    res.status(200).send('SERVER]: ¡Fase de votación cerrada!');
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`[SERVER]: servicio de votos corriendo en el puerto: ${port}`));
