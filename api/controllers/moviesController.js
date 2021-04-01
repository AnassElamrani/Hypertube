require('dotenv').config()
const pump = require('pump')
const FFmpeg = require('fluent-ffmpeg')
const { resolve, join, dirname } = require('path')
const torrentStream = require('torrent-stream');
const Movie = require('../models/Movie')
const theelitesubs = require('theelitesubs');
const subPath = resolve(dirname(__dirname)+'/sub')
const fs = require('fs')
const User = require('../models/User')

// const convert = (file, thread = 4) => {
// 	const converted = new FFmpeg(file.createReadStream()) 
// 		.videoCodec('libvpx')
// 		.audioCodec('libvorbis')
// 		.format('webm')
// 		.audioBitrate(128)
// 		.videoBitrate(8000)
// 		.outputOptions([
// 			`-threads ${thread}`,
// 			'-deadline realtime',
// 			'-error-resilient 1'
// 		])
// 		.on('error', err => converted.destroy())
// 		.stream()
// 	return converted
// }

const extractData = (range, file) => {
	const parts = range.replace(/bytes=/, '').split('-')
	const start = parseInt(parts[0], 10)
	const end = parts[1] ? parseInt(parts[1], 10) : file.length - 1
	const chunksize = end - start + 1
	const splited = file.name.split('.')
	const ext = splited.pop()
	const fileName = splited.join('.')
	const finalExt = ext == 'mp4' || ext == 'webm' ? ext : 'webm'
	let head
	// if (!needConvert) {
	head = {
		'Content-Range': `bytes ${start}-${end}/${file.length}`,
		'Accept-Ranges': 'bytes',
		'Content-Length': chunksize,
		'Content-Type': `video/${finalExt}`
	}
	// } else {
	// 	head = {
	// 		'Content-Range': `bytes ${start}-${end}/*`,
	// 		'Content-Type': 'video/webm'
	// 	}
	// }
	return {
		head,
		resRange: { start, end }
	}
}

const stream = (range, file, res) => {
	const { head, resRange } = extractData(range, file)
	res.writeHead(206, head)
	// if (needConvert) {
	// 	pump(convert(file), res) 
	// } else {
	file.createReadStream(resRange).pipe(res)
	// }
}

	
	
const getSub = async (imdbCode) => {
	const results = await theelitesubs(imdbCode, {
		path: subPath,
		langs: ['en', 'fr']
	});
	return results
}

// need to deelete movies after 30 days passed ....
// delete row form the collection and unlinkSync the path/file

exports.getMovie = async (req, res) => {
	const range = req.headers.range
	bytes=0-100
	const hash = req.params.hash
	const imdb_code = req.params.tash
	let download = {}
    try {

		// if movies already watched find path or imdb_code  
		// call function stream immediatly
		if (range){
			const uploadPath = resolve(dirname(__dirname)+'/movies')
			const engine = torrentStream(`magnet:?xt=urn:btih:${hash}&dn=Url+Encoded+Movie+Name&
				tr=udp://glotorrents.pw:6969/announce&
				tr=udp://tracker.opentrackr.org:1337/announce&
				tr=udp://tracker.openbittorrent.com:80&
				tr=udp://tracker.coppersurfer.tk:6969&
				tr=udp://tracker.leechers-paradise.org:6969&
				tr=udp://p4p.arenabg.ch:1337&
				tr=udp://tracker.internetwarriors.net:1337&
				tr=udp://torrent.gresille.org:80/announce`, {path: uploadPath})

			let ifexist = await Movie.findOne({imdb_code})
			if (Object.keys(download).length) return stream(range, download.file, res)

			engine.on('torrent', async () => {
				const pathName = engine.files[0].path
				const subName = getSub(imdb_code)
				subName.then( (el) => {
					fs.renameSync(subPath+"/"+el[0].fileName, subPath+"/"+imdb_code+"-en.vtt");
					fs.renameSync(subPath+"/"+el[1].fileName, subPath+"/"+imdb_code+"-fr.vtt");
				})
				if (!ifexist){
					const movie = new Movie({ pathName, imdb_code })
					await movie.save()
				}
				download[imdb_code] = {file: engine.files[0]}
				stream(range, engine.files[0], res) 
			})
			engine.on('idle', () => {
				// download complet
				// dir li bghiti
			})
		}else {
			res.sendStatus(416)
		}
	} catch (error) {
		console.log(error)
		res.end()
	}
}

exports.addComment = async (req, res) => {
	try {
		const user = await User.findById(req.id)
		let movie = await Movie.findOne({imdb_code: req.body.imdb_code})
		if(movie)
			movie.comments.push({
				comment:req.body.comment, 
				user: user._id})
		else{
			movie = new Movie({
						imdb_code: req.body.imdb_code, 
						comments: [{
							comment:req.body.comment, 
							user: user._id}]})
		}
		await movie.save()
		res.status(200).send()
	} catch (error) {
		res.send({error:error.message})
	}
}

exports.getComments = async (req,res) => {
	try {
		const user = await User.findById(req.id)
		let isWishList = false
		user.wishList.forEach(wish => {
			if(wish.imdb_code === req.params.imdbCode)
			{
				isWishList = true
				return
			}
		});
		await Movie.findOne({imdb_code: req.params.imdbCode}).select('comments.comment -_id')
			.populate({path: 'comments.user', select:'profile login fname lname -_id'}).exec((err, movie)=>{
				if(err) throw err
				res.send({movie,isWishList})
			})
	} catch (error) {
		res.send(error.message) 
	}
}

exports.updateLastWatch = async (req, res) => {
	const filter = { imdb_code : req.body.imdbCode }
	const update = { updatedAt : new Date()}
	try {
		const movie = await Movie.findOneAndUpdate(filter, update);
		if(movie){
			// console.log('movie', movie);
			res.json({test :  movie})
		} else {
			// console.log('!movie', movie);
			res.json({Ttest :  movie})
		}
	} catch(error) {
		res.send(error.message)
	}
}
