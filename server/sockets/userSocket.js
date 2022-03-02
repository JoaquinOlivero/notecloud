const UserSocket = (io) => {

    io.on("connection", (socket) => {

        
        // Container.jsx
        socket.on('loginUser', (data) =>{
            try {
                if (data) {
                    socket.username = data.username
                    socket.notecloudId = data.id
                }
            } catch (error) {
                console.log(error)
            }
        })


        // TextEditor.jsx
        socket.on('connectToTextEditorRoom', async (noteUuid) => {
            await socket.join(noteUuid)

            const getClientsInRoom = () =>{
                const clients = io.sockets.adapter.rooms.get(noteUuid);
                const users = [];
                for (let [id, socket] of io.of("/").sockets) {
                    users.push({userID: id, notecloudId: socket.notecloudId, username: socket.username});
                }
                const activeUsersArr = []
                if (clients) {
                    for (const client of clients) {
                        const user = users.find(user => user.userID === client)
                        activeUsersArr.push(user)
                    }
                }

                return activeUsersArr
            }

            io.to(noteUuid).emit('activeUsers', getClientsInRoom()) // send active users
        })

        socket.on('textEditorData', (data) =>{
            // socket.to(data.url).emit('externalBlocks', data.savedData)// every socket in the room excluding the sender will get the event.
            socket.to(data.currentBlockData.url).emit('externalBlocks', data)// every socket in the room excluding the sender will get the event.
        })

        socket.on('leaveTextEditorRoom', async (noteUuid) =>{
            await socket.leave(noteUuid)
            const clients = io.sockets.adapter.rooms.get(noteUuid);
            const users = [];
            for (let [id, socket] of io.of("/").sockets) {
                users.push({userID: id, notecloudId: socket.notecloudId, username: socket.username});
            }
            const activeUsersArr = []
            if (clients) {
                for (const client of clients) {
                    const user = users.find(user => user.userID === client)
                    activeUsersArr.push(user)
                }
            }

            // ActiveUsers.jsx
            io.to(noteUuid).emit('activeUsers', activeUsersArr) // send active users
        })


        // SharedNotes.jsx
        socket.on('connectToNotebookRoom', (id)=>{
            socket.join(id)
            
        })
        socket.on('updateSharedNotesState', (data)=>{
            socket.to(data.uuid).emit('triggerSharedNotesStateUpdate', data.sharedNotes) // every socket in the room excluding the sender will get the event.
        })

        socket.on('leaveNotebookRoom', (notebookUuid) =>{
            socket.leave(notebookUuid)
        })


        // Notification.jsx
        socket.on('sendNotification',(notificationData)=>{

            const users = [];
            for (let [id, socket] of io.of("/").sockets) {
                users.push({userID: id, notecloudId: socket.notecloudId});
            }
            try {
                const user = users.find(user => user.notecloudId == notificationData.user_uuid)
                socket.to(user.userID).emit('updateNotificationState', notificationData) // change socket.id for the userID corresponding to username
            } catch (error) {
                console.log(error)
            }
        })

        // io.of("/").adapter.on("join-room", (room, id) => {
        //     console.log(`socket ${id} has joined room ${room}`);
        // });

        io.of("/").adapter.on("leave-room", async (room, id) => {
            // console.log(`socket ${id} has left room ${room}`);
            const clients = io.sockets.adapter.rooms.get(room);
            const users = [];
            for (let [id, socket] of io.of("/").sockets) {
                users.push({userID: id, notecloudId: socket.notecloudId, username: socket.username});
            }
            const activeUsersArr = []
            if (clients) {
                for (const client of clients) {
                    const user = users.find(user => user.userID === client)
                    activeUsersArr.push(user)
                }
            }

            // ActiveUsers.jsx
            io.to(room).emit('activeUsers', activeUsersArr) // send active users
        });


        socket.on("disconnect", () => {
            // console.log('disconnected')
        });

    });

}

module.exports = UserSocket