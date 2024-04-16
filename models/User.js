const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('crypto');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    },
    profileImageUrl: {
        type: String,
        default: "/Images/avatar.webp"
    },
    salt: {
        type: String,
        // required: true,
    },
},
    { timestamps: true },
)

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return;

    const salt = randomBytes(16).toString();
    const hashPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');

    this.password = hashPassword;
    this.salt = salt;

    next();
})

userSchema.static("matchPassword", async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) {
        throw new Error('User not found');
    }

    const userPassword = createHmac('sha256', user.salt)
        .update(password)
        .digest('hex');
    
    if (user.password !== userPassword) {
        throw new Error('User password does not match');
    }

    user.password = undefined
    user.salt = undefined

    return user;
})


module.exports = model('User', userSchema);