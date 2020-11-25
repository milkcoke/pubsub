const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');

function initialize(passport, getUserById) {
   async function authenticationUser(id, pw, done) {
        // user 객체를 Id 를 통해 받아온거임 (당연히 로그인 성공해야 받아오겠지)
        const user = getUserById(id);
        console.dir(user);

        // 1st : error, 2nd: passing object (user) ,3rd : flush message (error.message)
        if (!user) return done(null, false, {message: "this Id doesn't exist in DB"});
        try {
            // 'users' array doesn't exit in this file
            if (await bcrypt.compare(pw, user.password)) return done(null, user);
            else return done(null, false, {message: 'Password is incorrect'});
        } catch (error) {
            return done(error);
        }
    }

    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'pw'
    }, authenticationUser));

    //how to store user's info in session of server
    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });
    passport.deserializeUser((id, done)=>{
        return done(null, getUserById(id));
    });
}

module.exports = initialize;