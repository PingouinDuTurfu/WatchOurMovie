const database = require('../database/database');

const userSchema = new database.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

module.exports = database.model('User', userSchema);
