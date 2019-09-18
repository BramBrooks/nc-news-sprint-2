process.env.NODE_ENV = "test";

const app = require("../app");

const request = require("supertest")(app);

const { expect } = require("chai");

const { connection } = require("../db/connection");

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });

  after(() => connection.destroy());

  describe("/topics", () => {
    describe("GET", () => {
      it("status 200 : it responds with an object of all topics from db", () => {
        return request
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics.length).to.equal(3);
          });
      });
      it("status 200: it responds with all correct keys", () => {
        return request
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics[0]).to.contain.all.keys("description", "slug");
          });
      });
    });
  });
  describe("/users", () => {
    describe("GET", () => {
      it("status 200: it responds with correct user when passed username", () => {
        return request
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.eql({
              user: {
                username: "butter_bridge",
                name: "jonny",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
              }
            });
          });
      });

      it("status 404: it responds with user not found message when passed an invalid username", () => {
        return request
          .get("/api/users/invalid_username")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("User not found");
          });
      });
    });
  });

  describe("/articles", () => {
    describe("GET", () => {
      it("status 200: responds with correct article object when passed valid article id", () => {
        return request
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            // console.log(body, "<-- body in test");
            expect(body.article).to.include.keys(
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes"
            );
          });
      });
      it("status 200: includes comment count key", () => {
        return request
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            // console.log(body, "<----- body in test");
            expect(body.article).to.include.keys("created_at");
            expect(body.article.comment_count).to.be.a("number");
            // why is created_at in a string format when it gets back to the test response?
          });
      });
      it("status 404: responds with article not found when passed an articleId which does not exist", () => {
        return request
          .get("/api/articles/9999999")
          .expect(404)
          .then(({ body }) => {
            // console.log(body.msg, "<----- body in test");
            expect(body.msg).to.equal("Article not found");
          });
      });
      it("status 400: responds with bad request when passed an invlaid articleId i.e. not a number", () => {
        return request
          .get("/api/articles/abcde")
          .expect(400)
          .then(({ body }) => {
            // console.log(body.msg, "<----- body in test");
            expect(body.msg).to.equal("Bad Request");
          });
      });
    });
    describe("PATCH", () => {
      it("status 200: responds with a correctly updated article object when passed a valid articleId", () => {
        return request
          .patch("/api/articles/1")
          .send({ inc_votes: 4000 })
          .expect(200)
          .then(({ body }) => {
            // console.log(body);
            expect(body.updatedArticle.votes).to.equal(4100);
          });
      });
    });
    it("status 400: responds with bad request when passed an invalid inc_votes i.e. not a number", () => {
      return request
        .patch("/api/articles/1")
        .send({ inc_votes: "dog" })
        .expect(400)
        .then(({ body }) => {
          // console.log(body);
          expect(body.msg).to.equal("Bad Request");
        });
    });
    describe("POST", () => {
      it.only("status 200: responds with confirmation of the posted comment", () => {
        return request
          .post("/api/articles/1/comments")
          .send({ username: "bram12345", body: "This is a comment!" })
          .expect(200)
          .then(({ body }) => {
            // console.log(body);
            expect(body).to.equal("This is a comment!");
          });
      });
    });
  });
});
