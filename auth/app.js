const express = require('express');

const app = express();
const authRoutes = require('./routes/authRoute');

const PORT = process.env.AUTH_PORT || 3000;

app.use(express.json());
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
