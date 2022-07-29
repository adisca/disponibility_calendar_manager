let chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const server = require("../src/main");
const mongoose = require("mongoose");

chai.use(chaiHttp);

describe("POST /reservation", () => {
    // The test user
    const user1 = {
        email: "test1@test.com",
        password: "1234",
        name: "User For Testing1",
        address: "None needed",
        phoneNb: "1234 123 123"
    };
    const user2 = {
        email: "test2@test.com",
        password: "1234",
        name: "User For Testing2",
        address: "None needed",
        phoneNb: "1234 123 123"
    };
    let token1;
    let token2;
    const badToken = "bad";

    const reservation1 = {
        date: "2000-12-10",
        hour: [0, 1, 23]
    };
    const reservation2 = {
        date: "2000-12-10",
        hour: [1, 2]
    };
    const reservation3 = {
        date: "2000-12-11",
        hour: [1, 11, 22]
    };
    const reservation4 = {
        date: "2000-12-12",
        hour: [5, 16]
    };

    const goodInterval1 = {
        startDate: "2000-12-10",
        endDate: "2000-12-11"
    }
    const goodInterval2 = {
        startDate: "2000-12-10",
        endDate: "2000-12-10"
    }
    const goodInterval3 = {
        startDate: "1999-01-01",
        endDate: "2001-12-30"
    }
    // Good interval, but will give a 404
    const goodInterval4 = {
        startDate: "2020-12-10",
        endDate: "2020-12-11"
    }

    const badInterval1 = {}
    const badInterval2 = {
        startDate: "2000-12-10",
        endDate: "2000-12-33"
    }
    const badInterval3 = {
        startDate: "2000-12-11",
        endDate: "2000-12-10"
    }

    before(function () {
        return new Promise((resolve, reject) => {
            server.runServer();
            mongoose.connection.once("open", async () => {
                try {
                    const collections = await mongoose.connection.db.collections();

                    for (let collection of collections) {
                        await collection.deleteMany({});
                    }

                    let res;

                    res = await chai.request(server).post("/register").send(user1);
                    if (res.status != 201)
                        throw new Error("Failed to initialize");

                    res = await chai.request(server).post("/login").send(user1);
                    token1 = res.body.authToken;
                    if (res.status != 200)
                        throw new Error("Failed to initialize");


                    res = await chai.request(server).post("/register").send(user2);
                    if (res.status != 201)
                        throw new Error("Failed to initialize");

                    res = await chai.request(server).post("/login").send(user2);
                    token2 = res.body.authToken;
                    if (res.status != 200)
                        throw new Error("Failed to initialize");

                    res = await chai.request(server)
                        .post("/reservation/add")
                        .set("authorization", "Bearer " + token1)
                        .send(reservation1);
                    if (res.status != 201)
                        throw new Error("Failed to initialize");

                    res = await chai.request(server)
                        .post("/reservation/add")
                        .set("authorization", "Bearer " + token2)
                        .send(reservation2);
                    if (res.status != 201)
                        throw new Error("Failed to initialize");

                    res = await chai.request(server)
                        .post("/reservation/add")
                        .set("authorization", "Bearer " + token1)
                        .send(reservation3);
                    if (res.status != 201)
                        throw new Error("Failed to initialize");

                    res = await chai.request(server)
                        .post("/reservation/add")
                        .set("authorization", "Bearer " + token2)
                        .send(reservation4);
                    if (res.status != 201)
                        throw new Error("Failed to initialize");

                    resolve();
                }
                catch (err) {
                    reject(err);
                }
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

    it("It should not work without a token", (done) => {
        chai.request(server)
            .get("/reservation/interval")
            .send(goodInterval1)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(401);
                done();
            });
    });

    it("It should not work with an invalid token", (done) => {
        chai.request(server)
            .get("/reservation/interval")
            .set("authorization", "Bearer " + badToken)
            .send(goodInterval1)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(401);
                done();
            });
    });

    it("It should work with a good interval, checking the entire result", (done) => {
        chai.request(server)
            .get("/reservation/interval")
            .set("authorization", "Bearer " + token1)
            .send(goodInterval1)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(200);
                expect(res.body.length).to.be.equal(2);

                expect(res.body[0].date).to.be.equal(goodInterval1.startDate);
                expect(res.body[1].date).to.be.equal(goodInterval1.endDate);

                expect(res.body[0].reservedHours.length).to.be.equal(4);
                expect(res.body[1].reservedHours.length).to.be.equal(3);

                expect(res.body[0].reservedHours[0].hour).to.be.equal(0);
                expect(res.body[0].reservedHours[1].hour).to.be.equal(1);
                expect(res.body[0].reservedHours[2].hour).to.be.equal(2);
                expect(res.body[0].reservedHours[3].hour).to.be.equal(23);

                expect(res.body[1].reservedHours[0].hour).to.be.equal(1);
                expect(res.body[1].reservedHours[1].hour).to.be.equal(11);
                expect(res.body[1].reservedHours[2].hour).to.be.equal(22);

                expect(res.body[0].reservedHours[0].accounts.length).to.be.equal(1);
                expect(res.body[0].reservedHours[1].accounts.length).to.be.equal(2);
                expect(res.body[0].reservedHours[2].accounts.length).to.be.equal(1);
                expect(res.body[0].reservedHours[3].accounts.length).to.be.equal(1);

                expect(res.body[0].reservedHours[0].accounts[0].email).to.be.equal("test1@test.com");
                expect(res.body[0].reservedHours[2].accounts[0].email).to.be.equal("test2@test.com");
                done();
            });
    });

    it("It should work with a single day interval", (done) => {
        chai.request(server)
            .get("/reservation/interval")
            .set("authorization", "Bearer " + token1)
            .send(goodInterval2)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(200);
                expect(res.body.length).to.be.equal(1);

                expect(res.body[0].date).to.be.equal(goodInterval2.startDate);

                expect(res.body[0].reservedHours.length).to.be.equal(4);

                expect(res.body[0].reservedHours[0].hour).to.be.equal(0);
                expect(res.body[0].reservedHours[1].hour).to.be.equal(1);
                expect(res.body[0].reservedHours[2].hour).to.be.equal(2);
                expect(res.body[0].reservedHours[3].hour).to.be.equal(23);

                expect(res.body[0].reservedHours[0].accounts.length).to.be.equal(1);
                expect(res.body[0].reservedHours[1].accounts.length).to.be.equal(2);
                expect(res.body[0].reservedHours[2].accounts.length).to.be.equal(1);
                expect(res.body[0].reservedHours[3].accounts.length).to.be.equal(1);

                expect(res.body[0].reservedHours[0].accounts[0].email).to.be.equal("test1@test.com");
                expect(res.body[0].reservedHours[2].accounts[0].email).to.be.equal("test2@test.com");
                done();
            });
    });

    it("It should work with a wider interval", (done) => {
        chai.request(server)
            .get("/reservation/interval")
            .set("authorization", "Bearer " + token1)
            .send(goodInterval3)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(200);
                expect(res.body.length).to.be.equal(3);
                done();
            });
    });

    it("It should work with a wider interval", (done) => {
        chai.request(server)
            .get("/reservation/interval")
            .set("authorization", "Bearer " + token1)
            .send(goodInterval3)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(200);
                expect(res.body.length).to.be.equal(3);
                done();
            });
    });

    it("It fail should return a not found error for a valid interval with no hits", (done) => {
        chai.request(server)
            .get("/reservation/interval")
            .set("authorization", "Bearer " + token1)
            .send(goodInterval4)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(404);
                done();
            });
    });

    it("It should fail for an interval missing fields", (done) => {
        chai.request(server)
            .get("/reservation/interval")
            .set("authorization", "Bearer " + token1)
            .send(badInterval1)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(400);
                done();
            });
    });

    it("It should fail for an interval with invalid dates/formats", (done) => {
        chai.request(server)
            .get("/reservation/interval")
            .set("authorization", "Bearer " + token1)
            .send(badInterval2)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(400);
                done();
            });
    });

    it("It should fail for an interval with the startDate greater than the endDate", (done) => {
        chai.request(server)
            .get("/reservation/interval")
            .set("authorization", "Bearer " + token1)
            .send(badInterval3)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(400);
                done();
            });
    });

});
