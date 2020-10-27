module.exports = (sequelize, type) =>
    sequelize.define("floor", {
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
        floor_number: type.INTEGER,
        floor_layout_image: type.STRING,
        layout_id: type.INTEGER,
        place_number: type.INTEGER,
        flats_json: type.TEXT("long"),
        interactive_image_flats: type.STRING,
    });
