module.exports = (sequelize, DataTypes) =>{
    const userNotification = sequelize.define(
        "user_notification", {
            // Model attributes are defined here
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            text: {
                type: DataTypes.STRING(1234),
                allowNull: false,
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

    return userNotification;
}