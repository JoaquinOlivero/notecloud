const db = require('../models/index')

module.exports.createSharedNotes = async (req, res) =>{
    const admin_uuid = req.user.uuid
    const {title} = req.body
    
    if (admin_uuid && title) {
        try {
            const sharedBook = await db.sharedBook.create({
                admin_uuid: admin_uuid,
                title: title,
            })

            await db.sharedBooksUsers.create({
                sharedBookUuid: sharedBook.uuid,
                userUuid: admin_uuid
            })
            // res.status(200).send(sharedBook)
            res.sendStatus(200)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports.addUserToSharedBook = async (req, res) =>{
    
    const admin_uuid = req.user.uuid
    const {friend_uuid, shared_book_uuid} = req.body

    if (friend_uuid && shared_book_uuid) {
        try {
            const shared_book = await db.sharedBook.findByPk(shared_book_uuid)
            if (shared_book.admin_uuid === admin_uuid) {
                const add = await db.sharedBooksUsers.create({
                    sharedBookUuid: shared_book_uuid,
                    userUuid: friend_uuid
                })
                if (add) {
                    res.sendStatus(200)
                }
                
            } else {
                res.sendStatus(401)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports.newSharedPage = async (req, res) =>{
    const {uuid} = req.user
    const {child_of, shared_book_uuid} = req.body
        
        if (!child_of && shared_book_uuid) {
            try {
                const note = await db.sharedPage.create({
                    shared_book_uuid: shared_book_uuid,
                    blocks: [{
                        type: 'pageTitle',
                        data: {
                            text: 'Untitled'
                        }
                    }],
                    child_of: null,
                })
                res.sendStatus(200)
            } catch (error) {
                console.log(error)
            }
        } else if (child_of && shared_book_uuid){
            try {
                const note = await db.sharedPage.create({
                    shared_book_uuid: shared_book_uuid,
                    blocks: [{
                        type: 'pageTitle',
                        data: {
                            text: 'Untitled'
                        }
                    }],
                    child_of: child_of,
                })
                res.sendStatus(200)
            } catch (error) {
                console.log(error)
            }
        }
    
}

module.exports.singleSharedPage = async (req, res) =>{
    const {uuid} = req.body

    if (uuid) {
        try {
            const note = await db.sharedPage.findByPk(uuid)
            res.send(note)
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports.saveSharedPage = async (req, res) =>{
    const {savedData, url} = req.body

    if (savedData && url) {
        try {
            const uuid = url
            const note = await db.sharedPage.findByPk(uuid)
            if (note) {
                if (!savedData.blocks.length || savedData.blocks[0].type !== 'pageTitle') {
                    note.blocks = [{
                        type: 'pageTitle',
                        data: {
                            text: 'Untitled'
                        }
                    }]
                    note.save()
                    res.sendStatus(200)
                } else{
                    note.blocks = savedData.blocks
                    note.save()
                    res.sendStatus(200)
                }
            }
        } catch (error) {
            console.log(error);
        }
        
    }
    
}

module.exports.deleteSharedPage = async (req, res) =>{
    const {uuid} = req.user
    const {shared_page_uuid} = req.body
    if (shared_page_uuid) {
        
        try {
            const sharedPage = await db.sharedPage.findByPk(shared_page_uuid)
            const sharedPageChildren = await db.sharedPage.findAll({
                where: {
                    child_of: shared_page_uuid
                }
            })
            const pageParent = await db.sharedPage.findByPk(sharedPage.child_of, {
                attributes: ['uuid']
            })
            if (sharedPageChildren.length > 0) {
                for (const page of sharedPageChildren) {
                    const pageToDelete = await db.sharedPage.findByPk(page.uuid)
                    pageToDelete.destroy()
                }
            }
            sharedPage.destroy()
            if (pageParent) {
                res.status(200).send(pageParent)
            } else {
                res.sendStatus(200)
            }
        } catch (error) {
            console.log(error)
        }
    }
}


module.exports.searchUser = async (req, res) =>{
    const {uuid} = req.user
    const {searchValue} = req.body
    

   if (searchValue) {
        try {
            const searchResult = await db.User.findAll({
                where:{
                    username: {
                        [db.Sequelize.Op.iRegexp]: `${searchValue}`
                    }
                },
                attributes: ['username', 'uuid'],
                limit: 5,
                order: ['username']
            })
            res.status(200).send(searchResult)
        } catch (error) {
            console.log(error);
        }
   }
    
    
}


module.exports.deleteSharedNotes = async (req, res) =>{
    const {uuid} = req.user
    const {sharedBook} = req.body
    
    if (sharedBook) {
            try {
                if (sharedBook.admin_uuid === uuid) {
                    const sharedNotebook = await db.sharedBook.findByPk(sharedBook.uuid)
                    sharedNotebook.destroy()
                }
                res.sendStatus(200)
            } catch (error) {
                console.log(error);
            }
    }
}
