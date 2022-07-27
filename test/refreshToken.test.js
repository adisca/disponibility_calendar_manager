let chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const server = require("../src/main");
const mongoose = require("mongoose");

chai.use(chaiHttp);

describe("POST /refreshToken", () => {
    // All fields
    const user = {
        email: "test1@test.com",
        password: "1234",
        name: "User For Testing",
        address: "None needed",
        phoneNb: "1234 123 123"
    }

    let goodRefreshToken1 = {};
    let goodRefreshToken2 = {};
    let goodRefreshToken3 = {};
    const badRefreshToken1 = {};
    const badRefreshToken2 = {
        token: "1234"
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
                            reject(err);
                        chai.request(server)
                            .post("/login")
                            .send(user)
                            .end((err, res) => {
                                if (err)
                                    reject(err);
                                goodRefreshToken1.token = res.body.refreshToken;

                                chai.request(server)
                                    .post("/login")
                                    .send(user)
                                    .end((err, res) => {
                                        if (err)
                                            reject(err);
                                        goodRefreshToken2.token = res.body.refreshToken;

                                        chai.request(server)
                                            .post("/login")
                                            .send(user)
                                            .end((err, res) => {
                                                if (err)
                                                    reject(err);

                                                goodRefreshToken3.token = res.body.refreshToken;
                                                resolve();
                                            });
                                    });
                            });
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

    it("It should work with a good token", (done) => {
        chai.request(server)
            .post("/refreshToken")
            .send(goodRefreshToken1)
            .end((err, res) => {
                expect(err).to.not.exist;
                expect(res.body.authToken).to.exist;
                expect(res.body.refreshToken).to.exist;
                expect(res).to.have.status(200);

                done();
            });
    });

    it("It should work with the returned tokens", (done) => {
        chai.request(server)
            .post("/refreshToken")
            .send(goodRefreshToken2)
            .end((err, res) => {
                expect(err).to.not.exist;
                expect(res.body.authToken).to.exist;
                expect(res.body.refreshToken).to.exist;
                expect(res).to.have.status(200);

                let newToken = {
                    token: res.body.refreshToken
                };

                chai.request(server)
                    .post("/refreshToken")
                    .send(newToken)
                    .end((err, res) => {
                        expect(err).to.not.exist;
                        expect(res.body.authToken).to.exist;
                        expect(res.body.refreshToken).to.exist;
                        expect(res).to.have.status(200);

                        let newToken = {
                            token: res.body.refreshToken
                        };

                        chai.request(server)
                            .post("/refreshToken")
                            .send(newToken)
                            .end((err, res) => {
                                expect(err).to.not.exist;

                                expect(res.body.authToken).to.exist;
                                expect(res.body.refreshToken).to.exist;
                                expect(res).to.have.status(200);
                                done();
                            });
                    });
            });
    });

    it("It should fail trying to use the same token twice", (done) => {
        chai.request(server)
            .post("/refreshToken")
            .send(goodRefreshToken3)
            .end((err, res) => {
                expect(err).to.not.exist;
                expect(res.body.authToken).to.exist;
                expect(res.body.refreshToken).to.exist;
                expect(res).to.have.status(200);

                chai.request(server)
                    .post("/refreshToken")
                    .send(goodRefreshToken3)
                    .end((err, res) => {
                        expect(err).to.not.exist;
                        expect(res.body.authToken).to.not.exist;
                        expect(res.body.refreshToken).to.not.exist;
                        expect(res).to.have.status(404);

                        done();
                    });
            });
    });

    it("It should fail if it is missing required fields", (done) => {
        chai.request(server)
            .post("/refreshToken")
            .send(badRefreshToken1)
            .end((err, res) => {
                expect(err).to.not.exist;
                expect(res.body.authToken).to.not.exist;
                expect(res.body.refreshToken).to.not.exist;
                expect(res).to.have.status(400);

                done();
            });
    });

    it("It should fail if it uses a wrong token", (done) => {
        chai.request(server)
            .post("/refreshToken")
            .send(badRefreshToken2)
            .end((err, res) => {
                expect(err).to.not.exist;
                expect(res.body.authToken).to.not.exist;
                expect(res.body.refreshToken).to.not.exist;
                expect(res).to.have.status(404);

                done();
            });
    });
});
