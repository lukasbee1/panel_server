const Sequelize = require("sequelize");
const ObjectModel = require("./models/Object");
const UserModel = require("./models/User");
const FlatModel = require("./models/Flat");
const BuildingModel = require("./models/Building");
const LayoutModel = require("./models/Layout");
const FloorModel = require("./models/Floor");
const SectionModel = require("./models/Section");

// const SocketModel = require('../models/Socket');

const sequelize = new Sequelize("db", "dev", "root", {
    host: "localhost",
    dialect: "mysql",
    define: {
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: true,
    },
});
const User = UserModel(sequelize, Sequelize);
const Object = ObjectModel(sequelize, Sequelize);
const Flat = FlatModel(sequelize, Sequelize);
const Building = BuildingModel(sequelize, Sequelize);
const Layout = LayoutModel(sequelize, Sequelize);
const Floor = FloorModel(sequelize, Sequelize);
const Section = SectionModel(sequelize, Sequelize);

// const UserRoom = sequelize.define('UserRoom', {});

// User.belongsToMany(Room, { through: UserRoom });
// Room.belongsToMany(User, { through: UserRoom });

// User.hasMany(Object, {
//     foreignKey: {
//         name: "assigned_by",
//         allowNull: false,
//     },
// });
// User.hasMany(Flat, {
//     foreignKey: {
//         name: "assigned_by",
//         allowNull: false,
//     },
// });
// User.hasMany(Floor, {
//     foreignKey: {
//         name: "assigned_by",
//         allowNull: false,
//     },
// });
// User.hasMany(Building, {
//     foreignKey: {
//         name: "assigned_by",
//         allowNull: false,
//     },
// });
// User.hasMany(Layout, {
//     foreignKey: {
//         name: "assigned_by",
//         allowNull: false,
//     },
// });
// User.hasMany(Object);
// Object.belongsTo(User, {
//     foreignKey: {
//         allowNull: false
//     },
// });
// Message.belongsTo(User, {
//     as: "sender",
//     foreignKey: "userId",
// });

sequelize
    .query("SET FOREIGN_KEY_CHECKS = 0")
    .then(() =>
        sequelize.sync({
            force: true,
        })
    )
    .then(() => sequelize.query("SET FOREIGN_KEY_CHECKS = 1"))
    .then(() => {
        // Room.findOrCreate({
        //     where: { name: "common", avatar: "img/group.png" },
        // })
        User.findOrCreate({
            where: {
                id: 0,
                user_name: "admin",
                password: "0605",
                forget_token: "",
                assigned_by: 0,
                user_type: "super_admin",
                email: "foks0605@gmail.com",
                register_token: null,
            },
        });
        Object.findOrCreate({
            where: {
                id: 1,
                access_id: "0, 1, 2, 12, 112, 43, 54, 33",
                assigned_by: 0,

            },
        });
        Object.findOrCreate({
            where: {
                id: 2,
                access_id: "2, 0, 12, 112, 43, 54, 33",
                assigned_by: 0,
            },
        });
        Object.findOrCreate({
            where: {
                id: 3,
                access_id: "2, 0",
                assigned_by: 0,
            },
        });
    })
    // .then(room => UserRoom.create({ userId: 1, roomId: room.id }))
    // .then(() => Message.create({ userId: 1, tweet: 'messadfadsfadfadf', roomId: 1 }))
    // .then(() => Message.create({ userId: 1, tweet: 'adsfdasfdsfds', roomId: 1 }))
    .then(
        () => {
            console.log("Database synchronised.");
        },
        (err) => {
            console.log(err);
        }
    );
module.exports = {
    User,
    Object,
    Flat,
    Floor,
    Layout,
    Section,
    Building,
};
