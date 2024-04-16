const { Router } = require('express');
const { auth } = require('../middlewares/auth');
const { addBlog,getBlog,createComment } = require('../controllers/blog');
const { upload } = require('../utils/uploadImage');
const router = Router();

router.get('/add-blog', auth, (req, res) => {
    return res.render('AddBlog', { user: req.user });
})

router.get('/:id', auth, getBlog);

router.post('/', auth, upload.single('coverImage'), addBlog);

router.post('/comment/:id', auth, createComment);


module.exports = router;