const mongoose = require('mongoose')
// const User = require('./User')
const movieSchema = mongoose.Schema({
    pathName: String,
    imdb_code: String,
    comments:[{
        comment: String,
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        time:{type: Date, default: Date.now}
    }]
    
}, {collection:'movies', timestamps: true })

module.exports = mongoose.model('Movie', movieSchema) 
