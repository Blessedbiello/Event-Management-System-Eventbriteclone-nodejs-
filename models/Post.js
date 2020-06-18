const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	text: {
		type: String,
		required: true
	},
	name: {
		type: String
	},
	avatar: {
		type: String
	},
	likes: [
		{
			user: {
				type: Schema.Types.ObjectId
			}
		}
	],
	comments: [
		{
			user: {
				type: Schema.Types.ObjectId
			},
			text: {
				type: String,
				required: true
			},
			name: {
				type: String
			},
			avatar: {
				type: String
			},
			date: {
				type: Date,
				default: Date.now
			}
		}
	],
	date: {
		type: Date,
		default: Date.now
	},	
	event: {
		type: mongoose.Schema.ObjectId,
		ref: 'Event',
		required: true
	}
});
module.exports = mongoose.model("Post", PostSchema);
