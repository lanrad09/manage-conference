// Import passport module 
var LocalStrategy = require('passport-local').Strategy;

// Import the user model
var User = require('../../server/models/user');
const passport = require('passport');

module.exports = function() {
    // passport setup 
    // serialize user 
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    // Configure local login strategy
    passport.use('local-login', new LocalStrategy({
        // change default username and password, to email and password 
        usernameField : 'email', 
        passwordField : 'password',
        passReqToCallback : true
    } ,

    function(req, email, passport, done) {
        if (email) {
            // format to lower-case 
            email = email.toLowerCase();
        }

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'local.email' : email}, function(err, user) {
                // if errors
                if (err) {
                    return done(err);
                }
                // check errors and bring the messages
                if (!user) {
                    // third parameter is a flash warning message 
                    return done (null , false, req.flash('loginMessage', 'No user found'));
                }
                if (!user.validPassword(passport)) {
                    return done(null , false, req.flash('loginMessage', 'Warning! Wrong password'));
                } else {
                    // everything ok, get user 
                    return done(null , user);
                }
            });
        });
    } )) ;
    // Configure signup local stragegy 
    passport.use('local-signup', new LocalStrategy({
        // change default username and password, to email and password
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        if (email) {
            // format to lower-case
            email = email.toLowerCase();
        }
        // asychronous 
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!reg.user) {
                User.findOne( { 'local.eamil' : email }, function(err, user){
                    if (err) {
                        return done (err);
                    }
                    // Check email 
                    if (user) {
                        return done(null , false , reg.flash('signupMessage', 'Warning! the email is already taken'));
                    } else {
                        // create the user 
                        var newUser = new User();
                        newUser.local.email = email;
                        newUser.generateHash(password);
                        newUser.save(function(err) {
                            if(err) {
                                throw err ;
                            }
                            return done(null , newUser);

                        });
                    }
                });

            } else {
                // everthing ok, register user 
                return done (null , req.user);
            }
        });
    } ));
};