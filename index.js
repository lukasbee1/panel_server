const express = require("express");

const app = express();
const path = require("path");
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { login, deleteAnything, updateAnything, getAnything, createAnything } = require("./queries");

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());
app.use(cors());
server.listen(8080, () => {
    console.log("Server started on 8080");
});

// app.post("/login", postLogin);
app.get('/inviteUser', () =>{

})
app.post('/login', login)



app.delete('/deleteAnything/:type/:userId/:objectId', deleteAnything)
app.get('/getAnything/:type/:userId/:objectId?', getAnything)
app.put('/updateAnything/:type/:userId/:objectId', updateAnything)
app.post('/createAnything/:type/:userId/:objectId?', createAnything)


// http://g2pc1.bu.edu/~qzpeng/manual/MySQL%20Commands.htm
