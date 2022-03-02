const express = require("express");
const router = express.Router();

// Controllers
const userController = require("../controllers/user");

// Middleware
const signupMiddleware = require('../middleware/verifySignup')
const checkEmail = signupMiddleware.checkDuplicateUsernameOrEmail

const { verifyToken } = require('../middleware/authJwt')

// Routes
router.post("/signup", checkEmail, userController.signUp);
router.post('/signin', userController.signIn)
router.post('/refreshtoken', verifyToken, userController.refreshToken)
router.post('/logout', verifyToken, userController.logout)
router.delete("/delete", verifyToken, userController.deleteUser);
router.post("/notification-add-to-shared-notebook", verifyToken, userController.createUserNotificationAddedToSharedNotebook);
router.get("/notification", verifyToken, userController.getUserNotifications);
router.post("/delete-notification", verifyToken, userController.deleteUserNotifications);

module.exports = router;