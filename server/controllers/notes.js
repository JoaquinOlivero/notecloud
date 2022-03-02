// const { MainPage } = require('../models/index')
const db = require('../models/index')

module.exports.saveNotes = async (req, res) =>{
    // ================= TODO =================
    // PROTECT THESE ROUTES WITH VERIFY TOKEN THEN CHECK THAT req.user.uuid matches note.user_uuid
    const {savedData, url} = req.body
    const user_uuid = req.user.uuid
    if (savedData && url) {
        try {
            const uuid = req.body.url.substring(req.body.url.length - 36) //This uuid belongs to the uuid that shows up in the url
            const note = await db.page.findByPk(uuid)
            if (note) {
                if (!savedData.blocks.length || savedData.blocks[0].type !== 'pageTitle') {
                    note.blocks = [{
                        type: 'pageTitle',
                        data: {
                            text: 'Untitled'
                        }
                    }]
                    if (note.user_uuid === user_uuid) {
                        note.userUuid = user_uuid
                        note.save()
                        res.status(200)
                    }
                } else{
                    note.blocks = savedData.blocks
                    if (note.user_uuid === user_uuid) {
                        note.userUuid = user_uuid
                        note.save()
                        res.status(200)
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
        
    }
    
}

module.exports.userNotes = async (req, res) =>{
    const {uuid} = req.user

    try {
        
        const user = await db.User.findByPk(uuid, {
            include: [{
                model: db.page,
                as: 'pages',
                where: {child_of: null},
                attributes: ['uuid', 'blocks', 'createdAt', 'child_of'],
            },{
                model: db.sharedBook,
                attributes: ['uuid', 'title', 'admin_uuid', 'createdAt'],
                include: [{
                    model: db.sharedPage,
                    as: 'shared_pages',
                    attributes: ['uuid', 'child_of', 'blocks', 'shared_book_uuid' ,'createdAt']
                }],
                order:  ['shared_pages', 'createdAt'],
            }],
            order: [
                ['pages','createdAt'],
                [db.sharedBook, 'createdAt']
               
            ],
        })

        const sharedNotes = user.shared_books
        const pages = user.pages
        
        const pagesData = []

        for(let singleNote of pages) {

            // GET ALL SUB PAGES OF A PAGE
            const query = `WITH RECURSIVE user_pages AS (
                SELECT * FROM pages WHERE user_uuid=:id AND uuid=:mainId
                UNION ALL
                SELECT e.* FROM pages e, user_pages WHERE e.child_of = user_pages.uuid
            )
            SELECT * FROM user_pages`

            const page = await db.sequelize.query(query, {
                replacements: {id: uuid, mainId: singleNote.uuid},
                type: db.sequelize.QueryTypes.SELECT
            })
            const pageListToTree = (page) =>{
                const hashTable = Object.create(null);
                page.forEach(aData => hashTable[aData.uuid] = {...aData, sub_pages: []});
                const dataTree = [];
                page.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
                page.forEach(aData => {
                    
                    if(aData.child_of) hashTable[aData.child_of].sub_pages.push(hashTable[aData.uuid])
                    else dataTree.push(hashTable[aData.uuid])
                });
               
                return dataTree;
            }

            const tree = pageListToTree(page)
            const reduceTreeToObject = tree.reduce(obj => (obj))
            pagesData.push(reduceTreeToObject)
        }


        for (const [i, singleSharedBook] of sharedNotes.entries()) {

            const sharedPagesArray = singleSharedBook.shared_pages
            const sharedPageListToTree = async (page) =>{
                const hashTable = Object.create(null);
                page.forEach(aData => hashTable[aData.uuid] = {...aData.dataValues, sub_pages: []});
                const dataTree = [];
                page.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
                page.forEach(aData => {
                    
                    if(aData.child_of) hashTable[aData.child_of].sub_pages.push(hashTable[aData.uuid])
                    else dataTree.push(hashTable[aData.uuid])
                });

                return dataTree;
            }

            const tree = await sharedPageListToTree(sharedPagesArray)
            sharedNotes[i].dataValues.pages = tree
            
        }

        res.send([pagesData, sharedNotes])

    } catch (error) {
        console.log(error);
    }
}

module.exports.singleNote = async (req, res) =>{
    // ================= TODO =================
    // PROTECT THESE ROUTES WITH VERIFY TOKEN THEN CHECK THAT req.user.uuid matches note.user_uuid
    if (req.body.url) {
        
        try {
            const uuid = req.body.url.substring(req.body.url.length - 36) //This uuid belongs to the uuid that shows up in the url
            const note = await db.page.findByPk(uuid)
            if (note) {
                res.send(note)
            } else {
                const subPage = await db.SubPage.findByPk(uuid)
                res.send(subPage)
            }
            
        } catch (error) {
            res.send({msg: 404})
        }
    }

}

module.exports.newNote = async (req, res) =>{
    const {uuid} = req.user
    const page_uuid = req.body.uuid
    if (!page_uuid) {
        try {
            const note = await db.page.create({
                user_uuid: uuid,
                blocks: [{
                    type: 'pageTitle',
                    data: {
                        text: 'Untitled'
                    }
                }],
                child_of: null,
            })
        
            res.status(200).send(note)
        } catch (error) {
            console.log(error);
        }
    } else if (page_uuid) {
        try {
            const note = await db.page.create({
                user_uuid: uuid,
                blocks: [{
                    type: 'pageTitle',
                    data: {
                        text: 'Untitled'
                    }
                }],
                child_of: page_uuid,
            })
        
            res.status(200).send(note)
        } catch (error) {
            console.log(error);
        }
    }
    
}



module.exports.deleteNote = async (req,res) =>{
    // ================= TODO =================
    // PROTECT THESE ROUTES WITH VERIFY TOKEN THEN CHECK THAT req.user.uuid matches note.user_uuid
    const user_uuid = req.user.uuid 
    const page_uuid = req.body.uuid

    if (page_uuid) {
        try {
            const page = await db.page.findByPk(page_uuid)
            const pageParent = await db.page.findByPk(page.child_of,{
                attributes: ['uuid', 'blocks']
            })
            
            const query = `WITH RECURSIVE user_pages AS (
                SELECT * FROM pages WHERE user_uuid=:id AND uuid=:mainId
                UNION ALL
                SELECT e.* FROM pages e, user_pages WHERE e.child_of = user_pages.uuid
            )
            SELECT * FROM user_pages`
    
            const pages = await db.sequelize.query(query, {
                replacements: {id: user_uuid, mainId: page_uuid},
                type: db.sequelize.QueryTypes.SELECT
            })
    
            for (const page of pages) {
                const noteToDelete = await db.page.findByPk(page.uuid)
                noteToDelete.destroy()
            }
            if (pageParent) {
                res.status(200).send({title:pageParent.blocks[0].data.text, uuid: pageParent.uuid })
            } else {
                res.sendStatus(200)
            }
            
        } catch (error) {
            console.log(error);
        }

        
    }

}


module.exports.searchNote = async (req, res) =>{
    const {uuid} = req.user
    const {searchValue} = req.body
    

   if (searchValue) {
       const searchString = searchValue.replace(/'/g, "''");
        try {
            const searchQuery = `SELECT * FROM pages WHERE user_uuid=:uuid AND jsonb_path_exists(blocks, '$.** ? (@.type() == "string" && @ like_regex "${searchString}" flag "i")')`
            const searchResult = await db.sequelize.query(searchQuery, {
                replacements: {uuid: uuid},
                type: db.sequelize.QueryTypes.SELECT
            })
            res.status(200).send(searchResult)
        } catch (error) {
            console.log(error);
        }
   }
    
    
}