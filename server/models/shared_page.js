module.exports = (sequelize, DataTypes) =>{
    const sharedPage = sequelize.define(
        "shared_page", {
            // Model attributes are defined here
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            blocks: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
            child_of:{
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: true,
            },
            shared_book_uuid:{
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            }
        }, {
            // Other model options go here
        }
    );

    return sharedPage;
}
