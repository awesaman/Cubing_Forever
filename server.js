const express = require('express');
const app = express();
const connectDB = require('./config/db');

connectDB();

app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
