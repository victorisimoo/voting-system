const express = require('express');
const axios = require('axios');
const app = express();

const candidatesServiceUrl = 'http://localhost:3000';
const votesServiceUrl = 'http://localhost:3001';

/**
 * @description: GET /stats -
 *  This endpoint retrieves the voting statistics for all candidates in the election, as well as the number of fraud attempts. 
 *  It does this by making asynchronous requests to the candidates service and the votes service, using Axios to handle the HTTP 
 *  requests. Once the data is retrieved, it calculates the number of votes for each candidate by filtering the votes array for 
 *  each candidate ID, and then returning an object with the candidate and vote count. 
 */
app.get('/stats', async (req, res) => {
    try {
        const [candidatesRes, votesRes] = await Promise.all([
            axios.get(`${candidatesServiceUrl}/list`),
            axios.get(`${votesServiceUrl}/list`),
        ]);

        const candidates = candidatesRes.data;
        const votes = votesRes.data.votes;
        const fraudAttempts = votesRes.data.fraudAttempts;
        
        const voteCount = candidates.map(candidate => {
            const candidateVotes = votes.filter(vote => vote.candidateId === candidate.Id).length;
            return {
                candidate,
                votes: candidateVotes
            };
        });
        res.status(200).send({
            voteCount,
            fraudAttempts
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('[SERVER]: ¡Error al obtener estadísticas!');
    }
});

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`[SERVER]: Servicio de estadísticas corriendo en el puerto: ${port}`));
