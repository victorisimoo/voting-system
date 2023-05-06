const express = require('express');
const app = express();
app.use(express.json());

let candidates = [];
let state = "createCandidates";

app.post('/create', (req, res) => {
    if (state !== "createCandidates") {
        return res.status(400).send('No se puede crear candidato en esta fase');
    }
    const candidate = req.body;
    candidates.push(candidate);
    res.status(201).send(candidate);
});

app.get('/list', (req, res) => {
    res.status(200).send(candidates);
});

// Control de estado para este microservicio
app.post('/admin/openCreate', (req, res) => {
    state = "createCandidates";
    res.status(200).send('Fase de creación de candidatos abierta');
});

app.post('/admin/closeCreate', (req, res) => {
    state = "closed";
    res.status(200).send('Fase de creación de candidatos cerrada');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servicio de Candidatos corriendo en el puerto ${port}`));
