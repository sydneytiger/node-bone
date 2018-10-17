const jwt = require('jsonwebtoken');
const config = require('config');

// middleware checking if a user is authenticated
module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('No token proivde');

    try{
        const decode = jwt.verify(token, config.get('authTokenKey'));
        req.user = decode;
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid token');
    }

}