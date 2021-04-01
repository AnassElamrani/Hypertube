require('dotenv').config()

const axios = require('axios')
const auth = require('../tools/authentication')

exports.authorize = (req, res, next) => auth.authorize(req, res, next)


exports.e42Oauth = (req, res, next) => {
  const code = req.body.code
  axios({
      url: `https://api.intra.42.fr/oauth/token`,
      method: 'post',
      params: {
          grant_type: 'authorization_code',
          code,
          client_id: process.env.ID_42,
          client_secret: process.env.SECRET_42,
          redirect_uri: `${process.env.CLIENT_URL}oauth/42`,
          headers: {'content-type': 'application/x-www-form-urlencoded'}  
      }, 
    }).then(({data})=>{ 
        return axios({
          url: 'https://api.intra.42.fr/v2/me',
          method: 'get',
          headers: {
              Authorization: `Bearer ${data.access_token}`,  
          },
        })      
    }).then(({data})=>{ 
      const {id , email, first_name:fname, last_name:lname} = data
      const userdata = {
        oauth: `e42${id}`,
        fname,
        lname,
        email,
        username:`user${id}`,
        status: true
      } 
      return userdata; 
  }).then((ret)=>{
    req.userdata = ret
    next() 
}).catch((e)=> res.status(200).send({error: e.message}))
}

exports.fbOauth = (req, res, next) => {
  const code = req.body.code
  axios({
      url: 'https://graph.facebook.com/v4.0/oauth/access_token',
      method: 'get',
      params: {
        client_id: process.env.ID_FACEBOOK,
        client_secret: process.env.SECRET_FACEBOOK,
        redirect_uri: `${process.env.CLIENT_URL}/oauth/facebook`,
        code,
      },
    }).then(({data})=>{
        return axios({
          url: 'https://graph.facebook.com/me',
          method: 'get',
          params: {
              fields: ['id', 'email', 'first_name', 'last_name'].join(','),
              access_token: data.access_token,
              }
        })        
    }).then(({data})=>{ 
        const {id , email, first_name:fname, last_name:lname} = data
        const userdata = {
          oauth: `fb${id}`,
          fname,
          lname,
          email,
          login: `user${id}`,
          status: true
        } 
        return userdata; 
    }).then((ret)=>{
      req.userdata = ret
      next() 
  }).catch((e)=>{ 
      res.status(200).send({error: 'There is an error on Facebook API'})
    })
} 

exports.registerValidation = (req, res, next) => {

    const {fname, lname, email, login, password, cpassword } = req.body;
    let err = true

    if (!fname || fname.length < 3 || !fname.match(/^[a-zA-Z]+$/))
        err = false
    if (!lname || lname.length < 3 || !lname.match(/^[a-zA-Z]+$/))
      err = false
    if (!email || !email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
      err = false
    if (!login || login.length > 14 || !login.match(/^[a-zA-Z0-9]+$/))
      err = false
    if (!password || !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[^A-Za-z0-9\s]).{8,}/))
      err = false
    if(cpassword !== password)
        err = false
    if(!err)
        res.status(200).send("validation error")
    else
        next()
}

