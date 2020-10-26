const Sequelize = require("sequelize");
const ObjectModel = require("./models/Object");
const UserModel = require("./models/User");
const FlatModel = require("./models/Flat");
const BuildingModel = require("./models/Building");
const LayoutModel = require("./models/Layout");
const FloorModel = require("./models/Floor");
const SectionModel = require("./models/Section");

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

sequelize
    .query("SET FOREIGN_KEY_CHECKS = 0")
    .then(() =>
        sequelize.sync({
            force: false,
        })
    )
    .then(() => sequelize.query("SET FOREIGN_KEY_CHECKS = 1"))
    .then(() => {
        User.findOrCreate({
            where: {
                id: 0,
                user_name: "1",
                password: "1",
                assigned_by: 0,
                role: "super_admin",
                email: "foks0605@gmail.com",
                register_token: null,
            },
        });
        Object.findOrCreate({
            where: {
                id: 1,
                access_id: "0, 1, 2, 12, 112, 43, 54, 33",
                assigned_by: 0,
                name: "Променад",
                type: "Жилой комплекс",
                address: "Есенина",
                sales_address: "Есенина 9"
            },
        });
       
    })
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
