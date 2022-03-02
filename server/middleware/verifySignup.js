const User = require("../models/user");
const db = require("../models/index");

module.exports.checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        // Check email
        const userEmail = await db.User.findOne({ where: { email: req.body.email } })

        // Check username
        const username = await db.User.findOne({ where: { username: req.body.username } })
        if (userEmail && username) {
            res.status(409).send({
                code: 1,
                message: 'Email and Username already in use'
            })
            return;
        } else if (userEmail) {
            res.status(409).send({
                code: 2,
                message: 'Email already in use'
            })
            return;
        } else if (username) {
            res.status(409).send({
                code: 3,
                message: 'Username already in use'
            })
            return;
        }

        next()
    } catch (error) {
        res.sendStatus(400)
    }
}