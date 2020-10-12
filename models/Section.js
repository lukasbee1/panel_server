
module.exports = (sequelize, type) => sequelize.define('section', {
    id: {
      type: type.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: type.STRING,
    access_id: type.STRING, // ids who had access to model
    building_id: type.INTEGER,
    object_id: type.INTEGER,
    place_number: type.INTEGER,
  });