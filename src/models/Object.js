

module.exports = (sequelize, type) => sequelize.define('object', {
    id: {
      type: type.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    access_id: type.STRING, // ids who had access to model
    assigned_by: type.INTEGER,
    type: type.STRING,
    name: type.STRING,
    address: type.STRING,
    currency: type.STRING,
    sales_address: type.STRING,
    description: type.STRING, 
    place_number: type.INTEGER,
    buildings_json: type.TEXT('long'),
    interactive_image: type.STRING,
  });