const userNotificationSockets = (io) => {

    io.on("connection", (socket) => {
        
        socket.on('loginUser', (data) =>{
            socket.username = data.username
            socket.notecloudId = data.id
        })


        socket.on('sendNotification',(notificationData)=>{
            const users = [];
            for (let [id, socket] of io.of("/").sockets) {
                users.push({userID: id, notecloudId: socket.notecloudId});
            }

            try {
                const user = users.find(user => user.notecloudId == notificationData.user_uuid)
                socket.to(user.userID).emit('updateNotificationState', notificationData) // change socket.id for the userID corresponding to username
            } catch (error) {
                
            }
        })

        socket.on("disconnect", () => {
            // console.log('disconnected')
        });

        

    });

}

module.exports = userNotificationSockets