const infoColor = "\x1b[36m"; //cyan
const errorColor = "\x1b[31m"; //red
const resetConsole = "\x1b[0m"; //reset

function getPrettyTimestamp() {
    return new Date(new Date().toUTCString()).toISOString().replace("T", " ").split(".")[0];
}

module.exports.info = function (filename, msg) {
    console.log(infoColor, `[${getPrettyTimestamp()}](INFO) in ${filename}:\n\t${msg}`, resetConsole);
}

module.exports.error = function (filename, err, msg = "") {
    console.log(errorColor, `[${getPrettyTimestamp()}](ERROR) in ${filename}:\n ${err}${msg ? "\n\t" + msg : ""}`, resetConsole);
}
