const jwt = require("jsonwebtoken");

module.exports.verify = (req, res, next) => {

    let token = req.headers.authorization;

    if(typeof token === "undefined"){
        return res.status(401).send({
            message: "No token provided"
        });
    }

    token = token.slice(7, token.length);

    jwt.verify(token, process.env.JWT_SECRET_KEY, function(error, decodedToken){

        if(error){
            return res.status(401).send({
                message: "Authentication failed"
            });
        }

        req.user = decodedToken;

        next();

    });

};

module.exports.verifyAdmin = (req, res, next) => {

    if(req.user.isAdmin){
        next();
    } else {
        return res.status(403).send({
            message: "Admin access required"
        });
    }

};