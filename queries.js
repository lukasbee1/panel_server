var nodemailer = require("nodemailer");
const {
    User,
    Object,
    Section,
    Flat,
    Building,
    Floor,
    Layout,
} = require("./sequelize");
const { b64EncodeUnicode, b64DecodeUnicode } = require("./Utils/encode");

const { Sequelize } = require("sequelize");

const Op = Sequelize.Op;

// const getUsers = (req, res) => {
//   User.findAll()
//     .then((users) => {
//       res.json(users);
//     });
// };
const models = {
    user: User,
    object: Object,
    section: Section,
    flat: Flat,
    building: Building,
    floor: Floor,
    layout: Layout,
};
const createUser = (req, res) => {
    const token = b64EncodeUnicode(Date.now());
    // send mail
    // https://www.w3schools.com/nodejs/nodejs_email.asp
};
const verifyUser = (req, res) => {
    // if token exist => register
};

const login = (req, res) => {
    const { login, password } = req.body;
    return User.findOne({
        where: {
            login,
        },
    })
        .then((user) => {
            if (user) {
                if (user.password === password) {
                    const token = b64EncodeUnicode();
                    res.send({
                        id: user.id,
                        user_type: user.user_type,
                        assigned_by: user.assigned_by,
                    });
                } else res.send({ error: "invalid email or password" });
            } else {
                res.send({ error: "invalid email or password" });
            }
        })
        .catch((error) => {
            console.log(
                `There has been a problem with your fetch operation: ${error.message}`
            );
            throw error;
        });
};

const deleteAnything = (req, res) => {
    const { type, userId, objectId } = req.params;

    if (!objectId || !type || !userId) {
        return res.send({ error: "Nothing to delete" });
    }
    return models[type]
        .findOne({
            where: {
                [Op.and]: [
                    type !== "user"
                        ? {
                              [Op.or]: [
                                  {
                                      access_id: {
                                          [Op.like]: `%, ${userId}`,
                                      },
                                  },
                                  {
                                      access_id: {
                                          [Op.like]: `${userId},%`,
                                      },
                                  },
                                  {
                                      access_id: {
                                          [Op.like]: `%${userId},%`,
                                      },
                                  },
                              ],
                          }
                        : null,
                    {
                        id: objectId,
                    },
                ],
            },
        })
        .then((object) => {
            object.destroy();
            res.send(object);
        })
        .catch((error) => {
            console.log(
                `There has been a problem with your fetch operation: ${error.message}`
            );
            res.send({ error });
            throw error;
        });
};

