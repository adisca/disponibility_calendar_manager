let chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const server = require("../src/main");
const mongoose = require("mongoose");

chai.use(chaiHttp);

describe("POST /login", () => {
    // The test user
    const user = {
        email: "test@test.com",
        password: "1234",
        name: "User For Testing",
        address: "None needed",
        phoneNb: "1234 123 123"
    };

    const goodCredentials = {
        email: "test@test.com",
        password: "1234"
    };

    // Empty
    const badCredentials1 = {};
    // No email
    const badCredentials2 = {
        password: "1234"
    };
    // No password
    const badCredentials3 = {
        email: "test@test.com",
    };
    // Inexistent email
    const badCredentials4 = {
        email: "wrong@email.com",
        password: "1234"
    };
    // Wrong password
    const badCredentials5 = {
        email: "test@test.com",
        password: "wrong"
    };

    before(function () {
        return new Promise((resolve, reject) => {
            server.runServer();
            mongoose.connection.once("open", async () => {
                const collections = await mongoose.connection.db.collections();

                for (let collection of collections) {
                    await collection.deleteMany({});
                }

                chai.request(server)
                    .post("/register")
                    .send(user)
                    .end((err, _res) => {
                        if (err)
                            reject(err)
                        resolve()
                    });
            });
        });
    });

    after(async function () {
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            await collection.deleteMany({});
        }
        server.closeServer();
    });

    it("It should work with the good credentials", (done) => {
        chai.request(server)
            .post("/login")
            .send(goodCredentials)
            .end((err, res) => {
                expect(err).is.null;

                expect(res).to.have.status(200);
                done();
            });
    });

    it("It should fail with the bad credentials 1", (done) => {
        chai.request(server)
            .post("/login")
            .send(badCredentials1)
            .end((err, res) => {
                expect(err).is.null;

                expect(res).to.have.status(400);
                done();
            });
    });

    it("It should fail with the bad credentials 2", (done) => {
        chai.request(server)
            .post("/login")
            .send(badCredentials2)
            .end((err, res) => {
                expect(err).is.null;

                expect(res).to.have.status(400);
                done();
            });
    });

    it("It should fail with the bad credentials 3", (done) => {
        chai.request(server)
            .post("/login")
            .send(badCredentials3)
            .end((err, res) => {
                expect(err).is.null;

                expect(res).to.have.status(400);
                done();
            });
    });

    it("It should fail with the bad credentials 4", (done) => {
        chai.request(server)
            .post("/login")
            .send(badCredentials4)
            .end((err, res) => {
                expect(err).is.null;

                expect(res).to.have.status(400);
                done();
            });
    });

    it("It should fail with the bad credentials 5", (done) => {
        chai.request(server)
            .post("/login")
            .send(badCredentials5)
            .end((err, res) => {
                expect(err).is.null;

                expect(res).to.have.status(400);
                done();
            });
    });

});