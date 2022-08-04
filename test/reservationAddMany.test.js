let chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const server = require("../src/main");
const mongoose = require("mongoose");

chai.use(chaiHttp);

describe("POST /reservation/many", () => {
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

    const goodReservation1 = [
        {
            date: "2000-12-10",
            hour: [0, 1, 4, 7, 22, 23]
        },
        {
            date: "2000-12-11",
            hour: [4, 6, 7, 9]
        }
    ];
    const goodReservation2 = [
        {
            date: "2000-12-10",
            hour: [1, 2, 3, 4, 5]
        }
    ];
    const goodReservation3 = [
        {
            date: "2000-12-20",
            hour: [0, 1, 4, 7, 22, 23]
        }];

    const badReservation1 = [];
    const badReservation2 = [
        {
            date: "2000-12-20",
            hour: [0, 1, 2]
        },
        {}
    ];
    const badReservation3 = [
        {
            date: "2000-12-20",
            hour: []
        }
    ];
    const badReservation4 = [
        {
            date: "2000-12-20",
            hour: [0, 1, 2]
        },
        {
            date: "2000-12-20",
            hour: [3, 4, 5]
        }
    ];
    const badReservation5 = [
        {
            date: "2000-12-10",
            hour: [24]
        }];
    const badReservation6 = [
        {
            date: "2000-13-10",
            hour: [1, 3, 10]
        }];

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
                    if (res.status != 200)
                        throw new Error("Failed to initialize");

                    res = await chai.request(server).post("/login").send(user1);
                    goodToken1 = res.body.authToken;
                    if (res.status != 200)
                        throw new Error("Failed to initialize");


                    res = await chai.request(server).post("/register").send(user2);
                    if (res.status != 200)
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
            .post("/reservation/many")
            .send(goodReservation1)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(401);
                done();
            });
    });

    it("It should not work without a bad token", (done) => {
        chai.request(server)
            .post("/reservation/many")
            .set("authorization", "Bearer " + badToken)
            .send(goodReservation1)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(401);
                done();
            });
    });

    it("It should work when all is good", (done) => {
        chai.request(server)
            .post("/reservation/many")
            .set("authorization", "Bearer " + goodToken1)
            .send(goodReservation1)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(200);
                done();
            });
    });

    it("It should work when adding hours to an existing date", (done) => {
        chai.request(server)
            .post("/reservation/many")
            .set("authorization", "Bearer " + goodToken1)
            .send(goodReservation2)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(200);
                done();
            });
    });

    it("It should work with a different user, different date", (done) => {
        chai.request(server)
            .post("/reservation/many")
            .set("authorization", "Bearer " + goodToken2)
            .send(goodReservation3)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(200);
                done();
            });
    });

    it("It should work with a different user, same dates", (done) => {
        chai.request(server)
            .post("/reservation/many")
            .set("authorization", "Bearer " + goodToken2)
            .send(goodReservation2)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(200);
                done();
            });
    });

    it("It should work with a different user, same dates", (done) => {
        chai.request(server)
            .post("/reservation/many")
            .set("authorization", "Bearer " + goodToken2)
            .send(goodReservation1)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(200);
                done();
            });
    });

    it("Repeated adding", (done) => {
        chai.request(server)
            .post("/reservation/many")
            .set("authorization", "Bearer " + goodToken1)
            .send(goodReservation1)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(200);
                done();
            });
    });

    it("It should not work when empty array", (done) => {
        chai.request(server)
            .post("/reservation/many")
            .set("authorization", "Bearer " + goodToken1)
            .send(badReservation1)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(400);
                done();
            });
    });

    it("It should not work when missing fields", (done) => {
        chai.request(server)
            .post("/reservation/many")
            .set("authorization", "Bearer " + goodToken1)
            .send(badReservation2)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(400);
                done();
            });
    });

    it("It should not work when empty hours array", (done) => {
        chai.request(server)
            .post("/reservation/many")
            .set("authorization", "Bearer " + goodToken1)
            .send(badReservation3)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(400);
                done();
            });
    });

    it("It should not work when duplicate dates", (done) => {
        chai.request(server)
            .post("/reservation/many")
            .set("authorization", "Bearer " + goodToken1)
            .send(badReservation4)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(400);
                done();
            });
    });

    it("It should not work when invalid hours", (done) => {
        chai.request(server)
            .post("/reservation/many")
            .set("authorization", "Bearer " + goodToken1)
            .send(badReservation5)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(400);
                done();
            });
    });

    it("It should not work when invalid date", (done) => {
        chai.request(server)
            .post("/reservation/many")
            .set("authorization", "Bearer " + goodToken1)
            .send(badReservation6)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(400);
                done();
            });
    });
});