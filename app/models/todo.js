var mongoose = require('mongoose');

module.exports = mongoose.model('Sins', {
    text: {
        type: String,
        default: ''
    }
});