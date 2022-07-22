const expect = require("chai").expect;
const auth = require("../src/service/security/auth");
const Role = require("../src/model/enums/Role");

describe("Auth service testing", () => {
    const accountGood = {
        id: "myownid",
        email: "test@test.com",
        password: "1234",
        role: Role.enum.USER_ROLE,
        name: "User For Testing",
        address: "None needed",
        phoneNb: "1234 123 123"
    };
    const accountBad = {};

    it("It should work with no errors for the good account", (done) => {
        expect(() => auth.sign(accountGood)).to.not.throw();
        done();
    });

    it("It should fail and throw an error for the bad account", (done) => {
        expect(() => auth.sign(accountBad)).to.throw();
        done();
    });

    it("It should not fail the verification of a good token", (done) => {
        const token = auth.sign(accountGood);
        expect(auth.verify(token)).is.true;
        done();
    });

    it("It should not fail the verification of a good token if the role is authorised", (done) => {
        const token = auth.sign(accountGood);
        expect(auth.verify(token, Role.getAll())).is.true;
        done();
    });

    it("It should not fail the verification of a good token if the role is unauthorised", (done) => {
        const token = auth.sign(accountGood);
        expect(auth.verify(token, [Role.enum.ADMIN_ROLE])).is.false;
        done();
    });

    it("It should fail to verify a wrong token", (done) => {
        expect(auth.verify("")).is.false;
        done();
    });

    it("It should remember the id and role of the account", (done) => {
        const token = auth.sign(accountGood);
        const decoded = auth.decode(token);
        expect(decoded.id).equals("myownid");
        expect(decoded.role).equals("USER_ROLE");
        done();
    });

});
