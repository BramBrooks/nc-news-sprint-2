const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("Takes an empty array and returns an empty array", () => {
    const input = [];
    const actual = formatDates(input);
    const expected = [];
    expect(actual).to.eql(expected);
  });

  it("returns correctly formatted PSQL format when passed an array of a single unix timestamp object ", () => {
    const input = [{ created_at: 1542284514171 }];
    const actual = formatDates(input);
    const expected = [{ created_at: new Date(1542284514171) }];
    expect(actual).to.eql(expected);
  });
  it("returns correctly formatted PSQL format when passed an array of a two unix timestamp objects ", () => {
    const input = [
      { created_at: 1416140514171 },
      { created_at: 1037708514171 }
    ];
    const actual = formatDates(input);
    const expected = [
      { created_at: new Date(1416140514171) },
      { created_at: new Date(1037708514171) }
    ];
    expect(actual).to.eql(expected);
  });
  it("returns correctly formatted PSQL format when passed an array of mutiple unix timestamp objects ", () => {
    const input = [
      { created_at: 1037708514171 },
      { created_at: 659276514171 },
      { created_at: 406988514171 },
      { created_at: 154700514171 }
    ];
    const actual = formatDates(input);
    const expected = [
      { created_at: new Date(1037708514171) },
      { created_at: new Date(659276514171) },
      { created_at: new Date(406988514171) },
      { created_at: new Date(154700514171) }
    ];
    expect(actual).to.eql(expected);
  });
});

describe("makeRefObj", () => {
  it("Takes an empty array and returns an empty object", () => {
    const input = [];
    const actual = makeRefObj(input);
    const expected = {};
    expect(actual).to.eql(expected);
  });
  it("Takes an array of a single object and returns correctly formatted reference object", () => {
    const input = [{ article_id: 1, title: "A" }];
    const actual = makeRefObj(input);
    const expected = { A: 1 };
    expect(actual).to.eql(expected);
  });
  it("Takes an array of a two objects and returns correctly formatted reference object", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" }
    ];
    const actual = makeRefObj(input);
    const expected = { A: 1, B: 2 };
    expect(actual).to.eql(expected);
  });
  it("Takes an array of multiple objects and returns correctly formatted reference object", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" },
      { article_id: 4, title: "D" }
    ];
    const actual = makeRefObj(input);
    const expected = { A: 1, B: 2, C: 3, D: 4 };
    expect(actual).to.eql(expected);
  });
});

describe("formatComments", () => {
  it("Takes an empty array as input and returns a new empty array", () => {
    const input = [];
    const actual = formatComments(input);
    const expected = [];
    expect(actual).to.eql(expected);
    expect(actual).to.not.equal(expected);
  });
  it("Takes an array containing single comment object and a reference object and returns correct output ", () => {
    const commentObjArr = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",

        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const refObj = { "They're not exactly dogs, are they?": 1 };
    const actual = formatComments(commentObjArr, refObj);
    const expected = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 1,

        author: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      }
    ];
    expect(actual).to.eql(expected);
    expect(actual).to.not.equal(expected);
  });
  it("Takes an array containing multiple comment objects and a reference object and returns correct output ", () => {
    const commentObjArr = [
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      },
      {
        body: "I am 100% sure that we're not completely sure.",
        belongs_to: "UNCOVERED: catspiracy to bring down democracy",
        created_by: "butter_bridge",
        votes: 1,
        created_at: 1069850163389
      }
    ];
    const refObj = {
      "UNCOVERED: catspiracy to bring down democracy": 1,
      "Living in the shadow of a great man": 2
    };
    const actual = formatComments(commentObjArr, refObj);
    const expected = [
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        article_id: 2,
        author: "icellusedkars",
        votes: 100,
        created_at: new Date(1448282163389)
      },
      {
        body: "I am 100% sure that we're not completely sure.",
        article_id: 1,
        author: "butter_bridge",
        votes: 1,
        created_at: new Date(1069850163389)
      }
    ];
    expect(actual).to.eql(expected);
    expect(actual).to.not.equal(expected);
  });
});
