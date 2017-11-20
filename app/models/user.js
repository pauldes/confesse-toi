var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


var userSchema = mongoose.Schema({
    local            : {
        email        : String,
        password     : String,
    },
    sins: [{
        sinId        : mongoose.Schema.ObjectId,
        created      : {type:Boolean,default:false},
        upvoted      : {type:Boolean,default:false},
        downvoted    : {type:Boolean,default:false}
    }]
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.addToDownvotes = function(sinId) {
    var found = false;
    for(var i=0; i<this.sins.length;i++){

        var sin = this.sins[i];
        if(sin.sinId.equals(sinId)){
            adjustVoteBalance(sinId,sin.downvoted,sin.upvoted);
            sin.downvoted=true;
            sin.upvoted=false;
            found=true;
        }
    }
    if(!found){
        this.sins.push({sinId:sinId,created:false,upvoted:false,downvoted:true})
    }
    this.save();
};
userSchema.methods.addToUpvotes = function(sinId) {
    var found=false;
    for(var i=0; i<this.sins.length;i++){
        var sin = this.sins[i];
        if(sin.sinId.equals(sinId)){

            adjustVoteBalance(sinId,sin.downvoted,sin.upvoted);

            sin.downvoted=false;
            sin.upvoted=true;
            found=true;
        }
    }
    if(!found){
        this.sins.push({sinId:sinId,created:false,upvoted:true,downvoted:false})
    }
    this.save();
};
userSchema.methods.owns = function(sinId) {
    var res = false;

    for(var i=0; i<this.sins.length;i++){
        var sin = this.sins[i];
        if(sin.sinId.equals(sinId)){
            if(sin.created){
                res=true;
            }
        }
    }
    return res;
};
userSchema.methods.setOwner = function(sinId) {
    var found = false;
    for(var i=0; i<this.sins.length;i++){
        var sin = this.sins[i];
        if(sin.sinId.equals(sinId)){
            sin.created=true;
            found = true;
        }
    }
    if(!found){
        this.sins.push({sinId:sinId,created:true,upvoted:false,downvoted:false});
    }
    this.save();
};

function adjustVoteBalance(sinId,downvoted,upvoted){

    var Todo = require('../models/todo');

    if(upvoted==false && downvoted==true){
        Todo.findOneAndUpdate({
                _id: sinId
            },{
                $inc: { downvotes: -1 }
            },
            function (err, todo) {
                if (err)
                    res.send(err);
            });
    }else if(upvoted==true && downvoted==false){
        Todo.findOneAndUpdate({
                _id: sinId
            },{
                $inc: { upvotes: -1 }
            },
            function (err, todo) {
                if (err)
                    res.send(err);
            });
    }
}

module.exports = mongoose.model('User', userSchema);
