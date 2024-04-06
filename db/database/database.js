const {mongoose: database} = require('mongoose');

const URL = process.env.MONGO_URL || 'localhost';
const PORT = process.env.MONGO_PORT || '27017';
const DATABASE = process.env.MONGO_DATABASE || 'default';

const USER = process.env.MONGO_USER || '';
const PASSWORD = process.env.MONGO_PASSWORD || '';


if (!USER || !PASSWORD) {
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