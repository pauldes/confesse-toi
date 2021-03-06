var mongoose = require('mongoose');

module.exports = mongoose.model('Sins', {
    text: {
        type: String,
        default: ''
    },
    posted: {
    	type: Date,
    	default: Date.now
    },
    upvotes: {
    	type: Number,
    	default: 0
    },
    downvotes: {
    	type: Number,
    	default: 0
    }
});
