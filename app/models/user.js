var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

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

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }
  , "MY_SECRET"); 
};

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.addToDownvotes = function(sinId) {
    var found = false;
    for(sin in this.sins){
        if(sin.sinId===sinId){
            sin.downvoted=true;
            sin.upvoted=false;
            found=true;
        }
    }
    if(!found){
        this.sins.push({sinId:sinId,created:false,upvoted:false,downvoted:true})
    }
};
userSchema.methods.addToUpvotes = function(sinId) {
    var found=false;
    for(sin in this.sins){
        if(sin.sinId===sinId){
            sin.downvoted=false;
            sin.upvoted=true;
            found=true;
        }
    }
    if(!found){
        this.sins.push({sinId:sinId,created:false,upvoted:true,downvoted:false})
    }
};
userSchema.methods.owns = function(sinId) {
    var res = false;
    for(sin in this.sins){
        if(sin.sinId===sinId){
            if(sin.created){
                res=true;
            }
        }
    }
    return res;
};
userSchema.methods.setOwner = function(sinId) {
    var found = false;
    for(sin in this.sins){
        if(sin.sinId===sinId){
            sin.created=true;
            found = true;
        }
    }
    if(!found){
        this.sins.push({sinId:sinId,created:true,upvoted:false,downvoted:false})
    }
};

module.exports = mongoose.model('User', userSchema);
