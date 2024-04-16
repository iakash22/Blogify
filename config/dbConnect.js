const { connect } = require('mongoose');
require('dotenv').config();

const dbConnect = () => {
    connect(process.env.DATABASE_URL)
        .then(() => console.log('Databse Connect Successfully'))
        .catch((err) => {
            console.log('Database Connection Failure', err);
            process.exit(1);
        });
}

module.exports = dbConnect;