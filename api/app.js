require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs')
const https = require('https');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const { resolve, join, dirname } = require('path')
const cors = require('cors')
const cronMovieModel = require('./models/Movie')
const cron = require('node-cron')
var moment = require('moment');

mongoose
  .connect(
    'mongodb://db:27017/docker-node-mongo',
    { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  )
  .then(() => {
    const app = express()
    const usersRouter = require('./routes/usersRouter')
    const moviesRouter = require('./routes/moviesRouter')
    app.use(bodyParser.json({limit: '50mb'})); 
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(express.static('avatars'))
    const corsOptions = {
      origin: process.env.CLIENT_URL,
      credentials: true,
    };
    app.use(cors(corsOptions))
    app.use(express.static('sub'))
    app.use(cookieParser())
    
    cron.schedule("* * * * *", async () => {
      console.log('running a task every minute');
      // console.log(cronMovieModel)
			let movies = await cronMovieModel.find()
      if (movies){
        
        movies.map(el => {
          let now = new Date();
          let lastWatch = new Date(el.updatedAt);
          let nowSeconds = now.getTime();
          let lastWatchSeconds = lastWatch.getTime();
          // console.log('*', el.updatedAt);
          let diffSeconds = nowSeconds - lastWatchSeconds
          console.log('*diff', Math.floor(diffSeconds ));
          // console.log(el.pathName.split('/')[0])
          // if ()
          // const uploadPath = resolve(dirname(__dirname)+'/movies/'+el.pathName.split('/')[0])
          // console.log(uploadPath)
          // fs.rmdir(uploadPath)
        })
      }
    });
    // static file for subtitles
    // app.use('/static', express.static(path.join(__dirname, 'public')));
    app.use('/account', usersRouter)
    app.use('/movies', moviesRouter)

    const server = https.createServer({
        key: fs.readFileSync('/etc/ssl/private/hypertube.key'),
        cert: fs.readFileSync('/etc/ssl/certs/hypertube.crt')
      }, app)
    
      server.listen(3000)
  })
  .catch(err => console.log(err));


