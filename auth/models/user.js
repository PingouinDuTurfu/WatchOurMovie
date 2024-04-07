const mongoose = require('mongoose');

const URL = process.env.MONGO_URL || 'localhost';
const PORT = process.env.MONGO_PORT || '27017';

const USER = process.env.MONGO_USER || '';
const PASSWORD = process.env.MONGO_PASSWORD || '';
const DB = process.env.MONGO_DATABASE || 'default';

if (!USER || !PASSWORD) {
    console.error('MongoDB environment variables not set');
    process.exit(1);
}

mongoose.connect(`mongodb://${URL}:${PORT}`, {
    user: USER,
    pass: PASSWORD,
    dbName: DB,
})
    .then(() => console.log('Connected!'))
    .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
