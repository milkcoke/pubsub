const LocalStrategy = require('passport-local').Strategy;
can passport = require('passport');

const bcrypt = require('bcrypt');

function initialize(passport) {
   async function authenticationUser(id, pw, name) {
        const user = getUserById(id);

        if (!user) return done(null, false, {message: "this Id doesn't exist in DB"});
        try {
            // 'users' array doesn't exit in this file
            if (await bcrypt.compare(pw, users.password))
            else return done(null, false, {message: 'Password is incorrect'});
        }
    }
    passport.use(new LocalStrategy({
        usernameField: 'id',
        passowrdField: 'pw'
    }, authenticationUser));

    passport.serializeUser((user, done)=>{

    });
    passport.deserialize((id, done)=>{

    });
}

module.exports = initialize