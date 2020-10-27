module.exports = (sequelize, type) => sequelize.define('flat_layout', {
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
    square: type.INTEGER,
    image: type.STRING,
    place_number: type.INTEGER,
  });