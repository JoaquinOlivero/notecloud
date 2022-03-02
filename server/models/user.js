module.exports = (sequelize, DataTypes) =>{
    const User = sequelize.define(
        "user", {
            // Model attributes are defined here
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            refreshToken: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            // Other model options go here
        }
    );
    
    return User;
}
