const express = require('express');
const {initialize} = require('./database/initialize');

const movieRoutes = require('./routes/movieRoute');

const app = express();

const PORT = process.env.PORT || 3000;

initialize();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(express.json());

app.use('/movie', movieRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});