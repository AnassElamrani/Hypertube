const router = require('express').Router()  

const usersController = require('../controllers/usersController')
const usersMiddleware = require('../middlewares/usersMiddleware')

router.post('/register', usersMiddleware.registerValidation, usersController.registerAccount)
router.post('/verify',usersController.updateToken)  
router.get('/verify/:token', usersController.verifyAccount)
router.post('/reset',usersController.resetPassword)
router.get('/reset/:token',usersController.passwordToken)
router.post('/change-password',usersController.changePassword)

router.post('/oauth/42', usersMiddleware.e42Oauth, usersController.connectOrRegister)
router.post('/oauth/facebook', usersMiddleware.fbOauth, usersController.connectOrRegister)

router.post('/authorization', usersMiddleware.authorize, usersController.authorized) 

router.post('/login', usersController.login) 
router.get('/logout', usersController.logOut)

router.get('/settings', usersMiddleware.authorize, usersController.getProfileSetting)
router.get('/profile/:login', usersMiddleware.authorize, usersController.getProfile)
router.get('/me', usersMiddleware.authorize, usersController.getMe)

router.put('/settings', usersMiddleware.authorize, usersController.setProfile) 
router.put('/change-password', usersMiddleware.authorize, usersController.changePassword)

router.post('/addWishList', usersMiddleware.authorize, usersController.addWishList)

router.delete('/wishList/:imdbCode', usersMiddleware.authorize, usersController.deleteWishList)
router.delete('/watched/:imdbCode', usersMiddleware.authorize, usersController.deleteWatched)

module.exports = router