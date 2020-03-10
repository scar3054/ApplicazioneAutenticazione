require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()
const port = 3000

// middleware setup
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({ users: [] })
  .write()

app.get('/',  (req, res) => res.send('Hello World!'))


const validateToken = async (req,res) => {
	const token = req.headers['x-access-token']
	if (!token) {
		res.status(403).json(
			{
				error:"unauthorized"
			}
		)
		return
	}

	jwt.verify(token,process.env.SECRET,(err, decoded)=> {
		if(err) {
			res.status(403).json(
				{
					error:"unauthorized"
				}
			)
			return
		}
	})
}

app.get('/test',async (req,res) => {
	validateToken(req,res)

	res.send({status:'ok'})
})

app.post('/users/:username',  async (req, res) => {
	const password = req.body.password
	const username = req.params.username
	
	const user = db.get("users").find({username}).value()
	
	const authenticated = await bcrypt.compare(password,user.hashedPassword)
	//console.log(process.env.SECRET)
	const token = jwt.sign({username},process.env.SECRET,{expiresIn:86400})
	res.send({
		authenticated	,
		token
	})
})

app.post('/users', async (req, res) => {
	// const username = req.body.username
	//const password = req.body.password
	const {username, password} = req.body

	if (db.get("users").find({username:username}).size().value() > 0) {
		res.status(400).send({
			error: "user alredy exists"
		})
		return
		// res.send({
		// 	ok: false,
		// 	data:{
		// 		err: "user alredy exists"
		// 	}
		// })
	}

	const hashedPassword = await bcrypt.hash(password,8)

	const newUser = {
		username,
		hashedPassword
	}

	db.get('users').push(newUser).write()

	res.send(newUser)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))