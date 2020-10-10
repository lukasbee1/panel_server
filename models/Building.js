module.exports = (sequelize, type) =>
    sequelize.define("building", {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        access_id: type.STRING, // ids who had access to model
        assigned_by: type.INTEGER,
        object_id: type.INTEGER,
        name: type.STRING,
        address: type.STRING,
        construction_stage: type.STRING,
        construction_start_quater: type.STRING,
        construction_start_year: type.STRING,
        construction_end_quater: type.STRING,
        construction_end_year: type.STRING,
        with_sections: type.BOOLEAN,
        sections_count: type.INTEGER,
        floors_count: type.INTEGER,
        first_flat_number: type.INTEGER,
        preview_image: type.STRING,
        description: type.STRING,
        place_number: type.INTEGER,
    });
