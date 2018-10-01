
// middleware checking if a user is admin
// this module should be used right after authentication middleware
module.exports = (req, res, next) => {
    if(!req.user) return res.status(401).send('user is NOT authenticated');
    if(!req.user.isAdmin) return res.status(403).send('Access denied. User is NOT authorised');

    next();
};