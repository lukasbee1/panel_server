module.exports = (sequelize, type) =>
    sequelize.define("integration_config", {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        token: type.STRING,
        objects_id: type.STRING,
        email: type.STRING,
        created_by: type.INTEGER,
    });
