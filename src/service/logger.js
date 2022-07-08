const infoColor = "\x1b[36m"; //cyan
const errorColor = "\x1b[31m"; //red
const warningColor = "\x1b[33m"; //yellow
const resetConsole = "\x1b[0m"; //reset

function getPrettyTimestamp() {
    return new Date(new Date().toUTCString()).toISOString().replace("T", " ").split(".")[0];
}

module.exports.info = function (filename, msg) {
    console.log(infoColor, `[${getPrettyTimestamp()}](INFO) in ${filename}:\n\t${msg}\n`, resetConsole);
}

module.exports.warning = function (filename, msg) {
    console.log(warningColor, `[${getPrettyTimestamp()}](WARN) in ${filename}:\n\t${msg}\n`, resetConsole);
}

module.exports.error = function (filename, err, msg = "") {
    console.log(errorColor, `[${getPrettyTimestamp()}](ERROR) in ${filename}:\n ${err}${msg ? `\n\t${msg}` : ""}\n`, resetConsole);
}
