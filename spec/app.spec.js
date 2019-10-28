process.env.NODE_ENV = "test";

const app = require("../app");

const request = require("supertest")(app);

const chai = require("chai");

const chaiSorted = require("chai-sorted");
const { expect } = chai;

chai.use(chaiSorted);

const connection = require("../db/connection");

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
            expect(body.article.article_id).to.equal(1);
          });
      });
      it("status 200: includes comment count key", () => {
        return request
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.include.keys("created_at");
            expect(body.article.comment_count).to.be.a("string");
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
            expect(body.article.article_id).to.equal(1);
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
            expect(body.comment.article_id).to.eql(1);
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

      /// here ******************************
      it("status 200: commment array is sorted by 'created at' & ordered by descending by default", () => {
        return request
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.descendingBy("created_at");
            expect(body.comments[0].comment_id).to.equal(2);
            expect(body.comments[12].comment_id).to.equal(18);
          });
      });
      it("status 200: returns commment array sorted by asc when passed this as query", () => {
        return request
          .get("/api/articles/1/comments?order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.ascendingBy("created_at");
            expect(body.comments[0].comment_id).to.equal(18);
            expect(body.comments[12].comment_id).to.equal(2);
          });
      });
      it("status 200: commment array takes sort queries and sort order 'votes' ascendingly", () => {
        return request
          .get("/api/articles/1/comments?sort_by=votes&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.ascendingBy("votes");
            expect(body.comments[0].comment_id).to.equal(4);
            expect(body.comments[12].comment_id).to.equal(3);
          });
      });
      it("status 200: returns an empty array when passed a valid article id which has no comments associated with it", () => {
        return request
          .get("/api/articles/4/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.eql([]);
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
            expect(body.comment.comment_id).to.equal(1);
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

      it("status 200: responds with 200 status code when sent a body with no inc_votes property", () => {
        return request
          .patch("/api/comments/1")
          .send({})
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).to.eql({
              comment_id: 1,
              author: "butter_bridge",
              article_id: 9,
              votes: 16,
              created_at: "2017-11-22T12:36:03.389Z",
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
            });
          });
      });
    });
    describe("DELETE", () => {
      it("status 204: deletes given comment by comment_id and returns status 204 and no content", () => {
        return request.delete("/api/comments/1").expect(204);
      });

      it("status 404: returns status 404 and message 'not found' when passed valid comment_id that does not not exist", () => {
        return request
          .delete("/api/comments/1000")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Comment Does Not Exist");
          });
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
      it("status 200: Articles array order is returned with default sort by 'created_at'  and default order as 'desc'", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.descendingBy("created_at");
          });
      });
      it("status 200: Articles array order is returned with order as ascending when queried (and will default to ascending by date created by default if not passed an argument", () => {
        return request
          .get("/api/articles/?order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.ascendingBy("created_at");
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
      it("status 200: Returns status 200 and empty array when request received for article by topic, where topic exists but has no articles", () => {
        return request
          .get("/api/articles/?topic=paper")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.eql([]);
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
      it("status 200: where author on query does exist, but has not created any articles", () => {
        return request
          .get("/api/articles/?author=lurker")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.eql([]);
          });
      });
    });
  });

  describe("/api", () => {
    describe("GET", () => {
      it("status 200: returns a JSON describing all the available endpoints on the API ", () => {
        return request
          .get("/api/")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.eql({
              "GET /api": {
                description:
                  "serves up a json representation of all the available endpoints of the api"
              },
              "GET /api/topics": {
                description: "serves an array of all topics",
                queries: [],
                exampleResponse: {
                  topics: [{ slug: "football", description: "Footie!" }]
                }
              },
              "GET /api/articles": {
                description: "serves an array of all topics",
                queries: ["author", "topic", "sort_by", "order"],
                exampleResponse: {
                  articles: [
                    {
                      title: "Seafood substitutions are increasing",
                      topic: "cooking",
                      author: "weegembump",
                      body: "Text from the article..",
                      created_at: "2018-11-15T12:21:54.171Z"
                    }
                  ]
                }
              },
              "GET /api/articles/:article_id": {
                description:
                  "serves an array of requested article incuding created at and comment count",
                queries: [],
                exampleResponse: {
                  article: [
                    {
                      article_id: 1,
                      title: "Living in the shadow of a great man",
                      body: "I find this existence challenging",
                      votes: 100,
                      topic: "mitch",
                      author: "butter_bridge",
                      created_at: "2018-11-15T12:21:54.171Z",
                      comment_count: 13
                    }
                  ]
                }
              },
              "GET /api/articles/:article_id/comments": {
                description:
                  "serves an array of comments associated with requested article",
                queries: ["sort_by", "order"],

                exampleResponse: {
                  articles: [
                    {
                      comment_id: 2,
                      votes: 14,
                      created_at: "2018-11-15T12:21:54.171Z",
                      author: "butter_bridge",
                      body:
                        "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
                    }
                  ]
                }
              },
              "GET /api/users/:username": {
                description:
                  "serves an array of single user object when passed a valid username",
                queries: [],
                exampleResponse: {
                  user: [
                    {
                      username: "butter_bridge",
                      name: "jonny",
                      avatar_url:
                        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
                    }
                  ]
                }
              },
              "PATCH /api/articles/:article_id": {
                description:
                  "serves an array of single updated article object showing updated votes based on votes increase",
                queries: [],
                exampleResponse: {
                  articles: [
                    {
                      article_id: 1,
                      title: "Living in the shadow of a great man",
                      body: "I find this existence challenging",
                      votes: 100,
                      topic: "mitch",
                      author: "butter_bridge",
                      created_at: "2018-11-15T12:21:54.171Z"
                    }
                  ]
                }
              },
              "POST /api/articles/:article_id/comments": {
                description:
                  "serves an comment object response for posted comment",
                queries: [],
                exampleResponse: {
                  comment: {
                    comment_id: 19,
                    author: "butter_bridge",
                    article_id: 1,
                    votes: 0,
                    created_at: "2018-11-15T12:21:54.171Z",
                    body: "This is a comment!"
                  }
                }
              },
              "PATCH /api/comments/:comment_id": {
                description:
                  "serves an object of single updated comment object showing updated votes based on votes increase",
                queries: [],
                exampleResponse: [
                  {
                    comment: {
                      comment_id: 1,
                      author: "butter_bridge",
                      article_id: 9,
                      votes: 16,
                      created_at: "2017-11-22T12:36:03.389Z",
                      body:
                        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
                    }
                  }
                ]
              },
              "DELETE /api/comments/:comment_id": {
                description: "deletes an existing comment - no response",
                queries: [],
                exampleResponse: "no response"
              }
            });
            ``;
          });
      });
    });
  });
  describe("ADDITIONAL ERROR HANDLING", () => {
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
      it("status 405: returns 'Method Not Allowed' when passed an invalid method - PUT /api/articles/1/comments", () => {
        return request
          .put("/api/articles/1")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("status 405: returns 'Method Not Allowed' when passed an invalid method - PUT /api/comments/1", () => {
        return request
          .put("/api/comments/1")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("status 405: returns 'Method Not Allowed' when passed an invalid method - PUT /api/users/butter_bridge", () => {
        return request
          .put("/api/users/butter_bridge")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("status 405: returns 'Method Not Allowed' when passed an invalid method - DELETE/api", () => {
        return request
          .delete("/api")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method Not Allowed");
          });
      });
      it("status 404: returns 'Non existent route' when passed an invalid route", () => {
        return request
          .get("/non-existent-route")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Route does not exist");
          });
      });
    });
  });
});
