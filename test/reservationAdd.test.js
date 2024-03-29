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
    let goodToken1;
    let goodToken2;
    const badToken = "bad";

    const goodReservation1 = {
        date: "2000-12-10",
        hour: [0, 1, 4, 7, 22, 23]
    };
    const goodReservation2 = {
        date: "2000-12-10",
        hour: [1, 2, 3, 4, 5]
    };
    const goodReservation3 = {
        date: "2000-12-20",
        hour: [0, 1, 4, 7, 22, 23]
    };

    const badReservation1 = {
        date: "2000-12-10",
        hour: [24]
    };
    const badReservation2 = {
        date: "2000-13-10",
        hour: [1, 3, 10]
    };

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
                    goodToken1 = res.body.authToken;
                    if (res.status != 200)
                        throw new Error("Failed to initialize");


                    res = await chai.request(server).post("/register").send(user2);
                    if (res.status != 201)
                        throw new Error("Failed to initialize");

                    res = await chai.request(server).post("/login").send(user2);
                    goodToken2 = res.body.authToken;
                    if (res.status != 200)
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
            .post("/reservation")
            .send(goodReservation1)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(401);
                done();
            });
    });

    it("It should work when everything is fine", (done) => {
        chai.request(server)
            .post("/reservation")
            .send(goodReservation1)
            .set("authorization", "Bearer " + goodToken1)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(201);
                done();
            });
    });

    it("It should work when adding hours to existing account-date pair", (done) => {
        chai.request(server)
            .post("/reservation")
            .send(goodReservation2)
            .set("authorization", "Bearer " + goodToken1)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(201);
                done();
            });
    });

    it("It should succeed with another user, different date", (done) => {
        chai.request(server)
            .post("/reservation")
            .send(goodReservation3)
            .set("authorization", "Bearer " + goodToken2)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(201);
                done();
            });
    });

    it("It should succeed with another user, same date as first", (done) => {
        chai.request(server)
            .post("/reservation")
            .send(goodReservation1)
            .set("authorization", "Bearer " + goodToken2)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(201);
                done();
            });
    });

    it("It should succeed when trying to add the exact same reservation (or a smaller one with the same hours)", (done) => {
        chai.request(server)
            .post("/reservation")
            .send(goodReservation1)
            .set("authorization", "Bearer " + goodToken1)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(201);
                done();
            });
    });

    it("It should fail with a bad token", (done) => {
        chai.request(server)
            .post("/reservation")
            .send(goodReservation1)
            .set("authorization", "Bearer " + badToken)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(401);
                done();
            });
    });

    it("It should fail when the hours fail validation by being outside 0-23 interval", (done) => {
        chai.request(server)
            .post("/reservation")
            .send(badReservation1)
            .set("authorization", "Bearer " + goodToken1)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(400);
                done();
            });
    });

    it("It should fail when the date is invalid", (done) => {
        chai.request(server)
            .post("/reservation")
            .send(badReservation2)
            .set("authorization", "Bearer " + goodToken1)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(400);
                done();
            });
    });
});
