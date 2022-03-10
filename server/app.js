if (process.env.NODE_ENV !== "production") {
    // Load environment variables from .env file in non prod environments
    require("dotenv").config();
}
// Packages
const express = require("express");
const app = express();
const PORT = process.env.PORT
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const socketIo = require("socket.io");
const fs = require('fs');

// Cloudflare certificates
const serverOptions = {
    key: fs.readFileSync('./cert/api.notecloud.xyz.key'),
    cert: fs.readFileSync('./cert/api.notecloud.xyz.pem')
}

// Socket.io files
const UserSocket = require('./sockets/userSocket')

// CORS
const corsOptions = {
    origin: process.env.WHITELISTED_DOMAINS,
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true,
};
//

app.use(cookieparser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());

app.use(express.json()); // express json parser
app.use(express.urlencoded({
    extended: true
}));
app.use(cors(corsOptions));

// Routes
const userRoutes = require("./routes/user");
const notesRoutes = require('./routes/notes')
const sharedNotesRoutes = require('./routes/shared_notes')

// Use Routes
app.use("/user", userRoutes);
app.use("/notes", notesRoutes)
app.use("/shared_notes", sharedNotesRoutes)

const server = https.createServer(serverOptions, app);

const io = socketIo(server,{
    cors:{
        origin: process.env.WHITELISTED_DOMAINS,
    }
});

UserSocket(io)

server.listen(PORT)