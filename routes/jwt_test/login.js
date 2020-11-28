const router = require('express').Router();
const jwt = require('jsonwebtoken');

const refreshTokens = [];

function generateAccessToken(user) {

    //usually use '15 minutes ~ 30 minutes'
    //but in my app.. realtime update of waiting list -> longer than 30 minutes
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'})
}

router.post('/', (request, response)=>{
    //null check
    if (!request.body.name) return response.status(409).json({message: "you need to define of user name"});

    const user = {name: request.body.name}

    //we can define expiration of token ,
    //but I've yet no way of refreshing token.
    //so didn't define expiration of one

    // save user info in json web token
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.ACCESS_REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);

    // move from the list , refresh token, invalidate expired token
    return response.json({
        accessToken: accessToken,
        refreshToken : refreshToken
    });
});

router.post('/token', (request, response)=>{
    //use-case in database
    const refreshToken = request.body.token;
    if(!refreshToken) return response.status(409).json({message: "no refreshToken"});
    if(!refreshTokens.includes(refreshToken)) return response.sendStatus(403);
    else {
        jwt.verify(refreshToken, process.env.ACCESS_REFRESH_TOKEN_SECRET, (error, user)=>{
            if (error) return response.sendStatus(403);
            //const accessToken = generateAccessToken({name: user.name});
            console.log('==============after jwt verify=============')
            console.dir(user);

            //이걸 그냥 로 하냐 아니냐에 따라서 똑같은 토큰이 나오고
            //user contains name, iat ...
            // so only use name : user.name as argument without iat
            const newAccessToken = generateAccessToken({name : user.name});
            return response.json({newAccessToken : newAccessToken});
        });
    }
});

module.exports = router;

