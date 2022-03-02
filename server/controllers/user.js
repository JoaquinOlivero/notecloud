const db = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.signUp = async (req, res) => {
    // Use User.create instead of User.build. Build is good for testing purposes because it does not save directly to the DB

    try {
        const user = await db.User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
        });

        if (user) {
            const token = jwt.sign({ id: user.uuid, username: user.username }, process.env.JWT_SECRET, {
                expiresIn: 86400 // 24 hours
            })
            const refreshToken = jwt.sign({ id: user.uuid, username: user.username }, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: 86400 // 24 hours
            })
            user.refreshToken = refreshToken
            await user.save();
            res.cookie('refreshToken', refreshToken, {
                maxAge: 1000 * 60 * 60 * 24, // 24 hours
                httpOnly: true,
                sameSite: 'Lax',
                signed: true,
                secret: process.env.COOKIE_SECRET
            })

            const page = await db.page.create({
                user_uuid: user.uuid,
                blocks: [{
                    type: 'pageTitle',
                    data: {
                        text: 'Welcome'
                    }
                }],
                child_of: null,
            })
            if (page) {
                res.status(200).send({
                    id: user.uuid,
                    jwt: token,
                    username: user.username
                })
            }
            
        };
    } catch (error) {
        res.sendStatus(400)
    }

};


module.exports.signIn = async (req, res) => {
    const user = await db.User.findOne({ where: { email: req.body.email } })
    if (user) {
        const validPassword = bcrypt.compareSync(req.body.password, user.password)
        if (!validPassword) {
            return res.status(401).send({
                message: 'Invalid Password',
                accesstoken: null
            })
        }
        const token = jwt.sign({ id: user.uuid, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 hours
        })
        const refreshToken = jwt.sign({ id: user.uuid, username: user.username }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: 86400 // 24 hours
        })
        user.refreshToken = refreshToken
        await user.save();
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24, // 24 hours
            httpOnly: true,
            sameSite: 'Lax',
            signed: true,
            secret: process.env.COOKIE_SECRET
        })
        res.status(200).send({
            id: user.uuid,
            jwt: token,
            username: user.username
        })

    } else {
        res.status(404).send({
            message: 'Email not found'
        })
    }
}

module.exports.refreshToken = async (req, res) => {
    const user = req.user
    if (user) {
        const token = jwt.sign({ id: user.uuid, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 hours
        })
        const refreshToken = jwt.sign({ id: user.uuid, username: user.username }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: 86400 // 24 hours
        })
        user.refreshToken = refreshToken
        await user.save()
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24, // 24 hours
            httpOnly: true,
            sameSite: 'none',
            signed: true,
            secret: process.env.COOKIE_SECRET
        })
        res.status(200).send({
            id: user.uuid,
            jwt: token,
            username: user.username
        })
    }
}

module.exports.logout = async (req, res) => {
    const user = req.user
    if (user) {
        user.refreshToken = null
        user.save()
        res.clearCookie('refreshToken')
        res.status(200).send({ message: `${user.username} Successfully signed out!` })
    }
}

module.exports.deleteUser = async (req, res) => {
    const {uuid} = req.user
    const user = await db.User.destroy({ where: { uuid: uuid, }, });

    if (user) {
        res.clearCookie('refreshToken')
        res.status(201).send({
            message: 'User deleted successfully'
        })

    }
};


module.exports.createUserNotificationAddedToSharedNotebook = async (req, res) => {
    const {uuid} = req.user
    const {added_user_uuid, shared_book_uuid,shared_book_title} = req.body
    if (added_user_uuid && shared_book_uuid && shared_book_title) {
        try {
            const book = await db.sharedBook.findByPk(shared_book_uuid)
            if (book && book.admin_uuid === uuid) {
                try {
                    const admin = await db.User.findByPk(uuid, {
                        attributes: ['username']
                    })

                    const notification = await db.userNotification.create({
                        user_uuid: added_user_uuid,
                        text: `<span>${admin.username}</span> added you to <span>${shared_book_title}</span> notes group!`
                    })
                    res.status(200).send(notification)
                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

};


module.exports.getUserNotifications = async (req, res) => {
    const {uuid} = req.user
    if (uuid) {
       try {
           const user = await db.User.findByPk(uuid, {
               include:[{
                   model: db.userNotification,
                   as: 'user_notification',
                   attributes: ['user_uuid', 'text', 'uuid', 'createdAt']
               }],
               order: [['user_notification', 'createdAt']]
           })

           res.status(200).send(user.user_notification)
       } catch (error) {
           console.log(error)
       }
    }

};

module.exports.deleteUserNotifications = async (req, res) => {
    const {uuid} = req.user
    if (uuid) {
       try {
           const notifications = await db.userNotification.findAll({
               where:{
                   user_uuid: uuid
               }
           })
           
            if (notifications.length > 0) {
                for (const notification of notifications) {
                    const notificationToDelete = await db.userNotification.findByPk(notification.uuid)
                    notificationToDelete.destroy()
                }
            }

           res.sendStatus(200)
       } catch (error) {
           console.log(error)
       }
    }

};