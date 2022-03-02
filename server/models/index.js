const { Sequelize, DataTypes } = require("sequelize");
// const User = require('./user')
// const MainPage = require('./mainPage')

// Connect to db
const sequelize = new Sequelize(
    "postgres://postgres:ABCD1234@129.151.113.181:5432/notecloud", {
        logging: false
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = require('./user')(sequelize, Sequelize);
db.page = require('./page')(sequelize, Sequelize);
db.sharedBook = require('./shared_book')(sequelize, Sequelize);
db.sharedPage = require('./shared_page')(sequelize, Sequelize);
db.sharedBooksUsers = require('./shared_books_users')(sequelize, Sequelize);
db.userNotification = require('./user_notification')(sequelize, Sequelize);

// One to Many relationship // ONE user can have MANY pages
db.User.hasMany(db.page, {as: 'pages', foreignKey: 'user_uuid'})
db.page.belongsTo(db.User,{
    foreignKey: 'user_uuid',
})

// One to Many relationship // ONE user can have MANY notifications
db.User.hasMany(db.userNotification, {as: 'user_notification', foreignKey: 'user_uuid'})
db.userNotification.belongsTo(db.User,{
    foreignKey: 'user_uuid'
})

// One to Many relationship // ONE shared_book can have MANY shared_pages
db.sharedBook.hasMany(db.sharedPage, {as: 'shared_pages', foreignKey: 'shared_book_uuid', onDelete: 'CASCADE'})
db.sharedPage.belongsTo(db.sharedBook,{
    foreignKey: 'shared_book_uuid',
})

// Many to Many relationship // MANY users can have MANY shared_books
db.sharedBook.belongsToMany(db.User, {through: 'shared_books_users'})
db.User.belongsToMany(db.sharedBook, {through: 'shared_books_users'})



db.sequelize.sync({ force: false, alter: true }).then(() => {
    console.log("Drop and re-sync db.");
  });

module.exports = db;