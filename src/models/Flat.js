module.exports = (sequelize, type) =>
    sequelize.define("flat", {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: type.STRING,
        access_id: type.STRING, // ids who had access to model
        assigned_by: type.INTEGER,
        object_id: type.INTEGER,
        building_id: type.INTEGER,
        section_id: type.INTEGER,
        floor_id: type.INTEGER,
        layout_id: type.INTEGER,
        status: type.STRING,
        place_number: type.INTEGER,

    });
