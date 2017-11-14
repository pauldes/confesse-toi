var mongoose = require('mongoose');

module.exports = mongoose.model('User_x_Sin', {
    userId: {
        type: String,
        default: ''
    },

    /*
    voteType: {
        type: Number,
        default: 0
    },
    */
    voteType: {
        upvote: {
            type: Boolean,
            default: false
        },
        downvote: {
            type: Boolean,
            default: false
        }
    },


    sinId: {
        type: String,
        default: ''
    }

});
