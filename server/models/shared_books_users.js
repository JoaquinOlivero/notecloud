module.exports = (sequelize, DataTypes) =>{
    const sharedBooksUsers = sequelize.define(
        "shared_books_users", {
            // Model attributes are defined here
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            sharedBookUuid:{
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
            userUuid:{
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
        }, {
            // Other model options go here
        }
    );
    
    return sharedBooksUsers;
}