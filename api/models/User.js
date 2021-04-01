const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const { schema } = require('./Movie');

const userSchema = mongoose.Schema({
    fname: String,
    lname: String,
    login: {
        type: String,
        unique: true,
        index: true
    },
    email:  {
        type: String,
        unique: true,
        index: true
    },
    password: String,
    profile: String, 
    watched: [{
        imdb_code:String
    }],
    wishList:[{
        imdb_code:String
    }],
    status: {type: Boolean, default: false}, 
    oauth: String,
    token: String,
    expire_token: {type: Date, default: Date.now}
}, {collection:'users', timestamps: true })

userSchema.pre('save', function(next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    if(user.password){
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err);
    
            // hash the password using our new salt
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);
    
                // override the cleartext password with the hashed one
                user.password = hash;
                next();
            });
        });
    }
    else next()
});
userSchema.statics.ifEmail = async email => {
    const check = await mongoose.model('User', userSchema).findOne({ email });
    return !!check;
};
userSchema.statics.ifLogin = async login => {
    const check = await mongoose.model('User', userSchema).findOne({ login });
    return !!check;
};


module.exports = mongoose.model('User', userSchema)
