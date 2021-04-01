require('dotenv').config()
const fs = require('fs')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const bcrypt = require('bcrypt')
dayjs.extend(utc)
//const multer = require('multer')

const User = require('../models/User')
const helpers = require('../tools/helper')
const auth = require('../tools/authentication')
const { update } = require('../models/User')

exports.authorized = (req, res) => { res.status(200).send({ state: 'AUTHORIZED' }) }

exports.registerAccount = async (req, res) => {
    try {
        const user = new User({ ...req.body, token: helpers.hashHmacSha256(Date.now().toString()).key })
        let err = {}
        err.login = await User.ifLogin(req.body.login)
        err.email = await User.ifEmail(req.body.email)
        if (err.login || err.email)
            return res.send({ status: 400, emailerr: err.email, loginerr: err.login })
        const result = await user.save()
        const subject = 'Email Confirmation'
        const html = `<p>Hello ${result.login} Your account was created successfuly you need to verify your account to login please <a href="${process.env.CLIENT_URL}/verify/${result.token}/">click here</a>`
        helpers.sendEmail(result.email, subject, html)
        res.status(200).send({ message: 'Your Account was created. Please go check your Inbox to verify your Account' })

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

exports.connectOrRegister = async (req, res) => {
    const userdata = req.userdata
    try {
        let ifexist = await User.findOne({ email: userdata.email })
        if (ifexist && !ifexist.oauth)
            res.status(200).send({ error: "The Email linked with your Account is already used" })
        else {
            let user = await User.findOne({ oauth: userdata.oauth })
            if (!user) {
                console.log(userdata);
                user = new User(userdata)
                user = await user.save()
            }
            const accTok = auth.createAccToken(user)
            const refTok = auth.createRefToken(user)
            res.cookie('accTok', accTok, { httpOnly: true, maxAge: 1000 * 60 * 3 })
            res.cookie('refTok', refTok, { httpOnly: true, maxAge: 1000 * 3600 * 24 * 3 })
            res.status(200).send({ error: false })
        }
    } catch (error) {
        res.status(200).send({ error: error.message })
    }
}

exports.verifyAccount = async (req, res) => {
    try {
        const user = await User.findOne({ token: req.params.token })
        if (user) {
            if (user && !user.status) {
                const diff = Math.floor((dayjs().utc() - dayjs(user.expire_token).utc()) / 60000)
                if (diff <= 3) {
                    await user.updateOne({ status: true })
                    res.status(200).send({ message: 'Account is activated you can login now' })
                }
                else res.status(200).send({ error: 'This verification link is expired! Request a new one', special: true })
            }
            else res.status(200).send({ error: 'This account is already verified, you can login' })
        }
        else
            res.status(200).send({ error: 'This link is incorrect', special: true })
    } catch (error) {
        res.status(200).send({ error: "Something went Wrong! Please try later" })
    }
}

exports.updateToken = async (req, res) => {
    try {
        const result = await User.findOne({ $or: [{ email: req.body.login }, { login: req.body.login }] })
        if (result) {
            if (!result.status) {
                let token = helpers.hashHmacSha256(Date.now().toString()).key
                const diff = Math.floor((dayjs().utc() - dayjs(result.expire_token).utc()) / 60000)
                if (diff >= 5) {
                    await result.updateOne({ token: token.toString(), expire_token: Date.now() })
                    const subject = 'Email Confirmation'
                    const html = `<p>Hello ${result.login} Your account was created successfuly you need to verify your account to login please <a href="${process.env.CLIENT_URL}/verify/${token}/">click here</a>`
                    helpers.sendEmail(result.email, subject, html)
                    res.send({ message: 'Email verification was sent Please go check your Inbox', redirect: true })
                }
                else res.status(200).send({ error: `A verification mail already sent please retry after ${5 - diff} minute${5 - diff - 1 ? 's' : ''}.` })
            }
            else
                res.status(200).send({ error: 'This account is already verified. You can login now.', redirect: true })
        }
        else res.status(200).send({ error: 'Account not found.' })
    } catch (error) {
        res.status(200).send({ error: error.message })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        let diff = null
        const result = await User.findOne({ $or: [{ email: req.body.login }, { login: req.body.login }] })
        if (result) {
            if (result.status) {
                let token = helpers.hashHmacSha256(Date.now().toString()).key
                if (result.expire_token)
                    diff = Math.floor((dayjs().utc() - dayjs(result.expire_token).utc()) / 60000)
                if (!result.expire_token || diff >= 10) {
                    await result.updateOne({ token: token.toString(), expire_token: Date.now() })
                    const subject = 'Reset Password'
                    const html = `<p>Hello ${result.login} Someone has requested a link to change your password. You can do this through the link below. <a href="${process.env.CLIENT_URL}/reset/${token}/">Change My Password</a>`
                    helpers.sendEmail(result.email, subject, html)
                    res.status(200).send({ message: 'An email to reset you password was sent' })
                }
                else res.status(200).send({ error: `A verification mail already sent please retry after ${10 - diff} minute${10 - diff - 1 ? 's' : ''}.` })
            }
            else
                res.status(200).send({ error: 'Please you need to Verify your account', special: true })
        }
        else res.status(200).send({ error: 'Account not found.' })
    } catch (error) {
        res.status(200).send({ error: error.message })
    }
}

exports.passwordToken = async (req, res) => {
    try {
        const user = await User.findOne({ token: req.params.token })
        if (user) {
            const diff = Math.floor((dayjs().utc() - dayjs(user.expire_token).utc()) / 60000)
            if (diff <= 10) {
                res.status(200).send({ error: false })
            }
            else res.status(200).send({ error: 'This verification link is expired! Request a new one' })
        }
        else
            res.status(200).send({ error: 'This link is incorrect', special: true })
    } catch (error) {
        res.status(200).send({ error: "Something went Wrong! Please try later" })
    }
}
exports.changePassword = async (req, res) => {
    try {
        let user = null
        if (req.body.token) {
            user = await User.findOne({ token: req.body.token })
            if (user) {
                const diff = Math.floor((dayjs().utc() - dayjs(user.expire_token).utc()) / 60000)
                if (diff <= 10) {
                    user.password = req.body.npassword
                    user.token = null
                    user.expire_token = null
                    user.save()
                    res.send({ status: 200, message: 'Your password was changed' })
                }
                else res.status(200).send({ error: 'This verification link is expired! Request a new one' })
            }
            else
                res.status(200).send({ error: 'This link is incorrect', special: true })
        }
        if (req.id) {
            user = await User.findById(req.id)
            if (user && user.password) {
                const passCompare = await bcrypt.compare(req.body.opassword, user.password)
                if (!passCompare)
                    return res.send({ status: 400, passError: true })
            }
            user.password = req.body.npassword
            user.save()
            res.send({ status: 200, message: "Your password was changed" })
        }
    } catch (error) {
        res.status(200).send({ error: "Something went Wrong! Please try later" })
    }
}

exports.login = async (req, res) => {
    const { login, password } = req.body
    try {
        const user = await User.findOne({ $or: [{ email: login }, { login: login }] })
        if (user && user.password) {
            const passCompare = await bcrypt.compare(password, user.password)
            if (passCompare) {
                if (user.status) {
                    const accTok = auth.createAccToken(user)
                    const refTok = auth.createRefToken(user)
                    res.cookie('accTok', accTok, { httpOnly: true, maxAge: 1000 * 60 * 3 })
                    res.cookie('refTok', refTok, { httpOnly: true, maxAge: 1000 * 3600 * 24 * 3 })
                    return res.status(200).send({ userStatus: user.status })
                }
                else return res.status(200).send({ error: 'You need to verify your account first', special: true })
            }
        }
        return res.status(200).send({ error: 'The username or password is incorrect' })
    } catch (error) {
        res.status(200).send({ error: error.message })
    }
}

exports.logOut = (req, res) => {
    res.clearCookie('accTok');
    res.clearCookie('refTok');
    res.send({ error: false })
}

exports.getProfileSetting = async (req, res) => {
    try {
        const data = await User.findById(req.id)
        const user = {
            fname: data.fname,
            lname: data.lname,
            email: data.email,
            login: data.login,
            profile: (data.profile) ? `${process.env.API_URL}/${data.profile}` : null,
            isPass: !!data.password
        }
        res.send({ status: 200, user, })
    } catch (error) {
        res.send({ status: 500, error: 'Something went Wrong! Please try Later' })
    }
}

exports.getProfile = async (req, res) => {
    try {
        let data, isMe = false
        if (req.params.login === "me"){
            isMe = true
            data = await User.findById(req.id)
        }
        else
        {
            data = await User.findOne({ login: req.params.login })
            if(data._id == req.id)
                isMe = true
        }
        if (data) {
                
            const user = {
                fname: data.fname,
                lname: data.lname,
                email: data.email,
                login: data.login,
                watched: data.watched,
                wishList: data.wishList,
                profile: (data.profile) ? `${process.env.API_URL}/${data.profile}` : null,
                isMe: isMe
            }
            res.send({ status: 200, user})
        }
        else
            res.send({user: null})
    } catch (error) {
        res.send({ status: 500, error: 'Something went Wrong! Please try Later' })
    }
}

exports.setProfile = async (req, res) => {
    try {
        let user = await User.findById(req.id)
        let err = {}
        if (user.login !== req.body.user.login)
            err.login = await User.ifLogin(req.body.user.login)
        if (user.email !== req.body.user.email)
            err.email = await User.ifEmail(req.body.user.email)
        if (err.login || err.email)
            return res.send({ status: 400, emailerr: err.email, loginerr: err.login })

        const updated = req.body.user
        if (req.body.image) {
            const regex = /^data:.+\/(.+);base64,(.*)$/;
            const matches = req.body.user.profile.match(regex);
            var ext = matches[1];
            var data = matches[2];
            var buffer = Buffer.from(data, 'base64');
            fs.writeFileSync(`avatars/${req.body.user.login}.${ext}`, buffer);
            updated.profile = `${req.body.user.login}.${ext}`
        }
        else
            delete updated.profile
        await user.updateOne(updated)
        res.send({ status: 200 })
    } catch (error) {
        let err = {}
        if (error.errors.login)
            err.login = true
        if (error.errors.email)
            err.email = true
        if (err)
            res.send({ status: 201, loginerr: err.login, emailerr: err.email })
        else
            res.send({ status: 500, error: error.message })
    }
}
exports.addWishList = async (req, res) => {
    try {
        const user = await User.findById(req.id)
        user.wishList.push({ imdb_code: req.body.imdb_code })
        user.save()
        res.status(200).send()
    } catch (error) {
        res.send({ status: 500, error: error.message })
    }
}

exports.deleteWishList = async (req,res) => {
    try {
        await User.findByIdAndUpdate(req.id, {
            $pull: {
              wishList: {imdb_code: req.params.imdbCode}
            }});
        res.send({message: "done"})
    } catch (error) {
        res.send({error: error.message})
    }
}
exports.deleteWatched = async (req,res) => {
    try {
        await User.findByIdAndUpdate(req.id, {
            $pull: {
              watched: {imdb_code: req.params.imdbCode}
            }});
        res.send({message: "done"})
    } catch (error) {
        res.send({error: error.message})
    }
}
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.id)
        if(user){
            res.send({user: {
                fname: user.fname,
                lname: user.lname,
                login: user.login,
                profile: `${user.profile}`}
            })
        }
    } catch (error) {
        res.send({error: error.message})
    }
}