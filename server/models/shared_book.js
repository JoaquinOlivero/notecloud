module.exports = (sequelize, DataTypes) =>{
    const sharedBook = sequelize.define(
        "shared_book", {
            // Model attributes are defined here
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING(1234),
                defaultValue: 'Shared Notes',
                allowNull: false,
            },
            admin_uuid:{
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            }
        }, {
            // Other model options go here
        }
    );
    
    return sharedBook;
}