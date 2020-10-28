
const jwt = require('jsonwebtoken');
const config = require("./config");

module.exports = (req, res, next) => {
    //headetrs token 

    try {
        const token = req.headers.token.split(" ")[1];
        console.log(req.headers.token);
        const decoded = jwt.verify(token, config.JWT_PRIVATE_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 401,
            message: 'You are not allowed to reach this endpoint without being authenticated',
            error: true
        });
    }
}