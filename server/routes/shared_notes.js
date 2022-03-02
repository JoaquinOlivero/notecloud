const express = require("express");
const router = express.Router();

// Controllers
const sharedNotesController = require("../controllers/shared_notes");

// Middleware
const { verifyToken } = require('../middleware/authJwt')

// Routes
router.post("/create", verifyToken, sharedNotesController.createSharedNotes);
router.post("/single", verifyToken, sharedNotesController.singleSharedPage);
router.post("/save", verifyToken, sharedNotesController.saveSharedPage);
router.post("/add-to-book", verifyToken, sharedNotesController.addUserToSharedBook);
router.post("/new-shared-page", verifyToken, sharedNotesController.newSharedPage);
router.post("/delete-shared-page", verifyToken, sharedNotesController.deleteSharedPage);
router.post("/search_user", verifyToken, sharedNotesController.searchUser);
router.post("/delete-book", verifyToken, sharedNotesController.deleteSharedNotes);



module.exports = router;