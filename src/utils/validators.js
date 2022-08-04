const errorService = require("../service/errorService");

function jsonFieldPresent(json, fields) {
    for (let field of fields) {
        if (!json[field]) {
            throw new Error("Required field " + field + " is missing in json");
        }
    }
}

/**
 * Wrapper for the validation with included error handling.
 * If false, then the error response has been sent and logging taken care of.
 * If true, just continue.
 * 
 * @param {*} json The json to be validated
 * @param {string[]} fields The fields that must be present
 * @param {*} res The response
 * @param {string} callerFilename The filename of the calling mehod
 * @returns True if succeeded, false otherwise
 */
function jsonFieldPresentWrapper(json, fields, res, callerFilename) {
    try {
        jsonFieldPresent(json, fields);
    }
    catch (err) {
        let msg = "Required fields:"
        for (let field of fields) {
            msg += " " + field;
        }
        LOG.error(__filename, new Error("Json field not present"));
        LOG.error(callerFilename, err, msg);
        errorService.error400(res, err, msg);
        return false;
    }
    return true;
}

/**
 * Same thing as the single one, but takes an array as an input
 * and checks each member individually
 * 
 * @param {*} jsons An array of jsons to be validated
 * @param {string[]} fields The fields that must be present
 * @param {*} res The response
 * @param {string} callerFilename The filename of the calling mehod
 * @returns True if succeeded, false otherwise
 */
function jsonManyFieldPresentWrapper(jsons, fields, res, callerFilename) {
    let i;
    try {
        for (i in jsons)
            jsonFieldPresent(jsons[i], fields);
    }
    catch (err) {
        let msg = "Required fields:"
        for (let field of fields) {
            msg += " " + field;
        }
        msg += "\n\tIn member Nb: " + i.toString();
        LOG.error(__filename, new Error("Json field not present"));
        LOG.error(callerFilename, err, msg);
        errorService.error400(res, err, msg);
        return false;
    }
    return true;
}

module.exports.jsonFieldPresent = jsonFieldPresent;
module.exports.jsonFieldPresentWrapper = jsonFieldPresentWrapper;
module.exports.jsonManyFieldPresentWrapper = jsonManyFieldPresentWrapper;
