fs = require("fs-extra");

function saveImage(path_temp, filename) {
    var currentFolder = process.cwd();
    fs.move(
        path_temp,
        currentFolder + "/public/" + filename,
        { overwrite: true },
        (err) => {
            if (err) return console.error(err);
            console.log("file uploaded!");
        }
    );
}

module.exports = {
    saveImage,
};
