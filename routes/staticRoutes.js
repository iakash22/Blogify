const { Router } = require('express');
const { auth } = require('../middlewares/auth');
const Blog = require('../models/Blog');

const router = Router();

router.get('/', auth, async (req, res) => {
    const blogs = await Blog.find({}).sort('-1').exec();
    return res.render('Home', {
        user: req.user,
        // success: "User Login Successfully",
        blogs,
    });
})

router.get('/signup', (req, res) => {
    return res.render('Signup');
});

router.get('/login', (req, res) => {
    return res.render('Login');
});

module.exports = router;