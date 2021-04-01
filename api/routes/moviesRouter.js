const router = require('express').Router()  

const moviesController = require('../controllers/moviesController')
const usersMiddleware = require('../middlewares/usersMiddleware')
const { route } = require('./usersRouter')


// router.get('/sub/:imdb_code', moviesController.getSub)


router.get('/:hash', moviesController.getMovie)
router.post('/comment', usersMiddleware.authorize, moviesController.addComment)
router.get('/details/:imdbCode', usersMiddleware.authorize, moviesController.getComments)
router.get('/trr/:hash/:tash', moviesController.getMovie)
router.post('/updateLastWatch/', usersMiddleware.authorize, moviesController.updateLastWatch)
module.exports = router