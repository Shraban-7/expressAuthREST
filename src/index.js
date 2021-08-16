const express = require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const todoHandler = require('./Routes/todoHandler')
const userHandler = require('./Routes/userHandler')
const app = express()
dotenv.config();
const port = 3000

app.use(express.json());


mongoose.connect('mongodb://localhost/todos',{ useNewUrlParser: true , useUnifiedTopology: true }).then(() => {
	console.log('connection successful');
}).catch((err) => {
	console.log(err);
});


app.use('/todo', todoHandler);
app.use('/user', userHandler);

const errorHandler = (err, req, res, next)=> {
	if (res.headerSent) {
		return next(err)
	}
	res.status(500).json({ error: err })
}

app.use(errorHandler);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})