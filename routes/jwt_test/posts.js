const router = require('express').Router();
const jwt = require('jsonwebtoken');

const posts = [
    {
        name: 'mmh',
        subject: 'javascript'
    },
    {
        name: 'ssh',
        subject: 'kotlin'
    }
];
function authenticationToken(request, response, next){
//    verify the accessToken
//    token comes from the header
//    object key name is auto transformed from Upper case to lower case
    const authorizationHeader = request.headers['authorization'];
    const token = authorizationHeader && authorizationHeader.split(' ')[1];

    if(token === null) return response.sendStatus(401);

    //when use 403
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user)=>{
        if(error) {
            console.error(error);
            return response.status(403).json({message : "your token is no longer valid"});
        }
        request.user = user;
        next();
    });
}


router.get('/', authenticationToken, (request, response)=>{
    const targetPost = posts.find(post=> post.name === request.user.name)
    if(!targetPost) return response.status(409).json({message: "success to verify token from you but there is no user you indicate"});
    else return response.status(200).json(targetPost);
})

router.use('/login', require('./login'));


module.exports = router;