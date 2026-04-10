require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const port = process.env.PORT || 3000;

// Connect to DB and start server
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
