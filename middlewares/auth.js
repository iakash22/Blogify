const jwt = require('jsonwebtoken');

exports.auth = async (req, res, next) => {
    try {
        // console.log(req.cookies)
        const { token } = req.cookies || req.body;

        if (!token) {
            return next();
            // throw new Error('Token is missing');
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);

        if (!user) {
            throw new Error('token is not valid');
        }

        req.user = user;
        next();
    } catch (err) {
        console.log('Error occurred while token verify', err);
        return res.redirect('/login');
    }
}

// exports.userRole = async (req, res, next) => {
//     try {
//         const { role } = req.user;
//         if (role !== 'USER') {
//             throw new Error('Only access by authenticate user');
//         }
//         next();
//     } catch (err) {
        
//     }
// }