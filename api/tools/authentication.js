require('dotenv').config()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const crypto = require("crypto-js");

const cryptSHA265 = (string) => crypto.SHA256(string, process.env.SECRET_KEY).toString();

const accTokenExp = 60 * 3
const refTokenExp = 24 * 3600 * 3

const createAccToken = (user)=>{
    const id = user._id
    const type = 'access'
    return jwt.sign({id, type}, process.env.SECRET_KEY, { expiresIn: accTokenExp })
}

const createRefToken = (user)=>{
    const id = user._id
    const key = cryptSHA265(id+user.password)
    const type = 'refresh'
    return jwt.sign({id, key, type}, process.env.SECRET_KEY, { expiresIn: refTokenExp })
}

const authorize = async (req, res, next)=>{
    const accTok = req.cookies.accTok
    const refTok = req.cookies.refTok
    try{
        if(!refTok)
        {
            res.clearCookie('accTok');
            throw Error('refToken must be provided');
        }
        const accPayload = jwt.verify(accTok, process.env.SECRET_KEY) 
        if(accPayload.type != 'access')
            throw Error('wrong token type');
        req.id = accPayload.id
        next()
    }catch(e)
    {
        if(e.message == 'jwt expired' || e.message == 'jwt must be provided')
            try{
                const refPayload = jwt.verify(refTok, process.env.SECRET_KEY)
                if(refPayload.type != 'refresh')
                    throw Error('wrong token type'); 
                const user = await User.findById(refPayload.id)
                if(user && refPayload.key == cryptSHA265(user._id+user.password))
                {
                    const newAccTok = createAccToken(user)
                    res.cookie('accTok', newAccTok, { httpOnly: true, maxAge: 1000 * 60 * 3 })
                    req.id = user._id
                    next()
                }
                else{
                    res.clearCookie('refTok');
                    res.status(200).send('invalid reftok key')
                }
            }catch(error){
                res.clearCookie('refTok');
                res.status(200).send({ error: 'Something went Wrong! Please try Later' })
            }
        else
            res.status(200).send({ error: 'Something went Wrong! Please try Later' })
    }

}

module.exports = {createAccToken, createRefToken, authorize}