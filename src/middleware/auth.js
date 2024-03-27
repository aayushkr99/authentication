
const jwt = require('jsonwebtoken');
const config = require('../config/config.json')


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).send({status : false, message : "Unauthorized"});

    jwt.verify(token, config.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send({status : false, message : "Forbidden" });
        req.user = user;
        next();
    });
};


const authorizeRoles = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.sendStatus(403);
        }
        next();
    };
};

module.exports = {authenticateToken, authorizeRoles} 
