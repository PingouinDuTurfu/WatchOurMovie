const express = require('express');
const {initialize} = require('./database/initialize');

const profilRoutes = require('./routes/profilRoute');
const languageRoutes = require('./routes/languageRoute');
const genreRoutes = require('./routes/genreRoute');
const groupRoutes = require('./routes/groupRoute');
const movieRoutes = require('./routes/movieRoute');

const app = express();

const PORT = process.env.DB_MANAGER_PORT || 3001;

initialize();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(express.json());

app.use('/profil', profilRoutes);
app.use('/language', languageRoutes);
app.use('/genre', genreRoutes);
app.use('/group', groupRoutes);
app.use('/movie', movieRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});