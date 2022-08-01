let chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const server = require("../src/main");
const mongoose = require("mongoose");

chai.use(chaiHttp);

describe("DELETE /reservation", () => {
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

    // u1
    const reservation1 = {
        date: "2000-12-10",
        hour: [0, 1, 23]
    };
    // u2
    const reservation2 = {
        date: "2000-12-10",
        hour: [1, 2]
    };
    // u1
    const reservation3 = {
        date: "2000-12-11",
        hour: [1, 11, 22]
    };
    // u2
    const reservation4 = {
        date: "2000-12-12",
        hour: [5, 16]
    };

    // Delete one
    const goodDeletion1 = {
        date: "2000-12-12",
        hour: [5]
    }

    // Delete multiple
    const goodDeletion2 = {
        date: "2000-12-10",
        hour: [1, 23]
    }

    // Has inexistent hours, but still works
    const goodDeletion3 = {
        date: "2000-12-10",
        hour: [2, 3, 4, 5, 6, 7]
    }

    // Delete an entire date (should remove the doc from the db)
    const goodDeletion4 = {
        date: "2000-12-11",
        hour: [1, 11, 22]
    }

    // Existent date-account pair with no hours as a hit
    const goodDeletion5 = {
        date: "2000-12-12",
        hour: [14, 15, 17, 18]
    }

    // Missing fields
    const badDeletion1 = {}

    // Empty hour array
    const badDeletion2 = {
        date: "2000-12-10",
        hour: []
    }

    // Not found
    const badDeletion3 = {
        date: "1999-12-10",
        hour: [0, 1, 2, 3, 4, 5]
    }

    // Invalid hours
    const badDeletion4 = {
        date: "2000-12-10",
        hour: [-1, 24, 50]
    }

    // Too long while still valid. Has 23 twice
    const badDeletion5 = {
        date: "2000-12-10",
        hour: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 23]
    }

    // Bad date, not implemented just yet
    const badDeletion6 = {
        date: "2000-13-20",
        hour: [1]
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
                    if (res.status != 200)
                        throw new Error("Failed to initialize");

                    res = await chai.request(server).post("/login").send(user1);
                    token1 = res.body.authToken;
                    if (res.status != 200)
                        throw new Error("Failed to initialize");


                    res = await chai.request(server).post("/register").send(user2);
                    if (res.status != 200)
                        throw new Error("Failed to initialize");

                    res = await chai.request(server).post("/login").send(user2);
                    token2 = res.body.authToken;
                    if (res.status != 200)
                        throw new Error("Failed to initialize");

                    res = await chai.request(server)
                        .post("/reservation")
                        .set("authorization", "Bearer " + token1)
                        .send(reservation1);
                    if (res.status != 200)
                        throw new Error("Failed to initialize");

                    res = await chai.request(server)
                        .post("/reservation")
                        .set("authorization", "Bearer " + token2)
                        .send(reservation2);
                    if (res.status != 200)
                        throw new Error("Failed to initialize");

                    res = await chai.request(server)
                        .post("/reservation")
                        .set("authorization", "Bearer " + token1)
                        .send(reservation3);
                    if (res.status != 200)
                        throw new Error("Failed to initialize");

                    res = await chai.request(server)
                        .post("/reservation")
                        .set("authorization", "Bearer " + token2)
                        .send(reservation4);
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
            .delete("/reservation")
            .send(goodDeletion1)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(401);
                done();
            });
    });

    it("It should not work with an invalid token", (done) => {
        chai.request(server)
            .delete("/reservation")
            .set("authorization", "Bearer " + badToken)
            .send(goodDeletion1)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(401);
                done();
            });
    });

    it("It should work with 1", (done) => {
        chai.request(server)
            .delete("/reservation")
            .set("authorization", "Bearer " + token2)
            .send(goodDeletion1)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(200);
                done();
            });
    });

    it("It should work with 2", (done) => {
        chai.request(server)
            .delete("/reservation")
            .set("authorization", "Bearer " + token1)
            .send(goodDeletion2)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(200);
                done();
            });
    });

    it("It should work with 3", (done) => {
        chai.request(server)
            .delete("/reservation")
            .set("authorization", "Bearer " + token2)
            .send(goodDeletion3)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(200);
                done();
            });
    });

    it("It should work with 4", (done) => {
        chai.request(server)
            .delete("/reservation")
            .set("authorization", "Bearer " + token1)
            .send(goodDeletion4)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(200);
                done();
            });
    });

    it("It should work with 5", (done) => {
        chai.request(server)
            .delete("/reservation")
            .set("authorization", "Bearer " + token2)
            .send(goodDeletion5)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(200);
                done();
            });
    });

    it("It should not work with 1", (done) => {
        chai.request(server)
            .delete("/reservation")
            .set("authorization", "Bearer " + token1)
            .send(badDeletion1)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(400);
                done();
            });
    });

    it("It should not work with 2", (done) => {
        chai.request(server)
            .delete("/reservation")
            .set("authorization", "Bearer " + token1)
            .send(badDeletion2)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(400);
                done();
            });
    });

    it("It should not work with 3", (done) => {
        chai.request(server)
            .delete("/reservation")
            .set("authorization", "Bearer " + token1)
            .send(badDeletion3)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(404);
                done();
            });
    });

    it("It should not work with 4", (done) => {
        chai.request(server)
            .delete("/reservation")
            .set("authorization", "Bearer " + token1)
            .send(badDeletion4)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(400);
                done();
            });
    });

    it("It should not work with 5", (done) => {
        chai.request(server)
            .delete("/reservation")
            .set("authorization", "Bearer " + token1)
            .send(badDeletion5)
            .end((err, res) => {
                expect(err).to.not.exist;

                expect(res).to.have.status(400);
                done();
            });
    });

    // // Not quite implemented yet

    // it("It should not work with 6", (done) => {
    //     chai.request(server)
    //         .delete("/reservation")
    //         .set("authorization", "Bearer " + token1)
    //         .send(badDeletion6)
    //         .end((err, res) => {
    //             expect(err).to.not.exist;

    //             expect(res).to.have.status(400);
    //             done();
    //         });
    // });

});