const getAnything = (req, res) => {
    // const { id } = req.body;
    const { type, objectId = null, userId } = req.params;
    let { object_id, building_id, section_id, floor_id } = req.query;
    object_id = +object_id;
    return models[type]
        .findAll({
            where: {
                [Op.and]: [
                    type !== "user"
                        ? {
                              [Op.or]: [
                                  {
                                      access_id: {
                                          [Op.like]: `%, ${userId}`,
                                      },
                                  },
                                  {
                                      access_id: {
                                          [Op.like]: `${userId},%`,
                                      },
                                  },
                                  {
                                      access_id: {
                                          [Op.like]: `%${userId},%`,
                                      },
                                  },
                              ],
                          }
                        : null,
                    object_id
                        ? {
                              object_id: object_id,
                          }
                        : null,
                    building_id
                        ? {
                              building_id: building_id,
                          }
                        : null,
                    ,
                    section_id
                        ? {
                              section_id: section_id,
                          }
                        : null,
                    ,
                    floor_id
                        ? {
                              floor_id: floor_id,
                          }
                        : null,
                    objectId
                        ? {
                              id: objectId,
                          }
                        : null,
                ],
            },
        })
        .then((data) => {
            const resp = data.map((obj) => {
                delete obj.dataValues.assigned_by;
                delete obj.dataValues.access_id;
                delete obj.dataValues.createdAt;
                delete obj.dataValues.updatedAt;
                return obj.dataValues;
            });
            res.send(resp);
        })
        .catch((error) => {
            console.log("catch");
            console.log(
                `There has been a problem with your fetch operation: ${error.message}`
            );
            throw error;
        });
};
const createAnything = (req, res) => {
    const { name, assigned_by } = req.body;

    const { type, userId, objectId } = req.params;
    if (objectId) {
        models[type]
            .findOne({
                where: {
                    [Op.and]: [
                        type !== "user"
                            ? {
                                  [Op.or]: [
                                      {
                                          access_id: {
                                              [Op.like]: `%, ${userId}`,
                                          },
                                      },
                                      {
                                          access_id: {
                                              [Op.like]: `${userId},%`,
                                          },
                                      },
                                      {
                                          access_id: {
                                              [Op.like]: `%${userId},%`,
                                          },
                                      },
                                  ],
                              }
                            : null,
                        { id: objectId },
                    ],
                },
            })
            .then((obj) => {
                delete obj.dataValues.id;
                return obj.dataValues;
            })
            .then((obj) => models[type].create(obj))
            .then((object) => {
                res.send(object);
            })
            .catch((error) => {
                console.log(
                    `There has been a problem with your fetch operation: ${error.message}`
                );
                res.send({ error: "error with copy obj" });
                throw error;
            });
        return;
    }
    if (!name) {
        return res.send({ error: "Required field is empty!" });
    }
    const object = req.body;

    object.access_id = `0, ${userId}, ${assigned_by}`;
    return models[type]
        .create(object)
        .then((object) => {
            res.send(object);
            console.log(req.body);
            if (type === "building") {
                if (object.with_sections) {
                    console.log("here");
                    let sections = [];
                    for (let i = 0; i < object.sections_count; i++) {
                        let section = {
                            name: "Секция №" + (i + 1),
                            assigned_by: userId,
                            building_id: object.id,
                            object_id: object.object_id,
                            access_id:  `0, ${userId}, ${assigned_by}`
                        };
                        sections.push(section);
                    }
                    console.log("truing to create sections");
                    console.log(sections);
                    return Section.bulkCreate(sections);
                } else return null;
            }
        })
        .then((sections) => {
            if (sections) {
                let floors = [];
                for (let i = 0; i < sections.length; i++) {
                    for (let j = 0; j < object.floors_count; j++) {
                        let floor = {};
                        floor.name = "Этаж №" + (j + 1);
                        floor.assigned_by = userId;
                        floor.access_id =  `0, ${userId}, ${assigned_by}`
                        floor.object_id = object.object_id;
                        floor.building_id = sections[i].dataValues.building_id;
                        floor.section_id = sections[i].dataValues.id;
                        floor.floor_number = j + 1;
                        floors.push(floor);
                    }
                }
                console.log("trying to create floors");
                console.log(floors);
                return Floor.bulkCreate(floors);
            } else return null;
        })
        .then((flatsObj) => {
            let flats = [];
            for (let i = 0; i < object.sections_count; i++) {
                for (let j = 0; j < object.floors_count; j++) {
                    let flat = {};
                    flat.name = "Квартира №" + (j + 1) * (i + 1);
                    flat.assigned_by = userId;
                    flat.access_id =  `0, ${userId}, ${assigned_by}`
                    flat.object_id = object.object_id;
                    flat.building_id = flatsObj[i].dataValues.building_id;
                    flat.section_id = flatsObj[i].dataValues.id;
                    flat.floor_number = j + 1;
                    flat.flat_number = object.first_flat_number + i * (j + 1);
                    flats.push(flat);
                }
            }
            console.log(flats);
            return Flat.bulkCreate(flats);
        })

        .catch((error) => {
            console.log(
                `There has been a problem with your fetch operation: ${error.message}`
            );
            throw error;
        });
};

const updateAnything = (req, res) => {
    const { type, objectId, userId } = req.params;

    if (!objectId) {
        return res.send({ error: "Required field is empty!" });
    }
    const object = req.body;
    object.id = +objectId;
    return models[type]
        .findOne({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            {
                                access_id: {
                                    [Op.like]: `%, ${userId}`,
                                },
                            },
                            {
                                access_id: {
                                    [Op.like]: `${userId},%`,
                                },
                            },
                            {
                                access_id: {
                                    [Op.like]: `%${userId},%`,
                                },
                            },
                        ],
                    },
                    { id: objectId },
                ],
            },
        })
        .then((obj) => {
            models[type].upsert(object);
            return object;
        })
        .then((object) => {
            res.send(object);
        })
        .catch((error) => {
            console.log(
                `There has been a problem with your fetch operation: ${error.message}`
            );
            throw error;
        });
};

module.exports = {
    createUser,
    verifyUser,
    login,
    deleteAnything,
    updateAnything,
    getAnything,
    createAnything,
};
