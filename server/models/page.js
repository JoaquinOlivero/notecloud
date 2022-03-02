module.exports = (sequelize, DataTypes) =>{
    const page = sequelize.define(
        "page", {
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
            user_uuid:{
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            }
        }, {
            // Other model options go here
        }
    );

    return page;
}
