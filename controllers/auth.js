const User = require('../models/User');
const jwt = require('jsonwebtoken')
require('dotenv').config();

exports.signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        console.log(req.body);
        if (!fullName || !email || !password) {
            return res.render('Signup', { error: "All fields are required" });
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.render('Signup', { error: "User is already register" });
        }

        const user = await User.create({ fullName, email, password });
        user.password = undefined;
        user.salt = undefined;
        // console.log(user);

        try {
            const payload = {
                fullName: user.fullName,
                email: user.email,
                id: user._id,
                role: user.role
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });
            if (!token) {
                throw new Error('Token failed to generate');
            }

            const options = {
                httpOnly: true,
                exipre: Date.now() + 60 * 60 * 3 * 1000,
            }

            return res.cookie('token', token, options).redirect('/');
        } catch (err) {
            console.log('Error occrred while generate token', err);
            res.render('Login', { error: err.message });
        }
    }
    catch (err) {
        console.log('Error occurred while user signup', err);
        return res.redirect('/signup');
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.render('Login', { error: "All fields are required" });
        }

        const user = await User.matchPassword(email, password);
        if (!user) {
            return res.render('Login', { error: "User doesn't exist" });
        }
        console.log('User', user);
        try {
            const payload = {
                fullName: user.fullName,
                email: user.email,
                id: user._id,
                role: user.role
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });
            if (!token) {
                throw new Error('Token failed to generate');
            }

            const options = {
                httpOnly: true,
                exipre: Date.now() + 60 * 60 * 3 * 1000,
            }

            return res.cookie('token', token, options).redirect('/');
        } catch (err) {
            console.log('Error occrred while generate token', err);
            res.render('Login', { error: err.message });
        }
    } catch (err) {
        console.log('Error occurred while login user', err);
        return res.render('Login', { error: err.message });
    }
}

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token').redirect('/');
    } catch (err) {
        console.log('Error occurred while user logout', err);
        res.redirect('/');
    }
}