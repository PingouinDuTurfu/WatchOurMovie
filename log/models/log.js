const database = require('../database/database');

const logSchema = new database.Schema({
    message: { type: String, required: true },
    userId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}, { collection: 'logs' });

module.exports = database.model('Log', logSchema);