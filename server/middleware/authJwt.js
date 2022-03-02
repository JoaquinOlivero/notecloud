const jwt = require("jsonwebtoken");
const User = require("../models/user");
const db = require("../models/index");

module.exports.verifyToken = async (req, res, next) => {
    const { refreshToken } = req.signedCookies
    // const bearerHeader = req.headers['authorization'] // Bearer Auth. jwt token, not the same token as refresh token but they have the same info.

    if (!refreshToken) {
        return res.status(401).send({ message: "Unauthorized!" });
    }

    // Verify tokens
    // if (refreshToken && typeof bearerHeader !== 'undefined') {
    //     try {
    //         const bearer = bearerHeader.split(' ');
    //         const bearerToken = bearer[1]

    //         const verifyRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    //         const verifyBearerToken = jwt.verify(bearerToken, process.env.JWT_SECRET);
    //         const compareTokens = verifyBearerToken.id === verifyRefreshToken.id
    //         if (compareTokens) {
    //             const user = await User.findByPk(verifyRefreshToken.id)
    //             req.user = user
    //             next();
    //         }

    //     } catch (err) {
    //         res.status(401).send({ message: "Invalid Token" });
    //     }
    // } else return res.status(401).send({ message: "Unauthorized!" });

    if (refreshToken) {
        try {
            const verifyRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const user = await db.User.findByPk(verifyRefreshToken.id)
            req.user = user
            next();
        } catch (err) {
            res.status(401).send({ message: "Invalid Token" });
        }
    } else return res.status(401).send({ message: "Unauthorized!" });

};