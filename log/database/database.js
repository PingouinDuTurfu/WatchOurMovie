const {mongoose: database} = require('mongoose');

const EMPTY = '';

const URL = process.env.MONGO_URL || EMPTY;
const PORT = process.env.MONGO_PORT || EMPTY;
const DATABASE = process.env.MONGO_DATABASE || EMPTY;

const USER = process.env.MONGO_USER || EMPTY;
const PASSWORD = process.env.MONGO_PASSWORD || EMPTY;


if (!URL || !PORT || !DATABASE || !USER || !PASSWORD) {
    console.error('MongoDB environment variables not set');
    process.exit(1);
}

database.connect(`mongodb://${URL}:${PORT}`, {
    user: USER,
    pass: PASSWORD,
    dbName: DATABASE,
})
    .then(() => console.log('Connected!'))
    .catch(err => console.log(err));

module.exports = database;