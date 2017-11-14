var mongoose = require('mongoose');

/*
 * Model used to
 */

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
            default: 0
        },
        downvote: {
            type: Boolean,
            default: 0
        }
    },


    sinId: {
        type: String,
        default: ''
    }

});
