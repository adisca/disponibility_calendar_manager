let chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const server = require("../src/main");
const mongoose = require("mongoose");

chai.use(chaiHttp);

describe("POST /register", () => {
    // All fields
    const goodUser1 = {
        email: "test1@test.com",
        password: "1234",
        name: "User For Testing",
        address: "None needed",
        phoneNb: "1234 123 123"
    }
    // Removed the optional fields
    const goodUser2 = {
        email: "test2@test.com",
        password: "1234",
        name: "User For Testing",
    }

    // Empty User
    const badUser1 = {}
    // Repeated email
    const badUser2 = {
        email: "test1@test.com",
        password: "1234",
        name: "User For Testing",
        address: "None needed",
        phoneNb: "1234 123 123"
    }
    // Missing required field
    const badUser3 = {
        email: "testbad3@test.com",
        password: "1234",
        address: "None needed",
        phoneNb: "1234 123 123"
    }
    // Fails phone number regex
    const badUser4 = {
        email: "testbad4@test.com",
        password: "1234",
        name: "User For Testing",
        address: "None needed",
        phoneNb: "1234123123"
    }
    // Name field too long
    const badUser5 = {
        email: "testbad5@test.com",
        password: "1234",
        name: "User For Testinggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg",
        address: "None needed",
        phoneNb: "1234 123 123"
    }

    before(async function () {
        server.runServer();
        mongoose.connection.once("open", async () => {
            const collections = await mongoose.connection.db.collections();

            for (let collection of collections) {
                await collection.deleteMany({});
            }
        });
    });

    after(async function () {
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            await collection.deleteMany({});
        }
        server.closeServer();
    });

    it("Test if the server exists", (done) => {
        expect(server).to.not.be.undefined;
        done();
    });

    it("It sould register goodUser1", (done) => {
        chai.request(server)
            .post("/register")
            .send(goodUser1)
            .end((err, res) => {
                expect(err).is.null;

                expect(res).to.have.status(200);
                done();
            });
    });


    it("It sould register goodUser2", (done) => {
        chai.request(server)
            .post("/register")
            .send(goodUser2)
            .end((err, res) => {
                expect(err).is.null;

                expect(res).to.have.status(200);
                done();
            });
    });

    it("It should fail to register badUser1", (done) => {
        chai.request(server)
            .post("/register")
            .send(badUser1)
            .end((err, res) => {
                expect(err).is.null;

                expect(res).to.have.status(400);
                done();
            });
    });

    it("It should fail to register badUser2", (done) => {
        chai.request(server)
            .post("/register")
            .send(badUser2)
            .end((err, res) => {
                expect(err).is.null;

                expect(res).to.have.status(400);
                done();
            });
    });

    it("It should fail to register badUser3", (done) => {
        chai.request(server)
            .post("/register")
            .send(badUser3)
            .end((err, res) => {
                expect(err).is.null;

                expect(res).to.have.status(400);
                done();
            });
    });

    it("It should fail to register badUser4", (done) => {
        chai.request(server)
            .post("/register")
            .send(badUser4)
            .end((err, res) => {
                expect(err).is.null;

                expect(res).to.have.status(400);
                done();
            });
    });

    it("It should fail to register badUser5", (done) => {
        chai.request(server)
            .post("/register")
            .send(badUser5)
            .end((err, res) => {
                expect(err).is.null;

                expect(res).to.have.status(400);
                done();
            });
    });
});
