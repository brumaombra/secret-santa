import express from "express";

const app = express();
const port = 3000;
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Benvenuto nel mio server Express!');
});

app.get('/api/saluto', (req, res) => {
    res.json({ messaggio: 'Ciao Mondo!' });
});

app.post('/api/saluto', (req, res) => {
    const { nome } = req.body;
    res.json({ messaggio: `Ciao ${nome}!` });
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});