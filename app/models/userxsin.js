var mongoose = require('mongoose');

module.exports = mongoose.model('User_x_Sin', {
    userId: {
        type: String,
        default: ''
    },
    voteType: {
        type: Number,
        default: 0
    },
    sinId: {
        type: String,
        default: ''
    }

});
