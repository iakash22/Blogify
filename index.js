const express = require('express');
const path = require('path');
const cookiesParser = require('cookie-parser');
const dbConnect = require('./config/dbConnect');
const staticRoutes = require('./routes/staticRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
require('dotenv').config();


const PORT = process.env.PORT || 4000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve('views'))

app.use(express.json());
app.use(cookiesParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve('./public')))
app.use(staticRoutes);
app.use(userRoutes);
app.use('/blog', blogRoutes);


app.listen(PORT, () => {
    console.log(`Server listen on PORT ${PORT}`);
})
dbConnect();