const express = require("express");
const auth = require('./src/middlewares/auth');
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const formData = require("express-form-data");
const cors = require("cors");
const {
    login,
    deleteAnything,
    updateAnything,
    getAnything,
    createAnything,
    updateFlats,
    uploadPhoto,
    uploadInteractiveImage,
} = require("./src/queries");

const multer = require("multer");

app.use(cors());

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());
app.use(formData.parse());
app.use("/public", express.static(path.join(__dirname, "public")));

server.listen(8080, () => {
    console.log("Server started on 8080");
});
app.get("/inviteUser",  auth, () => {});
app.post('/login', login);


const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function(req, file, cb){
       cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
    }
 });

 const upload = multer({
   storage: storage,
   limits:{fileSize: 1000000},
}).single('photo');

app.delete("/delete/:type/:userId/:objectId", auth, deleteAnything);
app.get("/get/:type/:userId/:objectId?", auth, getAnything);
app.put("/update/:type/:userId/:objectId", auth, updateAnything);
app.put("/updateFlats/:userId/:objectId/:buildingId", auth, updateFlats);
app.post("/create/:type/:userId/:objectId?", auth, createAnything);

app.post("/upload/:type/:userId/:objectId/:name?/:square?", upload, auth, uploadPhoto);
app.post("/uploadInteractive/:type/:userId/:objectId/:interactive_type", upload, auth, uploadInteractiveImage);

// http://g2pc1.bu.edu/~qzpeng/manual/MySQL%20Commands.htm
