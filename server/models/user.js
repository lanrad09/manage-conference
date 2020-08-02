// Import mangoose and bcrypt
var mongoose = require('mongoose');
//var bcrypt = require('bcrypt-nodejs');
var bcrypt = require('bcryptjs');
//var bcrypt = dcodeIO.bcrypt;
var Schema = mongoose.Schema;

// define the schema for the user model 
var userSchema = new Schema ({
    local : {
        email: String,
        password: String,
    }
});

// generating a hash 
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// Validating if password is valid 
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// Create the model for users and export to app 
module.exports = mongoose.model('User', userSchema);