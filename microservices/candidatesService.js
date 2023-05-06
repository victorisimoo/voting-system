const express = require('express');
const app = express();
app.use(express.json());

let candidates = [];
let state = "createCandidates";

/**
 * @description: POST /create - 
 *   This endpoint creates a new candidate and adds them to the candidates array. 
 *   It expects the candidate data to be sent in the request body in JSON format
 * 
 * @auth: victorisimoo
 */
app.post('/create', (req, res) => {
    if (state !== "createCandidates") {
        return res.status(400).send('[SERVER]: no se puede crear candidato en esta fase.');
    }
    const candidate = req.body;
    candidates.push(candidate);
    res.status(201).send(candidate);
});

/**
 * @description: GET /list -
 *  This endpoint retrieves a list of all candidates that have been created and added
 *  to the candidates array.
 * 
 * @auth: victorisimoo
 */
app.get('/list', (req, res) => {
    res.status(200).send(candidates);
});

/**
 * @description: POST /admin/openCreate -
 * This endpoint opens the phase of creating candidates by changing the state variable 
 * to "createCandidates". This endpoint can only be accessed by an admin user.
 * 
 * @auth: victorisimoo
 */
app.post('/admin/openCreate', (req, res) => {
    state = "createCandidates";
    res.status(200).send('[SERVER]: ¡Fase de creación de candidatos abierta!');
});

/**
 * @description: POST /admin/closeCreate -
 * This endpoint closes the phase of creating candidates by changing the state variable to
 * "closed". This endpoint can only be accessed by an admin user.
 * 
 * @auth: victorisimoo
 */
app.post('/admin/closeCreate', (req, res) => {
    state = "closed";
    res.status(200).send('[SERVER]: ¡Fase de creación de candidatos cerrada!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`[SERVER]: servicio de candidatos corriendo en el puerto: ${port}`));
