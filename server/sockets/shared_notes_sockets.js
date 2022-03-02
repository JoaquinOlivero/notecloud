const sharedNotesSockets = (io) => {

    io.on("connection", (socket) => {

        socket.on('connectToTextEditorRoom', async (noteUuid) => {
            await socket.join(noteUuid)
            // const clients = io.sockets.adapter.rooms.get(noteUuid);
            io.to(noteUuid).emit('activeUsers', 'hello testing this')
        })

        socket.on('connectToNotebookRoom', (id)=>{
            socket.join(id)
            
        })

        socket.on('textEditorData', (data) =>{
            socket.to(data.url).emit('externalBlocks', data.savedData)// every socket in the room excluding the sender will get the event.
        })
        
        socket.on('updateSharedNotesState', (data)=>{
            socket.to(data.uuid).emit('triggerSharedNotesStateUpdate', data.sharedNotes) // every socket in the room excluding the sender will get the event.
        })
      

    });

}

module.exports = sharedNotesSockets