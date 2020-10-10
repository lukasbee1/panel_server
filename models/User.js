module.exports = (sequelize, type) => sequelize.define('user', {
    id: {
      type: type.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_name: type.STRING,
    password: type.STRING,
    forget_token: type.STRING,
    assigned_by: type.INTEGER,
    user_type:  type.STRING,
    email: type.STRING,
    register_token: type.STRING,
    object_owner: type.INTEGER,
  });