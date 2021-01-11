const jwt = require('jsonwebtoken');

let verifyToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    msg: 'invalid token'
                }
            });
        }

        req.user = decoded.user;
        next();

    });

};


let verifyAdminRole = (req, res, next) => {

    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    }
    else {
        return res.status(400).json({
            ok: false,
            err: {
                msg: 'user is not admin'
            }
        });
    }

};

module.exports = {
    verifyToken,
    verifyAdminRole
}