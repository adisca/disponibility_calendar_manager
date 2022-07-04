const roleEnum = Object.freeze({
    USER_ROLE: "USER_ROLE",
    ADMIN_ROLE: "ADMIN_ROLE"
});

module.exports.enum = roleEnum;
module.exports.getAll = function () {
    return Object.keys(roleEnum);
};
module.exports.getDefault = function () {
    return "USER_ROLE";
};
