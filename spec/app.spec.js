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
    describe("GET BY ID", () => {
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
            expect(body.article.votes).to.equal(4100);
          });
      });
      it("status 200: responds with a unchanged article object when passed a valid articleId with no information in the request body", () => {
        return request
          .patch("/api/articles/1")
          .send({})
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.eql({
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 100,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z"
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
      it("status 404: responds with not found when passed a non existent article_id", () => {
        return request
          .patch("/api/articles/999999999")
          .send({ inc_votes: 50 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Not Found - Article id does not exist");
          });
      });
    });
  });

  describe("/comments", () => {
    describe("POST", () => {
      it("status 201: responds with confirmation of the posted comment", () => {
        return request
          .post("/api/articles/1/comments")
          .send({ username: "butter_bridge", body: "This is a comment!" })
          .expect(201)
          .then(({ body }) => {
            expect(body.comment.body).to.equal("This is a comment!");
          });
      });
      it("status 400: responds with bad request when passed comment with no content", () => {
        return request
          .post("/api/articles/1/comments")
          .send({ username: "butter_bridge", body: "" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("status 404: responds with page not found when passed a valid article id that does not exist and is too large", () => {
        return request
          .post("/api/articles/99999999999/comments")
          .send({ username: "butter_bridge", body: "hello there" })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Page not found");
          });
      });
      it("status 404: responds with page not found when passed a valid article id that does not exist", () => {
        return request
          .post("/api/articles/10000/comments")
          .send({ username: "butter_bridge", body: "hello there" })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Article Does Not Exist");
          });
      });
      it("status 400: responds with 'bad request' when comment posted without all required keys", () => {
        return request
          .post("/api/articles/1/comments")

          .send({ username: "butter_bridge" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
    });
    describe("GET", () => {
      it("status 200: responds with an array of comments for the given article_id", () => {
        return request
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments[0]).to.have.all.keys(
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
            expect(body.commments).to.be.descendingBy("created_at");
            // need to fix one broken test (above)
            expect(body.comments[0].comment_id).to.equal(2);
            expect(body.comments[12].comment_id).to.equal(18);
          });
      });
      it("status 200: commment array takes sort queries and sort order 'votes' ascendingly", () => {
        return request
          .get("/api/articles/1/comments?sort_by=votes&order_by=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.ascendingBy("votes");
            expect(body.comments[0].comment_id).to.equal(4);
            expect(body.comments[12].comment_id).to.equal(3);
          });
      });
      it("status 400: responds with 400 Bad Request when passed a sort_by argument where column does not exist", () => {
        return request
          .get("/api/articles/1/comments?sort_by=dave")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              "Bad Request - Invalid Column For Sorting"
            );
          });
      });

      it("status 404: responds with 404 not found when passed a valid article_id that is too high and does not exist", () => {
        return request
          .get("/api/articles/9999999999999999/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Page not found");
          });
      });
      it("status 404: responds with 404 not found when passed a valid article_id that does not exist", () => {
        return request
          .get("/api/articles/1000/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Article Does Not Exist");
          });
      });
    });
    describe("PATCH", () => {
      it("status 200: responds with a correctly updated comment when passed a valid comment_id", () => {
        return request
          .patch("/api/comments/1")
          .send({ inc_votes: 3000 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).to.equal(3016);
          });
      });
      it("status 400: responds with bad request when passed an invalid inc_votes i.e. not a number", () => {
        return request
          .patch("/api/comments/1")
          .send({ inc_votes: "dog" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("status 404: responds with comment not found when passed a valid comment number that does not exist", () => {
        return request
          .patch("/api/comments/99999999")
          .send({ inc_votes: 3000 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Comment Does Not Exist");
          });
      });
    });
    describe("DELETE", () => {
      it("status 204: deletes given comment by comment_id and returns status 204 and no content", () => {
        return request.delete("/api/comments/1").expect(204);
      });
    });
  });
  describe("/articles", () => {
    describe("GET ALL ARTICLES - WITH QUERIES", () => {
      it("status 200: Returns array of all article objects with specific keys including comment_count ", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.have.all.keys(
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
      it("status 200: Articles array order is returned with default sort by 'created_at'  and default order as 'desc'", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.descendingBy("created_at");
          });
      });
      it("status 200: Accepts queries for articles array order to be sorted by any valid column and either ascending or descending", () => {
        return request
          .get("/api/articles/?sort_by=title&order_by=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.ascendingBy("title");
          });
      });
      it("status 200: Accepts queries for author which filters the articles by username value specified in the query", () => {
        return request
          .get("/api/articles/?author=icellusedkars")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].author).to.equal("icellusedkars");
          });
      });
      it("status 200: Accepts queries for topic which filters the articles by topic value specified in the query", () => {
        return request
          .get("/api/articles/?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].topic).to.equal("mitch");
          });
      });

      it("status 404: where topic on query doesn't exist, sends 404 status and message - topic does not exist", () => {
        return request
          .get("/api/articles/?topic=not-a-topic")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Topic not found");
          });
      });
      it("status 404: where author on query doesn't exist, sends 404 status and message - author does not exist", () => {
        return request
          .get("/api/articles/?author=not-a-author")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Author not found");
          });
      });
    });
  });

  // xdescribe("/api", () => {
  //   describe("GET", () => {
  //     it("status 200: returns a JSON describing all the available endpoints on the API ", () => {
  //       return request
  //         .get("/api")
  //         .expect(200)
  //         .then(({ body }) => {
  //           // expect(body.msg).to.equal("Comment Does Not Exist");
  //         });
  //     });
  //   });
  // });
  describe("ADDITIONAL ERROR HANDLING", () => {
    // here.....
    describe("INVALID ROUTES", () => {
      it("status 405: returns 'Method Not Allowed' when passed an invalid route - GET api/bananas", () => {
        return request
          .get("/api/bananas")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("status 405: returns 'Method Not Allowed' when passed an invalid method - DELETE article/1", () => {
        return request
          .delete("/api/articles/1")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("status 405: returns 'Method Not Allowed' when passed an invalid method - POST /comments/1", () => {
        return request
          .post("/api/comments/1")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("status 405: returns 'Method Not Allowed' when passed an invalid method - POST /topics/new-topic", () => {
        return request
          .post("/api/topics/new-topic")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("status 405: returns 'Method Not Allowed' when passed an invalid method - POST /users/the-lost-scientist", () => {
        return request
          .post("/api/users/the-lost-scientist")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("status 405: returns 'Method Not Allowed' when passed an invalid method - PATCH /api/topics", () => {
        return request
          .patch("/api/topics")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("status 405: returns 'Method Not Allowed' when passed an invalid method - PATCH /api/articles", () => {
        return request
          .patch("/api/articles")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("status 405: returns 'Method Not Allowed' when passed an invalid method - PUT /api/articles/1", () => {
        return request
          .put("/api/articles/1")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("status 405: returns 'Method Not Alloowed' when passed an invalid method - PUT /api/articles/1/comments", () => {
        return request
          .put("/api/articles/1")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
    });
  });
});
