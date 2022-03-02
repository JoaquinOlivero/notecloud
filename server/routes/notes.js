const express = require("express");
const router = express.Router();

// Controllers
const notesController = require("../controllers/notes");

// Middleware
const { verifyToken } = require('../middleware/authJwt')

// Routes
router.post("/save", verifyToken, notesController.saveNotes);
router.post("/data", verifyToken, notesController.userNotes);
router.post("/single", verifyToken, notesController.singleNote);
router.post("/new", verifyToken, notesController.newNote);
router.post("/delete", verifyToken, notesController.deleteNote);
router.post("/search", verifyToken, notesController.searchNote);


module.exports = router;