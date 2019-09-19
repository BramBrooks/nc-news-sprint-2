process.env.NODE_ENV = "test";

process.env.NODE_ENV = "test";

const app = require("../app");

const request = require("supertest")(app);

const chai = require("chai");

const chaiSorted = require("chai-sorted");
const { expect } = chai;

chai.use(chaiSorted);

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
            expect(body.msg).to.equal("Article not found");
          });
      });
      it("status 400: responds with bad request when passed an invlaid articleId i.e. not a number", () => {
        return request
          .get("/api/articles/abcde")
          .expect(400)
          .then(({ body }) => {
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
          expect(body.msg).to.equal("Bad Request");
        });
    });
  });

  describe("/comments", () => {
    describe("POST", () => {
      it("status 200: responds with confirmation of the posted comment", () => {
        return request
          .post("/api/articles/1/comments")
          .send({ username: "butter_bridge", body: "This is a comment!" })
          .expect(200)
          .then(({ body }) => {
            // console.log(body, "body in test");
            expect(body.insertedComment).to.equal("This is a comment!");
          });
      });
      it("status 400: responds with bad request when passed comment with no content", () => {
        return request
          .post("/api/articles/1/comments")
          .send({ username: "butter_bridge", body: "" })
          .expect(400)
          .then(({ body }) => {
            // console.log(body, "body in test");
            expect(body.msg).to.equal("No comment provided!");
          });
      });
    });
    describe("GET", () => {
      it("status 200: responds with an array of comments for the given article_id", () => {
        return request
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            // console.log(body[0], "body in test");
            expect(body[0]).to.have.all.keys(
              "comment_id",
              "votes",
              "created_at",
              "author",
              "body"
            );
          });
      });
      it("status 200: commment array is sorted by 'created at' & ordered by descending by default", () => {
        return request
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            // console.log(body, "body in test");
            expect(body[0].comment_id).to.equal(2);
            expect(body[12].comment_id).to.equal(18);
          });
      });
      it("status 200: commment array takes sort queries and order is sorted by 'created at' & ordered by queries", () => {
        return request
          .get("/api/articles/1/comments?sort_by=votes&order_by=asc")
          .expect(200)
          .then(({ body }) => {
            // add test specific to ascendingBy
            expect(body[0].comment_id).to.equal(4);
            expect(body[12].comment_id).to.equal(3);
          });
      });
      it("status 400: responds with 400 Bad Request when passed a sort_by argument where column does not exist", () => {
        return request
          .get("/api/articles/1/comments?sort_by=dave")
          .expect(400)
          .then(({ body }) => {
            // add extra bit of code to the code for this - if (sortBy) etc
            expect(body.msg).to.equal("Bad Request");
          });
      });
    });
  });
  describe("/articles", () => {
    describe("GET", () => {
      it("status 200: Returns array of article objects with specific keys including comment_count ", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body[0]).to.have.all.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
          });
      });
      it("status 200: Articles array order is sorted by 'date' as default", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.descendingBy("created_at");
          });
      });
      it("status 200: Accepts queries for articles array order to be sorted by any valid column and either ascending or descending", () => {
        return request
          .get("/api/articles/?sort_by=title&order_by=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.ascendingBy("title");
          });
      });
      it("status 200: Accepts queries for author which filters the articles by username value specified in the query", () => {
        return request
          .get("/api/articles/?author=icellusedkars")
          .expect(200)
          .then(({ body }) => {
            expect(body[0].author).to.equal("icellusedkars");
          });
      });
      it("status 200: Accepts queries for topic which filters the articles by topic value specified in the query", () => {
        return request
          .get("/api/articles/?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            expect(body[0].topic).to.equal("mitch");
          });
      });
    });
  });
  describe("/comments", () => {
    describe("PATCH", () => {
      it.only("status 200: responds with a correctly updated comment when passed a valid comment_id", () => {
        return request
          .patch("/api/comments/1")
          .send({ inc_votes: 3000 })
          .expect(200)
          .then(({ body }) => {
            // console.log(body, "body");
            // check this is correct too!!!!

            expect(body.updatedComment.votes).to.equal(3016);
          });
      });
    });
    xit("status 400: responds with bad request when passed an invalid inc_votes i.e. not a number", () => {
      return request
        .patch("/api/comments/1")
        .send({ inc_votes: "dog" })
        .expect(400)
        .then(({ body }) => {
          // FINISH THIS FIRST!!!!
          expect(body.msg).to.equal("Bad Request");
        });
    });
  });
});
