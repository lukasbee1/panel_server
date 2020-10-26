var nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const sizeOf = require("image-size");
// const path = require("path");

const {
    User,
    Object,
    Section,
    Flat,
    Building,
    Floor,
    Layout,
    JSONdata,
} = require("./sequelize");
const { b64EncodeUnicode, b64DecodeUnicode } = require("./Utils/encode");
// fs = require("fs-extra");
const { Sequelize } = require("sequelize");
const { saveImage } = require("./Utils/saveImage");

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
// const createUser = (req, res) => {
//     const token = b64EncodeUnicode(Date.now());
//     // send mail
//     // https://www.w3schools.com/nodejs/nodejs_email.asp
// };
// const verifyUser = (req, res) => {
//     // if token exist => register
// };

const login = (req, res) => {
    const { user_name, password } = req.body;
    return User.findOne({
        where: {
            user_name: user_name,
        },
    })
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    error: new Error("User not found!"),
                });
            }
            if (password === user.dataValues.password) {
                const token = jwt.sign(
                    { userId: user.id },
                    "RANDOM_TOKEN_SECRET",
                    { expiresIn: "24h" }
                );
                res.status(200).json({
                    userId: user.id,
                    token: token,
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                error: error,
            });
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
                    let sections = [];
                    for (let i = 0; i < object.sections_count; i++) {
                        let section = {
                            name: "Секция №" + (i + 1),
                            assigned_by: userId,
                            building_id: object.id,
                            object_id: object.object_id,
                            access_id: `0, ${userId}, ${assigned_by}`,
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
                        floor.access_id = `0, ${userId}, ${assigned_by}`;
                        floor.object_id = object.object_id;
                        floor.building_id = sections[i].dataValues.building_id;
                        floor.section_id = sections[i].dataValues.id;
                        floor.flats_on_floor = object.flats_on_floor;
                        floor.floor_number = j + 1;
                        floors.push(floor);
                    }
                }
                console.log("trying to create floors");
                return Floor.bulkCreate(floors);
            } else return null;
        })
        .then((floorsObj) => {
            // console.log(floorsObj);
            let flats = [];
            let flatNum = object.first_flat_number;

            for (let i = 0; i < floorsObj.length; i++) {
                for (let j = 0; j < object.flats_on_floor; j++) {
                    let flat = {};
                    flat.name = "Квартира №" + flatNum;
                    flat.assigned_by = userId;
                    flat.access_id = `0, ${userId}, ${assigned_by}`;
                    flat.object_id = object.object_id;
                    flat.building_id = floorsObj[i].dataValues.building_id;
                    flat.section_id = floorsObj[i].dataValues.section_id;
                    flat.layout_id = null;
                    flat.floor_number = i + 1;
                    flat.floor_id = floorsObj[i].dataValues.id;
                    flat.flat_number = flatNum;
                    flats.push(flat);
                    flatNum++;
                }
            }
            return Flat.bulkCreate(flats);
        })

        .catch((error) => {
            console.log(
                `There has been a problem with your fetch operation: ${error.message}`
            );
            res.send(error);
            throw error;
        });
};
const updateFlats = (req, res) => {
    const { objectId, userId, buildingId } = req.params;
    let { layout_id, flatsIdies } = req.body;
    flatsIdies = flatsIdies.slice(1, -1);
    flatsIdies = flatsIdies.split(",");

    const flats = [];
    for (let j = 0; j < flatsIdies.length; j++) {
        let flat = {};
        flat.id = +flatsIdies[j];
        flat.layout_id = +layout_id;
        flats.push(flat);
    }
    return Flat.bulkCreate(flats, {
        fields: ["id", "layout_id"],
        updateOnDuplicate: ["layout_id"],
    })
        .then((data) => {
            res.send(data);
            console.log(data);
        })
        .catch((error) => {
            console.log(
                `There has been a problem with your fetch operation: ${error.message}`
            );
            res.send(error);
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
            return models[type].upsert(object);
        })
        .then((t) => {
            return models[type].findOne({
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
            });
        })
        .then((obji) => {
            console.log(obji);
            res.send(obji.dataValues);
        })
        .catch((error) => {
            console.log(
                `There has been a problem with your fetch operation: ${error.message}`
            );
            throw error;
        });
};

const uploadPhoto = (req, res) => {
    const { type, objectId, userId } = req.params;
    const { name, square } = req.query;
    console.log(req.files);

    const object = {};

    const date = Date.now();
    object.assigned_by = userId;
    object.object_id = objectId;
    object.access_id = `0, ${userId}`;
    object.name = name;
    object.square = square;
    object.image =
        "http://localhost:8080/public/" + userId + date + objectId + ".jpg";
    return models[type]
        .create(object)
        .then((object) => {
            console.log(object);
            // res.send(object);
            return object;
        })
        .then((object) => {
            // console.log(object);
            var path_temp = req.files.file.path;
            var filename = userId + date + objectId + ".jpg";
            saveImage(path_temp, filename);

            res.send(object);
            return object;
        })
        .catch((err) => {
            console.log("err: ", err);
            res.send("err: ", err);
        });
    // res.end('upload');

    // next();
};

// needs to updert object in what we add field with path image
const uploadInteractiveImage = (req, res) => {
    const { type, objectId, userId, data, interactive_type } = req.params;
    // const { data } = req.query; //
    const { files } = req;
    const dimensions = sizeOf(files.file.path);

    const extention =
        "." +
        files.file.originalFilename.split(".")[
            files.file.originalFilename.split(".").length - 1
        ];

    var path_temp = files.file.path;
    var filename =
        dimensions.width +
        "x" +
        dimensions.height +
        "xinteractive_" +
        interactive_type +
        "_image" +
        objectId +
        extention;

    saveImage(path_temp, filename);
    const object = {};
    object.id = objectId;
    switch (interactive_type) {
        case "object":
            object.interactive_image = filename;
            break;
        case "sections":
            object.interactive_image_sections = filename;
            break;
        case "floors":
            object.interactive_image_floors = filename;
            break;
        case "flats":
            object.interactive_image_flats = filename;
            break;
        default:
            break;
    }
    // object.interactive_image = filename;

    return models[type]
        .upsert(object)
        .then((t) => {
            return models[type].findOne({
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
            });
        })
        .then((obji) => {
            console.log(obji.dataValues);
            res.send(obji.dataValues);
        })
        .catch((err) => {
            console.log("err: ", err);
            res.send("err: ", err);
        });
};

module.exports = {
    // createUser,
    // verifyUser,
    login,
    deleteAnything,
    updateAnything,
    getAnything,
    createAnything,
    updateFlats,
    uploadPhoto,
    uploadInteractiveImage,
};
