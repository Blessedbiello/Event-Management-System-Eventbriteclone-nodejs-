const mongoose = require('mongoose');

const connectDB = async() => {
	const conn = await mongoose.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
		autoIndex: true
	});

	console.log(`MongoDB succesfully Connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;