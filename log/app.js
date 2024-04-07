const express = require('express');

const app = express();

const logRoutes = require('./routes/logRoute');

const PORT = process.env.LOG_PORT;

if (!PORT) {
    console.error('Log environment variables not set');
    process.exit(1);
}

app.use(express.json());
app.use('/log', logRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});