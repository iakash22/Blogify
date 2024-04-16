const Blog = require('../models/Blog');
const Comment = require('../models/Comment'); 
    
exports.addBlog = async (req, res) => {
    try {
        const { title, body } = req.body;
        const coverImage = req?.file;
        const userId = req.user.id;

        if (!title || !body || !userId) {
            throw new Error('All fields are required');
        }

        const data = await Blog.create(
            {
                title,
                body,
                coverImageUrl: `/uploads/${coverImage?.filename}`,
                createdBy : userId,
            });
        
        return res.redirect(`/blog/${data?._id}`);
    } catch (err) {
        console.log('Error occurred while add blog', err);
        return res.redirect('/blog/add-blog');
    }
}

exports.getBlog = async (req, res) => {
    try {
        const blogId = req.params?.id;
        if (!blogId) {
            throw new Error('Blog id is missing');
        }

        const blog = await Blog.findById({ _id: blogId }).populate('createdBy');
        blog.createdBy.salt = undefined 
        blog.createdBy.password = undefined 

        const comments = await Comment.find({ blogId }).populate('createdBy').exec();
        // console.log(comments);
        // console.log(blog);

        if (!blog || !comments) {
            return res.redirect('/');
        }

        res.render('Blog', { user: req.user, blog, comments});
    } catch (err) {
        console.log('Error occurred while fetch blog data', err);
        return res.redirect('/');
    }
}

exports.createComment = async (req, res) => {
    console.log(req);
    try {
        await Comment.create({
            content: req.body.content,
            blogId: req.params.id,
            createdBy: req.user.id,
        });

        return res.redirect(`/blog/${req.params.id}`)
    } catch (err) {
        console.log('Error occurred while create comment', err);
        return res.redirect(`/blog/${req.params.id}`)
    }
}